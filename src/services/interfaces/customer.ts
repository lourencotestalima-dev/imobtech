import { CustomerEntity } from '../../entities/customer';
import { CustomerData, SearchParams } from '../../models/customer';

export interface ICustomerService {
  create(data: CustomerData, createdBy: string): Promise<void>;
  getAll(searchParams: SearchParams): Promise<CustomerEntity[]>;
  getById(id: string): Promise<CustomerEntity>;
  update(id: string, data: CustomerData, updatedBy: string): Promise<void>;
  delete(id: string, deletedBy: string): Promise<void>;
  uploadCsv(file: Express.Multer.File): Promise<void>;
}
