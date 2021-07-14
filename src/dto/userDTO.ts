import { Errors } from '@constants/errorMessages';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class UserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @MinLength(6, { message: Errors.PASSWORD_ERROR })
  password!: string;
}
