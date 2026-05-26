import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity } from 'typeorm';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { UserType } from '../models/user';
import { BaseEntity } from './base';
import argon2 from 'argon2';
import { DateTime } from 'luxon';

@Entity('user')
export class UserEntity extends BaseEntity {
  @IsString()
  @Column()
  name!: string;

  @IsEmail()
  @Column()
  email!: string;

  @IsString()
  @Column()
  password!: string;

  @IsInt()
  @Column({ type: 'integer' })
  type!: UserType;

  @BeforeInsert()
  async passwordEncrypted() {
    this.password = await argon2.hash(this.password);
  }
}