import { config } from './config/index.js';
import { pool, verifyDbConnection } from './config/db.js';
import { createApp } from './app.js';

async function main() {
  await verifyDbConnection();
  const server = createApp().listen(config.port, () =>
    console.log(`[api] listening on http://localhost:${config.port}`)
  );

  const shutdown = async (signal) => {
    console.log(`[api] ${signal} received, shutting down`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[api] failed to start:', err.message);
  process.exit(1);
});
