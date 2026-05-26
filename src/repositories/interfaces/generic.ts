import { DeepPartial, EntityTarget, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { QueryPartialEntity } from 'typeorm/browser';

export interface IGenericRepository {
  create<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>): Promise<T>;
  selectAllByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where?: FindOptionsWhere<T>): Promise<T[]>;
  selectOneByWhere<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>): Promise<T | null>;
  update<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>, data: QueryPartialEntity<T>): Promise<void>;
  upsert<T extends ObjectLiteral>(entity: EntityTarget<T>, data: DeepPartial<T>[], conflictPaths: (keyof T)[]): Promise<void>;
}