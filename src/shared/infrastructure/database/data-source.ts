import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadEnv } from '../../config/env';

/**
 * Construye las opciones de conexión a PostgreSQL a partir del entorno.
 * Usado tanto por el módulo de Nest como por la CLI de migraciones/seed,
 * de modo que app y herramientas comparten exactamente la misma configuración.
 */
export function buildDataSourceOptions(): DataSourceOptions {
  const env = loadEnv();
  return {
    type: 'postgres',
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
    synchronize: env.db.synchronize,
    // Entidades de persistencia de todos los módulos.
    entities: [join(__dirname, '..', '..', '..', '**', '*.orm-entity.{ts,js}')],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'migrations_history',
  };
}

// Instancia usada por la CLI de TypeORM (migration:run / migration:revert).
const dataSource = new DataSource(buildDataSourceOptions());
export default dataSource;
