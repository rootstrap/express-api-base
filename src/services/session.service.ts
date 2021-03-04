import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { Errors } from '@constants/errorMessages';

@Service()
export class SessionService {
  constructor(private readonly userService: UsersService) {}

  private readonly userRepository = getRepository<User>(User);

  async signUp(user: User) {
    let newUser: User;

    try {
      newUser = await this.userRepository.save(user);
    } catch (error) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    return newUser;
  }

  async signIn(email: string, password: string) {
    if (!this.userService.givenCredentials(email, password)) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    let user: User;
    try {
      user = await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    if (!this.userService.comparePassword(password, user.password)) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    const token = this.userService.generateToken(user);
    user.password = this.userService.hashPassword(user.password);
    return token;
  }
}
