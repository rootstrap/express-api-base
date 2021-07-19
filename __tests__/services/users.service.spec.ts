import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';

let usersService: UsersService;

beforeAll(async () => {
  usersService = Container.get(UsersService);
});

describe('compare password', () => {
  let userPassword: string;

  beforeEach(() => {
    userPassword = hashSync('password', genSaltSync());
  });

  it('checks that the password matches', () => {
    const hashedPassword = 'password';
    const result = usersService.comparePassword({
      password: hashedPassword,
      userPassword
    });
    expect(result).toBeTruthy();
  });

  it("checks that the password don't match", () => {
    const password = 'anotherpassword';
    const result = usersService.comparePassword({ password, userPassword });
    expect(result).toBeFalsy();
  });
});
