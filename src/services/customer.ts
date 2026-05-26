import { Service } from 'typedi';
import { CustomerEntity } from '../entities/customer';
import { GenericRepository } from '../repositories/generic';
import { ICustomerService } from './interfaces/customer';
import { AppError } from '../utils/errors/AppError';
import { CustomerData, CustomerTypeMap, SearchParams } from '../models/customer';
import csv from 'csv-parser';
import { Readable } from 'stream';

@Service()
export class CustomerService implements ICustomerService {
  constructor(
    private readonly customerRepository: GenericRepository
  ) {}

  async create(data: CustomerData): Promise<void> {
    try {
      const { name, email, taxIdentifier, type } = data;

      const customerToCreate = {
        name,
        email,
        taxIdentifier,
        type
      };

      await this.customerRepository.create(CustomerEntity, customerToCreate);
    } catch (err) {
      throw new AppError(400, `Erro ao cadastrar cliente: ${err}`);
    }
  }

  async getAll(searchParams: SearchParams): Promise<CustomerEntity[]> {
    return this.customerRepository.selectAllByWhere(CustomerEntity, {
      name: searchParams.name,
      email: searchParams.email,
      taxIdentifier: searchParams.taxIdentifier,
      type: searchParams.type
    }, {
      limit: searchParams.limit,
      order: searchParams.order,
      page: searchParams.page
    });
  }

  async update(id: string, data: CustomerData): Promise<void> {
    const customerFind = await this.customerRepository.selectOneByWhere(CustomerEntity, { id });

    if (!customerFind) {
      throw new AppError(404, 'Cliente não encontrado');
    }

    try {
      await this.customerRepository.update(CustomerEntity, { id }, data);
    } catch (err) {
      throw new AppError(400, `Erro ao atualizar cliente: ${err}`);
    }
  }

  async uploadCsv(file: Express.Multer.File): Promise<void> {
    const customers: Partial<CustomerEntity>[] = [];

    if (!file) {
      throw new AppError(404, 'Arquivo não encontrado');
    }

    try {
      await new Promise<void>((resolve, reject) => {
        Readable.from(file.buffer).pipe(csv()).on('data', (row) => {
          customers.push({
            name: row.name,
            email: row.email,
            taxIdentifier: row.taxIdentifier,
            type: CustomerTypeMap.get(row.type)
          });
        }).on('end', () => resolve()).on('error', reject);
      });

      await this.customerRepository.upsert(CustomerEntity, customers, ['taxIdentifier']);
    } catch (err) {
      throw new AppError(400, `Erro ao importar clientes: ${err}`);
    }
  }
}