import { Inject, Service } from 'typedi';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { Response } from 'express';
import { AuthService } from '../../services/auth';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { AuthLoginData, AuthRegisterData } from '../../models/auth';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(
    @Inject(() => AuthService) private authService: AuthService
  ) {}

  @Post('/register')
  async register(@Body() body: AuthRegisterData, @Res() res: Response): Promise<any> {
    try {
      await this.authService.register(body);
      return res.status(201).json({ message: 'Conta criada com sucesso' });
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Post('/login')
  async login(@Body() body: AuthLoginData, @Res() res: Response): Promise<any> {
    try {
      const response = await this.authService.login(body);
      return res.status(200).json(response);
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }
}
