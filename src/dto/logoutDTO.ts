import { IsEmail } from 'class-validator';

export class LogoutDTO {
  @IsEmail()
  email!: string;
}
