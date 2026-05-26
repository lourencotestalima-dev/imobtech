import { PaginationParams } from '.';

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