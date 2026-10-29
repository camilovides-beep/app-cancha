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
  epayco: {
    /** URL pública del checkout (integración personalizada p_*). */
    checkoutUrl: string;
    publicKey: string;
    privateKey: string;
    merchantId: string;
    pKey: string;
    accountId: string;
    testMode: boolean;
    /** URL base pública de este backend para los webhooks de confirmación. */
    confirmationUrl: string;
    responseUrl: string;
  };
  meta: {
    /** Base de la Graph API de Meta (incluye versión). */
    graphUrl: string;
    token: string;
    phoneNumberId: string;
    /** Idioma de las plantillas aprobadas en Meta. */
    templateLanguage: string;
    /** Nombres de las plantillas aprobadas en el WhatsApp Business. */
    templates: {
      verificationCode: string;
      reservationConfirmed: string;
      reservationReminder: string;
    };
  };
  whatsapp: {
    /** Webhook de n8n (campaña WiseCX) que entrega el WhatsApp. */
    webhookUrl: string;
    campaignId: string;
    /** Cabecera Authorization completa (p. ej. "Basic xxxx"). */
    authorization: string;
    waitSeconds: number;
    /** Prefijo de país para celulares de 10 dígitos (vacío = enviar tal cual). */
    prefijoPais: string;
    timeoutMs: number;
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
    epayco: {
      // Integración personalizada (p_*). checkout.php responde en secure.payco.co.
      checkoutUrl:
        process.env.EPAYCO_CHECKOUT_URL ??
        'https://secure.payco.co/checkout.php',
      // Cuenta "Recreación y Deporte" de Comfasucre.
      publicKey: process.env.EPAYCO_PUBLIC_KEY ?? '',
      privateKey: process.env.EPAYCO_PRIVATE_KEY ?? '',
      merchantId: process.env.EPAYCO_P_CUST_ID ?? '',
      pKey: process.env.EPAYCO_P_KEY ?? '',
      accountId: process.env.EPAYCO_P_ID_ACCOUNT ?? '',
      testMode: bool(process.env.EPAYCO_TEST, true),
      confirmationUrl: process.env.EPAYCO_CONFIRMATION_URL ?? '',
      responseUrl: process.env.EPAYCO_RESPONSE_URL ?? '',
    },
    meta: {
      graphUrl: process.env.META_GRAPH_URL ?? 'https://graph.facebook.com/v21.0',
      token: process.env.META_TOKEN ?? '',
      phoneNumberId: process.env.META_PHONE_NUMBER_ID ?? '',
      templateLanguage: process.env.META_TEMPLATE_LANGUAGE ?? 'es_MX',
      templates: {
        verificationCode: process.env.META_TEMPLATE_CODIGO ?? 'codigo',
        reservationConfirmed: process.env.META_TEMPLATE_RESERVA ?? 'reserva',
        reservationReminder:
          process.env.META_TEMPLATE_RECORDATORIO ?? 'recordatorio_pago',
      },
    },
    whatsapp: {
      webhookUrl: process.env.WHATSAPP_WEBHOOK_URL ?? '',
      campaignId: process.env.WHATSAPP_CAMPAIGN_ID ?? '',
      authorization: process.env.WHATSAPP_AUTHORIZATION ?? '',
      waitSeconds: parseInt(process.env.WHATSAPP_WAIT_SECONDS ?? '3', 10),
      prefijoPais: process.env.WHATSAPP_PREFIJO_PAIS ?? '',
      timeoutMs: parseInt(process.env.WHATSAPP_TIMEOUT_MS ?? '20000', 10),
    },
  };
}
