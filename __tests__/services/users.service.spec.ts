import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import '../utils/callbacks';

let usersService: UsersService;

beforeAll(async () => {
  usersService = Container.get(UsersService);
});

describe('given credentials', () => {
  let email: string;
  let password: string;

  beforeEach(() => {
    email = 'email@email.com';
    password = 'password';
  });

  it('checks that email and password are correct', () => {
    const result = usersService.givenCredentials(email, password);
    expect(result).toBeTruthy();
  });

  it('checks that password is empty', () => {
    const emptyPassword = '';
    const result = usersService.givenCredentials(email, emptyPassword);
    expect(result).toBeFalsy();
  });

  it('checks that email is empty', () => {
    const emptyEmail = '';
    const result = usersService.givenCredentials(emptyEmail, password);
    expect(result).toBeFalsy();
  });

  it('checks that email and password are empty', () => {
    const emptyEmail = '';
    const emptyPassword = '';
    const result = usersService.givenCredentials(emptyEmail, emptyPassword);
    expect(result).toBeFalsy();
  });
});

describe('compare password', () => {
  let userPassword: string;

  beforeEach(() => {
    userPassword = hashSync('password', genSaltSync());
  });

  it('checks that the password matches', () => {
    const hashedPassword = 'password';
    const result = usersService.comparePassword(hashedPassword, userPassword);
    expect(result).toBeTruthy();
  });

  it('checks that the password don\'t match', () => {
    const password = 'anotherpassword';
    const result = usersService.comparePassword(password, userPassword);
    expect(result).toBeFalsy();
  });
});
