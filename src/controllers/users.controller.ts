import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  BadRequestError
} from 'routing-controllers';
import { InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { SignUpDTO } from '@dto/signUpDTO';
import { EntityMapper } from '@utils/mapper/entityMapper.service';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Authorized()
  @Get()
  async index(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  @Get('/:id')
  async show(@Param('id') id: number): Promise<User | undefined> {
    return this.usersService.showUser(id);
  }

  @Post()
  async post(@Body() userDTO: SignUpDTO): Promise<InsertResult> {
    try {
      return await this.usersService.createUser(
        EntityMapper.mapTo(User, userDTO)
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/:id')
  async put(
    @Param('id') id: number,
    @Body() userDTO: SignUpDTO
  ): Promise<UpdateResult> {
    const user: User = EntityMapper.mapTo(User, userDTO);
    return this.usersService.editUser({ id, user });
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }
}
