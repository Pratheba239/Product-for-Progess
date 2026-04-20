import dotenv from 'dotenv';
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mssql',
    connection: {
      server: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ppdb',
      options: {
        encrypt: true, // For Azure SQL
        enableArithAbort: true,
        trustServerCertificate: true // Useful for local dev if certificate isn't trusted
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },

  production: {
    client: 'mssql',
    connection: {
      server: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: true,
        enableArithAbort: true
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  }
};
