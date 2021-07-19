import { IsString } from 'class-validator';
import { BaseUserDTO } from './baseUserDTO';

export class SignUpDTO extends BaseUserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}
