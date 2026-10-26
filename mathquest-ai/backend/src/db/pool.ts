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
      const candidatePaths = [
        path.join(__dirname, 'migrations', '001_initial_schema.sql'),
        path.join(__dirname, '..', '..', 'src', 'db', 'migrations', '001_initial_schema.sql'),
        path.join(process.cwd(), 'src', 'db', 'migrations', '001_initial_schema.sql'),
        path.join(process.cwd(), 'backend', 'src', 'db', 'migrations', '001_initial_schema.sql'),
      ];
      const validPath = candidatePaths.find(p => fs.existsSync(p));
      if (validPath) {
        const sql = fs.readFileSync(validPath, 'utf8');
        await pool.query(sql);
        console.log(`✅ PostgreSQL: Initial schema and badges verified from ${validPath}`);
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

export interface DbDiagnostics {
  configured: boolean;
  connected: boolean;
  mode: 'postgres' | 'in-memory-fallback';
  serverTime?: string;
  tables?: string[];
  error?: string;
}

export async function getDbDiagnostics(): Promise<DbDiagnostics> {
  if (!pool) {
    return {
      configured: false,
      connected: false,
      mode: 'in-memory-fallback',
      error: 'DATABASE_URL environment variable is not configured.',
    };
  }

  try {
    const timeRes = await pool.query('SELECT NOW()');
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    return {
      configured: true,
      connected: true,
      mode: 'postgres',
      serverTime: timeRes.rows[0]?.now ? new Date(timeRes.rows[0].now).toISOString() : undefined,
      tables: tablesRes.rows.map(r => r.table_name),
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      mode: 'in-memory-fallback',
      error: err.message,
    };
  }
}
