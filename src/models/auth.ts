import { IsEmail, IsInt, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { UserType } from './user';

export class AuthRegisterData {
  @JSONSchema({ example: 'João Silva' })
  @IsString()
  name!: string;

  @JSONSchema({ example: 'joao.silva@email.com' })
  @IsEmail()
  email!: string;

  @JSONSchema({ example: 'senha123' })
  @IsString()
  password!: string;

  @JSONSchema({ example: 1, description: '1 = Admin, 2 = Assistant' })
  @IsInt()
  type!: UserType;
}

export class AuthLoginData {
  @JSONSchema({ example: 'joao.silva@email.com' })
  @IsEmail()
  email!: string;

  @JSONSchema({ example: 'senha123' })
  @IsString()
  password!: string;
}