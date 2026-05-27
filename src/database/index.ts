import { DataSource } from 'typeorm';
import constants from '../utils/constants';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: constants.database.url,
  entities: [ path.join(__dirname, '../entities/**/*.{ts,js}') ],
  migrations: [ path.join(__dirname, 'migrations/**/*.{ts,js}') ],
  logging: false,
  synchronize: false,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})