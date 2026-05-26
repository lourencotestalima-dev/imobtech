import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity } from 'typeorm';
import { UserType } from '../models/user';
import { BaseEntity } from './base';
import argon2 from 'argon2';
import { DateTime } from 'luxon';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'integer' })
  type!: UserType;

  @BeforeInsert()
  async passwordEncrypted() {
    this.password = await argon2.hash(this.password);
  }
}