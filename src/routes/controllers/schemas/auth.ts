import { UserType } from '../../../models/user';

export const authRegisterSchema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const, example: 'João Silva' },
    email: { type: 'string' as const, example: 'joao@email.com' },
    password: { type: 'string' as const, example: '123456' },
    type: { type: 'number' as const, example: UserType.ADMIN }
  },
  required: ['name', 'email', 'password', 'type']
}