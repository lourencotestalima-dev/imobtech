import { UserEntity } from '../../entities/user';
import { AuthLoginData, AuthRegisterData } from '../../models/auth';

export interface IAuthService {
  register(data: AuthRegisterData): Promise<void>;
  login(data: AuthLoginData): Promise<{ token: string }>;
}