import { Service } from 'typedi';
import { UserEntity } from '../entities/user';
import { GenericRepository } from '../repositories/generic';
import { IAuthService } from './interfaces/auth';
import { UserType } from '../models/user';
import { AppError } from '../utils/errors/AppError';
import argon2 from 'argon2';
import constants from '../utils/constants';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthLoginData, AuthRegisterData } from '../models/auth';

@Service()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: GenericRepository
  ) {}

  public async register(data: AuthRegisterData): Promise<void> {
    try {
      const { name, email, password } = data;

      await this.userRepository.create(UserEntity, {
        name,
        email,
        password,
        type: UserType.ADMIN
      });
    } catch (err) {
      throw new AppError(400, `Erro ao criar conta: ${err}`);
    }
  }

  public async login(data: AuthLoginData): Promise<{ token: string }> {
    const { email, password } = data;

    const loginExists = await this.userRepository.selectOneByWhere(UserEntity, { email });

    if (!loginExists) {
      throw new AppError(400, 'Login incorreto');
    }

    const isValid = await argon2.verify(loginExists.password, password);

    if (!isValid) {
      throw new AppError(400, 'Login incorreto');
    }

    const secretKey = constants.jwt.privateKey;

    if (!secretKey) {
      throw new AppError(500, 'Internal Server Error');
    }

    const payload = {
      userId: loginExists.id,
      sessionId: crypto.randomUUID(),
      email: loginExists.email,
    }

    return {
      token: jwt.sign(payload, secretKey, { expiresIn: '1d' })
    };
  }
}