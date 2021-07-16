import { ErrorsMessages } from '@constants/errorMessages';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class UserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @MinLength(6, { message: ErrorsMessages.PASSWORD_ERROR })
  password!: string;
}
