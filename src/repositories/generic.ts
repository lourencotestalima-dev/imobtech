import { Inject, Service } from 'typedi';
import { DataSource, DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { IGenericRepository } from './interfaces/generic';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationParams } from '../models';

@Service()
export class GenericRepository implements IGenericRepository {
  constructor(
    @Inject(() => DataSource) private dataSource: DataSource
  ) {}

  private getRepo<T extends ObjectLiteral>(
    entity: EntityTarget<T>
  ): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async create<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>): Promise<T> {
    const dataToCreate = this.getRepo(entity).create(data);
    return this.getRepo(entity).save(dataToCreate);
  }

  async selectOneByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>): Promise<T | null> {
    return this.getRepo(entity).findOne({ where });
  }

  async selectAllByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where?: FindOptionsWhere<T>, pagination?: PaginationParams): Promise<T[]> {
    const page = Number(pagination?.page) || 1;
    const limit = Number(pagination?.limit) || 10;

    const skip = (page - 1) * limit;

    return this.getRepo(entity).find({
      where,
      skip,
      take: limit,
      order: pagination?.order ? { createdAt: pagination.order } as any : undefined
    });
  }

  async update<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>, data: QueryPartialEntity<T>): Promise<void> {
    const dataToUpdate = await this.getRepo(entity).findOne({ where });

    if (!dataToUpdate) {
      throw new Error('Entidade não encontrada');
    }

    await this.getRepo(entity).save(Object.assign(dataToUpdate, data));
  }

  async upsert<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>[], conflictPaths: (keyof T)[]): Promise<void> {
    const repo = this.getRepo(entity);
    await repo.upsert(data as T[], conflictPaths as string[]);
  }

  async softDelete<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>, deletedBy: string): Promise<void> {
    await this.getRepo(entity).update(where, { deletedBy } as unknown as QueryPartialEntity<T>);
    await this.getRepo(entity).softDelete(where);
  }
}
