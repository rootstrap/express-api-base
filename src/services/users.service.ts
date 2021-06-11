import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { AuthInterface, UserInterface } from '@interfaces';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) {}

  private readonly userRepository = getRepository<User>(User);

  givenCredentials(input: AuthInterface.ISignInInput): boolean {
    const { email, password } = input;
    return !!(email && password);
  }

  comparePassword(input: AuthInterface.IComparePasswordInput): boolean {
    const { password, userPassword } = input;
    return compareSync(password, userPassword);
  }

  generateToken(user: User) {
    return this.jwtService.createJWT(user);
  }

  hashPassword(password: string): string {
    return hashSync(password, genSaltSync());
  }

  listUsers() {
    return this.userRepository.find();
  }

  showUser(id: number) {
    return this.userRepository.findOne(id);
  }

  createUser(user: User) {
    return this.userRepository.insert(user);
  }

  editUser(input: UserInterface.IEditUserInput) {
    const { id, user } = input;
    return this.userRepository.update(id, user);
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }
}
