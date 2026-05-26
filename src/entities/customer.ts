import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';
import { CustomerType } from '../models/customer';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  taxIdentifier!: string;

  @Column()
  email!: string;

  @Column({ type: 'integer' })
  type!: CustomerType;
}