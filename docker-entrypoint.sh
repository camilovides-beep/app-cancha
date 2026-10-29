#!/bin/sh
set -e

echo "⏳ Esperando a PostgreSQL en ${DB_HOST}:${DB_PORT}..."
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" >/dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL disponible."

echo "📦 migrations → ejecutando migraciones..."
node dist/shared/infrastructure/database/cli/run-migrations.js || {
  echo "⚠️  Fallo al ejecutar migraciones"; exit 1;
}

echo "🌱 seed → cargando datos iniciales (idempotente)..."
node dist/shared/infrastructure/database/cli/run-seed.js || echo "⚠️  Seed omitido/parcial"

echo "🚀 Iniciando API..."
exec "$@"
