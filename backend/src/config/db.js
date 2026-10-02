import pg from 'pg';
import { config } from './index.js';

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

// Prevents an idle-client error from crashing the process.
pool.on('error', (err) => console.error('[pg] idle client error:', err.message));

export async function verifyDbConnection() {
  try {
    const { rows } = await pool.query('SELECT NOW() AS now');
    console.log(`[pg] connected at ${rows[0].now.toISOString()}`);
  } catch (err) {
    console.error('[pg] connection failed. Is `docker compose up -d` running?');
    throw err;
  }
}
