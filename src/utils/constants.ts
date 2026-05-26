import dotenv from 'dotenv';

dotenv.config();

interface IConstants {
  port: number;
  database: {
    url: string
  },
  jwt: {
    privateKey: string;
  }
}

const constants: IConstants = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL || ''
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY || '',
  },
}

export default constants;