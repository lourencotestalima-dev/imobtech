import { IsEmail, IsInt, IsString } from 'class-validator';
import { PaginationParams } from '.';
import { JSONSchema } from 'class-validator-jsonschema';

export class CustomerData {
  @JSONSchema({ example: 'Henrique Oliveira' })
  @IsString()
  name!: string;

  @JSONSchema({ example: '45215952860' })
  @IsString()
  taxIdentifier!: string;

  @JSONSchema({ example: 'henriqueoliveira@gmail.com' })
  @IsEmail()
  email!: string;

  @JSONSchema({ example: 1, description: '1 = Person, 2 = Enterprise' })
  @IsInt()
  type!: CustomerType;
}

export enum CustomerType {
  PERSON = 1,
  ENTERPRISE = 2
}

export interface SearchParams extends PaginationParams {
  name?: string;
  taxIdentifier?: string;
  email?: string;
  type?: CustomerType;
}

export const CustomerTypeMap = new Map<string, CustomerType>([
  [ 'PF', CustomerType.PERSON ],
  [ 'PJ', CustomerType.ENTERPRISE ]
]);