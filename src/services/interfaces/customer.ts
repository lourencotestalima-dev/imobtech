import { CustomerEntity } from '../../entities/customer';
import { SearchParams } from '../../models/customer';

export interface ICustomerService {
  create(data: CustomerEntity): Promise<void>;
  getAll(searchParams: SearchParams): Promise<CustomerEntity[]>;
  update(id: string, data: CustomerEntity): Promise<void>;
}