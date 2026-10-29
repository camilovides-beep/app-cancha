import dataSource from '../data-source';
import { seed } from '../seeds/seed';

/** Ejecuta el seed idempotente y termina. Usado por el entrypoint de Docker y `npm run seed`. */
async function run(): Promise<void> {
  await dataSource.initialize();
  await seed(dataSource);
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('❌ Error ejecutando el seed:', err);
  process.exit(1);
});
