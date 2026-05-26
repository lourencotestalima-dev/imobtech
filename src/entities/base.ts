import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Transform(({ value }) => DateTime.fromJSDate(value).setZone('America/Sao_Paulo').toISO())
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column()
  createdBy?: string;

  @Transform(({ value }) => DateTime.fromJSDate(value).setZone('America/Sao_Paulo').toISO())
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column()
  updatedBy?: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Column()
  deletedBy?: string;
}