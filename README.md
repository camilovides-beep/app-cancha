# 🏟️ app-cancha · API de Reservas (Comfasucre)

API REST del **Sistema de Reservas de Canchas** de la Caja de Compensación
Familiar de Sucre. Construida con **NestJS + TypeScript** sobre **arquitectura
hexagonal** (Ports & Adapters), principios **SOLID**, **TypeORM/PostgreSQL** y
documentación **Swagger**. Es la migración del backend original (CodeIgniter 3 /
PHP) a un stack moderno.

> Frontend (Angular): repositorio **web-cancha**.

---

## 🚀 Puesta en marcha

### Con Docker (recomendado)

Requisitos: Docker + Docker Compose.

```bash
cp .env.example .env         # ajusta credenciales/secretos
docker build -t cancha-backend .
```

Lo normal es levantarlo desde el `docker-compose.yml` del stack completo (db +
backend + frontend). El `docker-entrypoint.sh` espera a PostgreSQL, ejecuta las
**migraciones** y el **seed idempotente** y luego arranca la API.

### Desarrollo local (sin Docker)

```bash
npm install
cp .env.example .env         # DB_HOST=localhost
npm run start:dev            # http://localhost:3000/api
```

| Recurso | URL |
|---------|-----|
| **API** | http://localhost:3000/api |
| **Swagger (docs)** | http://localhost:3000/api/docs |

**Credenciales iniciales** (seed, configurables en `.env`):

- Usuario: `admin`
- Contraseña: `Comfasucre2025*`

---

## ⚙️ Configuración (`.env`)

Copia `.env.example` a `.env`. Variables principales:

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP de la API (por defecto `3000`). |
| `CORS_ORIGIN` | Orígenes permitidos (coma-separados). |
| `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | Conexión PostgreSQL. `DB_HOST` es configurable para apuntar a una **BD remota**. |
| `DB_SSL` | `true` si la BD remota exige SSL. |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Firma y expiración del token. |
| `SEED_ADMIN_*` | Administrador inicial que crea el seed. |
| `PAYMENT_PROVIDER` / `MESSAGING_PROVIDER` / `DOCUMENT_LOOKUP_PROVIDER` | Selección de adaptadores (`stub` por defecto). |

> Las migraciones son idempotentes (`CREATE TABLE IF NOT EXISTS`), por lo que son
> seguras sobre una base de datos existente.

---

## 🏛️ Arquitectura — Hexagonal (Ports & Adapters)

Cada módulo de dominio se divide en tres capas, con la dependencia apuntando
siempre hacia el dominio (regla de dependencias / DIP):

```
src/modules/<dominio>/
├── domain/           # Entidades puras, value objects, PUERTOS (interfaces). Sin framework.
├── application/      # Casos de uso (servicios), DTOs. Orquesta el dominio.
└── infrastructure/   # ADAPTADORES: controladores (HTTP), repos TypeORM, mappers.
```

- El **dominio** no conoce NestJS, TypeORM ni HTTP.
- Los **puertos** son interfaces inyectadas por token.
- Los **adaptadores** se intercambian sin tocar el dominio.
- Las **excepciones de dominio** se traducen a HTTP en un único filtro.

Módulos: `auth`, `users`, `courts`, `reservations`, `settings`, `analytics`, `public`.

Código compartido en `src/shared/`: `config/`, `domain/` (value objects, puertos,
excepciones) e `infrastructure/` (seguridad, auth, adaptadores, http, database).

### Integraciones externas como puertos (hoy en modo *stub*)

| Puerto | Responsabilidad | Adaptador actual | Real (pendiente) |
|--------|-----------------|------------------|------------------|
| `PaymentGatewayPort` | Cobros | `StubPaymentGateway` | ePayco (PSE) |
| `MessagingPort` | Códigos/avisos | `StubMessaging` (log) | WhatsApp (Meta) |
| `DocumentLookupPort` | Categoría por documento | `StubDocumentLookup` | Webhook n8n |

Se cambian con `PAYMENT_PROVIDER`, `MESSAGING_PROVIDER` y
`DOCUMENT_LOOKUP_PROVIDER` en `.env`. **No se reescribe el dominio para añadir una
integración real: se implementa un adaptador nuevo.**

### Lógica de negocio clave (precios)

La tarifa se calcula en el dominio (`PricingService`):

1. **Franja** según la hora de inicio: Día (06–12), Tarde (12–18), Noche (18–06).
2. **Categoría** del usuario (A/B/C/D) por afiliación o documento.
3. Tarifa de la cancha `category_<cat>_<franja>_rate` → **total = tarifa × horas**.

---

## 🧪 Pruebas

```bash
npm test             # unitarias (dominio + casos de uso)
npm run test:cov     # con cobertura
```

Cubre el dominio (cálculo de precios, franjas, transiciones de reserva y
verificación) y los casos de uso (auth, canchas) con dobles de prueba de los puertos.

---

## 📋 Comandos útiles

```bash
npm run start:dev        # desarrollo con recarga
npm run build            # compilar a dist/
npm run start:prod       # ejecutar build (node dist/main.js)
npm run migration:run    # ejecutar migraciones
npm run seed             # ejecutar el seed
npm run lint             # eslint --fix
```

---

## 🧱 Stack

NestJS 11 · TypeScript 5.7 · TypeORM 0.3 · PostgreSQL · Passport/JWT · Swagger ·
class-validator · Jest.
