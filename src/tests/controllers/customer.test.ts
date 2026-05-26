import 'reflect-metadata';
import { Response } from 'express';
import { CustomerController } from '../../routes/controllers/customer';
import { CustomerService } from '../../services/customer';
import { AppError } from '../../utils/errors/AppError';
import { CustomerData, CustomerType, SearchParams } from '../../models/customer';
import { ICustomRequest } from '../../models/request';

const mockCustomerService = {
  create: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  uploadCsv: jest.fn(),
};

const makeMockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeMockReq = (query: object = {}): ICustomRequest => {
  return {
    query,
    session: { userId: 'user-id', sessionId: 'session-id', email: 'user@example.com' },
  } as unknown as ICustomRequest;
};

describe('CustomerController', () => {
  let customerController: CustomerController;
  let res: Response;
  let req: ICustomRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    customerController = new CustomerController(mockCustomerService as unknown as CustomerService);
    res = makeMockRes();
    req = makeMockReq();
  });

  describe('create', () => {
    const body = {
      name: 'John Doe',
      email: 'john@example.com',
      taxIdentifier: '12345678900',
      type: CustomerType.PERSON,
    } as CustomerData;

    it('should call service with body and session userId and return null', async () => {
      mockCustomerService.create.mockResolvedValue(undefined);

      const result = await customerController.create(req, body, res);

      expect(mockCustomerService.create).toHaveBeenCalledWith(body, req.session!.userId);
      expect(result).toBeNull();
    });

    it('should return 400 when service throws AppError', async () => {
      mockCustomerService.create.mockRejectedValue(new AppError(400, 'Erro ao cadastrar cliente'));

      await customerController.create(req, body, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao cadastrar cliente' });
    });

    it('should return 500 on unexpected error', async () => {
      mockCustomerService.create.mockRejectedValue(new Error('Unexpected'));

      await customerController.create(req, body, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getAll', () => {
    const searchParams: SearchParams = { name: 'John', page: 1, limit: 10, order: 'ASC' };

    it('should call service with query params and return result', async () => {
      const customers = [{ id: '1', name: 'John Doe' }];
      const reqWithQuery = makeMockReq(searchParams);
      mockCustomerService.getAll.mockResolvedValue(customers);

      const result = await customerController.getAll(reqWithQuery, res);

      expect(mockCustomerService.getAll).toHaveBeenCalledWith(searchParams);
      expect(result).toEqual(customers);
    });

    it('should return 400 when service throws AppError', async () => {
      mockCustomerService.getAll.mockRejectedValue(new AppError(400, 'Erro ao buscar clientes'));

      await customerController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar clientes' });
    });

    it('should return 500 on unexpected error', async () => {
      mockCustomerService.getAll.mockRejectedValue(new Error('Unexpected'));

      await customerController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('update', () => {
    const id = 'customer-id';
    const body = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      taxIdentifier: '98765432100',
      type: CustomerType.ENTERPRISE,
    } as CustomerData;

    it('should call service with id, body and session userId and return null', async () => {
      mockCustomerService.update.mockResolvedValue(undefined);

      const result = await customerController.update(req, id, body, res);

      expect(mockCustomerService.update).toHaveBeenCalledWith(id, body, req.session!.userId);
      expect(result).toBeNull();
    });

    it('should return 404 when service throws AppError', async () => {
      mockCustomerService.update.mockRejectedValue(new AppError(404, 'Cliente não encontrado'));

      await customerController.update(req, id, body, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente não encontrado' });
    });

    it('should return 500 on unexpected error', async () => {
      mockCustomerService.update.mockRejectedValue(new Error('Unexpected'));

      await customerController.update(req, id, body, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('uploadCsv', () => {
    const file = { buffer: Buffer.from('name,email,taxIdentifier,type\nJohn,john@example.com,12345678900,PF') } as Express.Multer.File;

    it('should call service with file and return null', async () => {
      mockCustomerService.uploadCsv.mockResolvedValue(undefined);

      const result = await customerController.uploadCsv(file, res);

      expect(mockCustomerService.uploadCsv).toHaveBeenCalledWith(file);
      expect(result).toBeNull();
    });

    it('should return 400 when service throws AppError', async () => {
      mockCustomerService.uploadCsv.mockRejectedValue(new AppError(400, 'Erro ao importar clientes'));

      await customerController.uploadCsv(file, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao importar clientes' });
    });

    it('should return 500 on unexpected error', async () => {
      mockCustomerService.uploadCsv.mockRejectedValue(new Error('Unexpected'));

      await customerController.uploadCsv(file, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
