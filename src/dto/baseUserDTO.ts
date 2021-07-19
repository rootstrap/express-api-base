import { IsEmail, MinLength } from 'class-validator';

export class BaseUserDTO {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
