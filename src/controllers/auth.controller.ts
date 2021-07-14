import {
  JsonController,
  Body,
  Post,
  BodyParam,
  BadRequestError,
  Req,
  Authorized,
  Res
} from 'routing-controllers';
import omit from 'lodash/omit';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Errors, ErrorsMessages } from '@constants/errorMessages';
import { UserDTO } from '@dto/userDTO';
import { Request } from 'express';
import { EntityMapper } from '@utils/mapper/entityMapper.service';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/signup')
  async signUp(@Body({ validate: true }) user: UserDTO, @Res() response: any) {
    const newUser = await this.sessionService.signUp(
      EntityMapper.mapTo(User, user)
    );
    return response.send(omit(newUser, ['password']));
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string
  ) {
    try {
      const token = await this.sessionService.signIn({ email, password });
      return { token };
    } catch (error) {
      throw Errors[error.message] || Errors[ErrorsMessages.INTERNAL_SERVER_ERROR];
    }
  }

  @Authorized()
  @Post('/logout')
  async logOut(@BodyParam('email') email: string, @Req() request: Request) {
    try {
      const token = request.headers['authorization'] as string;
      const tokenAddToBlacklist: number = await this.sessionService.logOut({
        email,
        token
      });
      return {
        logout: !!tokenAddToBlacklist
      };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}
