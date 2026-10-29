/**
 * Lectura centralizada y tipada de variables de entorno.
 * Única fuente de verdad de configuración para la app y la CLI de TypeORM.
 */
export interface AppEnv {
  nodeEnv: string;
  port: number;
  corsOrigin: string[];
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    synchronize: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  seedAdmin: {
    username: string;
    email: string;
    password: string;
    name: string;
  };
  providers: {
    payment: string;
    messaging: string;
    documentLookup: string;
  };
}

const bool = (v: string | undefined, def = false): boolean =>
  v === undefined ? def : ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());

export function loadEnv(): AppEnv {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'cancha',
      password: process.env.DB_PASSWORD ?? 'cancha_secret',
      database: process.env.DB_DATABASE ?? 'cancha',
      ssl: bool(process.env.DB_SSL),
      synchronize: bool(process.env.DB_SYNCHRONIZE),
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
    },
    seedAdmin: {
      username: process.env.SEED_ADMIN_USERNAME ?? 'admin',
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@comfasucre.com',
      password: process.env.SEED_ADMIN_PASSWORD ?? 'Comfasucre2025*',
      name: process.env.SEED_ADMIN_NAME ?? 'Administrador Comfasucre',
    },
    providers: {
      payment: process.env.PAYMENT_PROVIDER ?? 'stub',
      messaging: process.env.MESSAGING_PROVIDER ?? 'stub',
      documentLookup: process.env.DOCUMENT_LOOKUP_PROVIDER ?? 'stub',
    },
  };
}
