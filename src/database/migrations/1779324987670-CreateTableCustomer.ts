import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableCustomer1779324987670 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'customer',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'gen_random_uuid()'
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'taxIdentifier',
          type: 'varchar',
          isNullable: false,
          isUnique: true
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: false,
          isUnique: true
        },
        {
          name: 'type',
          type: 'integer',
          isNullable: false
        },
        {
          name: 'createdAt',
          type: 'timestamptz',
          default: 'now()'
        },
        {
          name: 'createdBy',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'updatedAt',
          type: 'timestamptz',
          default: 'now()'
        },
        {
          name: 'updatedBy',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'deletedAt',
          type: 'timestamptz',
          isNullable: true
        },
        {
          name: 'deletedBy',
          type: 'varchar',
          isNullable: true
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customer');
  }
}