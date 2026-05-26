import { DataSource } from 'typeorm';
import constants from '../utils/constants';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: constants.database.url,
  entities: [ path.join(__dirname, '../entities/**/*.ts') ],
  migrations: [ path.join(__dirname, 'migrations/**/*.ts') ],
  logging: false,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false
  }
})