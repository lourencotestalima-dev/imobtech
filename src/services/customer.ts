import { Service } from 'typedi';
import { CustomerEntity } from '../entities/customer';
import { GenericRepository } from '../repositories/generic';
import { ICustomerService } from './interfaces/customer';
import { AppError } from '../utils/errors/AppError';
import { CustomerData, CustomerTypeMap, SearchParams } from '../models/customer';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import csv from 'csv-parser';
import { Readable } from 'stream';

@Service()
export class CustomerService implements ICustomerService {
  constructor(
    private readonly customerRepository: GenericRepository
  ) {}

  async create(data: CustomerData, createdBy: string): Promise<void> {
    try {
      const { name, email, taxIdentifier, type } = data;

      await this.customerRepository.create(CustomerEntity, {
        name,
        email,
        taxIdentifier,
        type,
        createdBy
      });
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

  async getById(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.selectOneByWhere(CustomerEntity, { id });

    if (!customer) {
      throw new AppError(404, 'Cliente não encontrado');
    }

    return customer;
  }

  async update(id: string, data: CustomerData, updatedBy: string): Promise<void> {
    const customerFind = await this.customerRepository.selectOneByWhere(CustomerEntity, { id });

    if (!customerFind) {
      throw new AppError(404, 'Cliente não encontrado');
    }

    try {
      await this.customerRepository.update(CustomerEntity, { id }, { ...data, updatedBy });
    } catch (err) {
      throw new AppError(400, `Erro ao atualizar cliente: ${err}`);
    }
  }

  async delete(id: string, deletedBy: string): Promise<void> {
    const customer = await this.customerRepository.selectOneByWhere(CustomerEntity, { id });

    if (!customer) {
      throw new AppError(404, 'Cliente não encontrado');
    }

    try {
      await this.customerRepository.softDelete(CustomerEntity, { id }, deletedBy);
    } catch (err) {
      throw new AppError(400, `Erro ao excluir cliente: ${err}`);
    }
  }

  async uploadCsv(file: Express.Multer.File): Promise<void> {
    const customers: Partial<CustomerEntity>[] = [];
    const errors: string[] = [];

    if (!file) {
      throw new AppError(404, 'Arquivo não encontrado');
    }

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

    for (let i = 0; i < customers.length; i++) {
      const instance = plainToInstance(CustomerData, customers[i]);
      const validationErrors = await validate(instance);

      if (validationErrors.length > 0) {
        const messages = validationErrors.map(e => Object.values(e.constraints ?? {}).join(', ')).join('; ');
        errors.push(`Linha ${i + 2}: ${messages}`);
      }
    }

    if (errors.length > 0) {
      throw new AppError(400, `Erros de validação no CSV: ${errors.join(' | ')}`);
    }

    try {
      await this.customerRepository.upsert(CustomerEntity, customers, ['taxIdentifier']);
    } catch (err) {
      throw new AppError(400, `Erro ao importar clientes: ${err}`);
    }
  }
}
