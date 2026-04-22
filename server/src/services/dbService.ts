import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection: any = process.env.DATABASE_URL || {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong!Passw0rd',
  database: process.env.DB_NAME || 'ppdb',
  options: {
    encrypt: process.env.NODE_ENV === 'production',
    trustServerCertificate: process.env.NODE_ENV !== 'production'
  }
};

const db = knex({
  client: 'mssql',
  connection: dbConnection,
  pool: { min: 2, max: 10 }
});

export default db;
