import 'reflect-metadata';
import { CustomerService } from '../../services/customer';
import { CustomerEntity } from '../../entities/customer';
import { AppError } from '../../utils/errors/AppError';
import { CustomerData, CustomerType, SearchParams } from '../../models/customer';

const mockRepository = {
  create: jest.fn(),
  selectOneByWhere: jest.fn(),
  selectAllByWhere: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
};

describe('CustomerService', () => {
  let customerService: CustomerService;

  beforeEach(() => {
    jest.clearAllMocks();
    customerService = new CustomerService(mockRepository as any);
  });

  describe('create', () => {
    const customerData: CustomerData = {
      name: 'John Doe',
      email: 'john@example.com',
      taxIdentifier: '12345678900',
      type: CustomerType.PERSON,
    };
    const createdBy = 'user-id';

    it('should create customer with correct data including createdBy', async () => {
      mockRepository.create.mockResolvedValue({});

      await customerService.create(customerData, createdBy);

      expect(mockRepository.create).toHaveBeenCalledWith(CustomerEntity, {
        name: customerData.name,
        email: customerData.email,
        taxIdentifier: customerData.taxIdentifier,
        type: customerData.type,
        createdBy,
      });
    });

    it('should throw AppError when repository fails', async () => {
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(customerService.create(customerData, createdBy)).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('getAll', () => {
    const searchParams: SearchParams = {
      name: 'John',
      email: 'john@example.com',
      taxIdentifier: '12345678900',
      type: CustomerType.PERSON,
      page: 1,
      limit: 10,
      order: 'ASC',
    };

    it('should call repository with correct params and return result', async () => {
      const customers = [{ id: '1', name: 'John Doe' }];
      mockRepository.selectAllByWhere.mockResolvedValue(customers);

      const result = await customerService.getAll(searchParams);

      expect(mockRepository.selectAllByWhere).toHaveBeenCalledWith(
        CustomerEntity,
        {
          name: searchParams.name,
          email: searchParams.email,
          taxIdentifier: searchParams.taxIdentifier,
          type: searchParams.type,
        },
        {
          limit: searchParams.limit,
          order: searchParams.order,
          page: searchParams.page,
        }
      );
      expect(result).toEqual(customers);
    });
  });

  describe('update', () => {
    const id = 'customer-id';
    const customerData: CustomerData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      taxIdentifier: '98765432100',
      type: CustomerType.ENTERPRISE,
    };
    const updatedBy = 'user-id';

    it('should update customer with correct data including updatedBy', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue({ id, name: 'John Doe' });
      mockRepository.update.mockResolvedValue(undefined);

      await customerService.update(id, customerData, updatedBy);

      expect(mockRepository.selectOneByWhere).toHaveBeenCalledWith(CustomerEntity, { id });
      expect(mockRepository.update).toHaveBeenCalledWith(CustomerEntity, { id }, { ...customerData, updatedBy });
    });

    it('should throw AppError 404 when customer not found', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue(null);

      await expect(customerService.update(id, customerData, updatedBy)).rejects.toMatchObject({
        errorCode: 404,
        message: 'Cliente não encontrado',
      });
    });

    it('should throw AppError when repository update fails', async () => {
      mockRepository.selectOneByWhere.mockResolvedValue({ id, name: 'John Doe' });
      mockRepository.update.mockRejectedValue(new Error('DB error'));

      await expect(customerService.update(id, customerData, updatedBy)).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('uploadCsv', () => {
    it('should throw AppError 404 when file is missing', async () => {
      await expect(customerService.uploadCsv(null as any)).rejects.toMatchObject({
        errorCode: 404,
        message: 'Arquivo não encontrado',
      });
    });

    it('should parse CSV and upsert customers', async () => {
      const csvContent = 'name,email,taxIdentifier,type\nJohn Doe,john@example.com,12345678900,PF\n';
      const file = { buffer: Buffer.from(csvContent) } as Express.Multer.File;
      mockRepository.upsert.mockResolvedValue(undefined);

      await customerService.uploadCsv(file);

      expect(mockRepository.upsert).toHaveBeenCalledWith(
        CustomerEntity,
        [{ name: 'John Doe', email: 'john@example.com', taxIdentifier: '12345678900', type: CustomerType.PERSON }],
        ['taxIdentifier']
      );
    });

    it('should throw AppError when upsert fails', async () => {
      const csvContent = 'name,email,taxIdentifier,type\nJohn,john@example.com,12345678900,PF\n';
      const file = { buffer: Buffer.from(csvContent) } as Express.Multer.File;
      mockRepository.upsert.mockRejectedValue(new Error('DB error'));

      await expect(customerService.uploadCsv(file)).rejects.toBeInstanceOf(AppError);
    });
  });
});
