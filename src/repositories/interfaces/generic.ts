import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { QueryPartialEntity } from 'typeorm/browser';
import { PaginationParams } from '../models';

export interface IGenericRepository {
  create<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>): Promise<T>;
  selectAllByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where?: FindOptionsWhere<T>, pagination?: PaginationParams): Promise<T[]>;
  selectOneByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>): Promise<T | null>;
  update<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>, data: QueryPartialEntity<T>): Promise<void>;
  upsert<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>[], conflictPaths: (keyof T)[]): Promise<void>;
  softDelete<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>, deletedBy: string): Promise<void>;
}
