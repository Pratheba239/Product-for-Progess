import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection: any = {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ppdb',
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
  }
};

const db = knex({
  client: 'mssql',
  connection: dbConnection,
  pool: { min: 2, max: 10 }
});

export default db;
