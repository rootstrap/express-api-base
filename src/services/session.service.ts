import { ErrorsMessages } from '@constants/errorMessages';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { RedisService } from '@services/redis.service';
import { AuthInterface } from '@interfaces';

@Service()
export class SessionService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService
  ) {}

  private readonly userRepository = getRepository<User>(User);

  async signUp(user: User) {
    let newUser: User;

    try {
      this.userService.hashUserPassword(user);
      newUser = await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error.detail ?? ErrorsMessages.MISSING_PARAMS);
    }

    return newUser;
  }

  async signIn(input: AuthInterface.ISignInInput) {
    const { email, password } = input;
    if (!this.userService.givenCredentials({ email, password })) {
      throw new Error(ErrorsMessages.MISSING_PARAMS);
    }

    let user: User;
    try {
      user = await User.createQueryBuilder('user')
        .addSelect('user.password')
        .where({ email })
        .getOneOrFail();
    } catch (error) {
      throw new Error(ErrorsMessages.INVALID_CREDENTIALS);
    }

    if (
      !this.userService.comparePassword({
        password,
        userPassword: user.password
      })
    ) {
      throw new Error(ErrorsMessages.INVALID_CREDENTIALS);
    }

    const token = this.userService.generateToken(user);
    this.userService.hashUserPassword(user);
    return token;
  }

  logOut(input: AuthInterface.ITokenToBlacklistInput): Promise<number> {
    try {
      const { email } = input;
      if (!email) {
        throw new Error(ErrorsMessages.MISSING_PARAMS);
      }
      const tokenAddedToBlacklist =
        this.redisService.addTokenToBlacklist(input);
      if (!tokenAddedToBlacklist) {
        throw new Error(ErrorsMessages.REDIS_ERROR_SET_TOKEN);
      }
      return tokenAddedToBlacklist;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
