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
      password: process.env.DB_PASSWORD || 'YourStrong!Passw0rd',
      database: process.env.DB_NAME || 'ppdb',
      options: {
        encrypt: false, // For local dev, usually false
        trustServerCertificate: true
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  },

  production: {
    client: 'mssql',
    connection: process.env.DATABASE_URL || {
      server: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};
