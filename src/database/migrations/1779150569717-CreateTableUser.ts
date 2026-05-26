import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1779150569717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'user',
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
          name: 'email',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: false
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
    await queryRunner.dropTable('user');
  }
}