import { execSync } from 'node:child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  throw new Error('Migration name not provided');
}

const path = `src/database/migrations/${migrationName}`;
execSync(`ts-node ./node_modules/typeorm/cli.js migration:create ${path}`, { stdio: 'inherit' });