import dataSource from '../data-source';

/** Ejecuta las migraciones pendientes y termina. Usado por el entrypoint de Docker. */
async function run(): Promise<void> {
  await dataSource.initialize();
  const executed = await dataSource.runMigrations();
  if (executed.length === 0) {
    console.log('✅ Sin migraciones pendientes.');
  } else {
    executed.forEach((m) => console.log(`✅ Migración ejecutada: ${m.name}`));
  }
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('❌ Error ejecutando migraciones:', err);
  process.exit(1);
});
