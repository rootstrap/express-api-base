import { ErrorsMessages } from '@constants/errorMessages';
import { IsEmail, MinLength } from 'class-validator';

export class BaseUserDTO {
  @IsEmail()
  email!: string;

  @MinLength(6, { message: ErrorsMessages.PASSWORD_ERROR })
  password!: string;
}
