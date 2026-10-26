import { Pool, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;
let isConnected = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  } catch (err) {
    console.warn('Could not initialize PostgreSQL Pool:', err);
  }
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured or Pool is unavailable.');
  }
  return pool.query<T>(text, params);
}

export function getPool(): Pool | null {
  return pool;
}

export function isDbConnected(): boolean {
  return isConnected;
}

/**
 * Test DB connection and run migrations if connected
 */
export async function initDatabase(): Promise<boolean> {
  if (!pool) {
    console.log('ℹ️ PostgreSQL: DATABASE_URL not set. Running in resilient in-memory mode.');
    isConnected = false;
    return false;
  }

  try {
    const res = await pool.query('SELECT NOW()');
    isConnected = true;
    console.log(`✅ PostgreSQL (Neon) connected at ${res.rows[0].now}`);

    // Automatically ensure initial schema exists
    try {
      const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
      if (fs.existsSync(migrationPath)) {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await pool.query(sql);
        console.log('✅ PostgreSQL: Initial schema and badges verified.');
      }
    } catch (migErr) {
      console.warn('Notice: Migration auto-run check:', migErr);
    }

    return true;
  } catch (err: any) {
    console.warn(`⚠️ PostgreSQL connection failed: ${err.message}. Falling back to in-memory mode.`);
    isConnected = false;
    return false;
  }
}
