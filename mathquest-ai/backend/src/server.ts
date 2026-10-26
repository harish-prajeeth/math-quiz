import { createApp } from './app';
import { env } from './config/env';
import { initDatabase } from './db/pool';

async function bootstrap() {
  await initDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════╗
  ║     🧮 MathQuest AI Server Running       ║
  ║                                           ║
  ║     Port: ${String(env.PORT).padEnd(30)}║
  ║     Mode: ${env.NODE_ENV.padEnd(30)}║
  ║     Time: ${new Date().toLocaleString().padEnd(30)}║
  ╚═══════════════════════════════════════════╝
    `);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server bootstrap error:', err);
  process.exit(1);
});
