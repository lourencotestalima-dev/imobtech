import 'reflect-metadata';
import { AuthService } from '../../services/auth';
import { UserEntity } from '../../entities/user';
import { AppError } from '../../utils/errors/AppError';
import { UserType } from '../../models/user';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({ verify: jest.fn() }));

jest.mock('../../utils/constants', () => ({
  __esModule: true,
  default: { jwt: { privateKey: 'test-secret-key' } },
}));

const mockRepository = {
  create: jest.fn(),
  selectOneByWhere: jest.fn(),
  selectAllByWhere: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockRepository as any);
  });

  describe('register', () => {
    const registerData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      type: UserType.ADMIN,
    };

    it('should create user with correct data', async () => {
      mockRepository.create.mockResolvedValue({});

      await authService.register(registerData);

      expect(mockRepository.create).toHaveBeenCalledWith(UserEntity, {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        type: UserType.ADMIN,
      });
    });

    it('should throw AppError when repository fails', async () => {
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(authService.register(registerData)).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-id',
      email: 'john@example.com',
      password: 'hashed-password',
    };

    it('should return token when credentials are valid', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginData);

      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
    });

    it('should throw AppError when user is not found', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toMatchObject({
        errorCode: 400,
        message: 'Login incorreto',
      });
    });

    it('should throw AppError when password is invalid', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toMatchObject({
        errorCode: 400,
        message: 'Login incorreto',
      });
    });
  });
});
