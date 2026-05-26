import { Column, Entity } from 'typeorm';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { BaseEntity } from './base';
import { CustomerType } from '../models/customer';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @IsString()
  @Column()
  name!: string;

  @IsString()
  @Column({ unique: true })
  taxIdentifier!: string;

  @IsEmail()
  @Column()
  email!: string;

  @IsInt()
  @Column({ type: 'integer' })
  type!: CustomerType;
}