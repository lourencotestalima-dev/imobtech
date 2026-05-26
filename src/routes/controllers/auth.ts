import { Inject, Service } from 'typedi';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { Response } from 'express';
import { AuthService } from '../../services/auth';
import { UserEntity } from '../../entities/user';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { OpenAPI } from 'routing-controllers-openapi';
import { authRegisterSchema } from './schemas/auth';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(
    @Inject(() => AuthService) private authService: AuthService
  ) {}

  async register(@Body() body: UserEntity, @Res() res: Response): Promise<any> {
    try {
      const response = await this.authService.register(body);
      return res.status(200).json(response);
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Post('/login')
  async login(@Body() body: UserEntity, @Res() res: Response): Promise<any> {
    try {
      const response = await this.authService.login(body);
      return res.status(200).json(response);
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }
}