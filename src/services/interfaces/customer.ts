import { CustomerEntity } from '../../entities/customer';
import { CustomerData, SearchParams } from '../../models/customer';

export interface ICustomerService {
  create(data: CustomerData): Promise<void>;
  getAll(searchParams: SearchParams): Promise<CustomerEntity[]>;
  update(id: string, data: CustomerData): Promise<void>;
}