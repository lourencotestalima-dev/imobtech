import { UserEntity } from '../../entities/user';

export interface IAuthService {
  register(data: UserEntity): Promise<void>;
  login(data: UserEntity): Promise<{ token: string }>;
}