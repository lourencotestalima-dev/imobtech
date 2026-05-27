import 'reflect-metadata';
import { Response } from 'express';
import { AuthController } from '../../routes/controllers/auth';
import { AuthService } from '../../services/auth';
import { AppError } from '../../utils/errors/AppError';
import { AuthLoginData, AuthRegisterData } from '../../models/auth';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

const makeMockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let authController: AuthController;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    authController = new AuthController(mockAuthService as unknown as AuthService);
    res = makeMockRes();
  });

  describe('register', () => {
    const body = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      type: 1,
    } as AuthRegisterData;

    it('should call service with body and return 201 with success message', async () => {
      mockAuthService.register.mockResolvedValue(undefined);

      await authController.register(body, res);

      expect(mockAuthService.register).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conta criada com sucesso' });
    });

    it('should return 400 when service throws AppError', async () => {
      mockAuthService.register.mockRejectedValue(new AppError(400, 'Erro ao criar conta'));

      await authController.register(body, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar conta' });
    });

    it('should return 500 on unexpected error', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Unexpected'));

      await authController.register(body, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('login', () => {
    const body = {
      email: 'john@example.com',
      password: 'password123',
    } as AuthLoginData;

    it('should call service with body and return 200 with token', async () => {
      const token = { token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(token);

      await authController.login(body, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(token);
    });

    it('should return 400 when service throws AppError', async () => {
      mockAuthService.login.mockRejectedValue(new AppError(400, 'Login incorreto'));

      await authController.login(body, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login incorreto' });
    });

    it('should return 500 on unexpected error', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Unexpected'));

      await authController.login(body, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});