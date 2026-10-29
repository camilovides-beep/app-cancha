import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { loadEnv } from '../../../config/env';

/**
 * Carga de datos iniciales idempotente: administrador del panel, configuración
 * de marca Comfasucre, canchas de ejemplo y usuarios de ejemplo.
 * Puede ejecutarse varias veces sin duplicar registros (ON CONFLICT DO NOTHING).
 */
export async function seed(dataSource: DataSource): Promise<void> {
  const env = loadEnv();

  // ---- Administrador del panel ----
  const passwordHash = await bcrypt.hash(env.seedAdmin.password, 10);
  await dataSource.query(
    `INSERT INTO admins (username, email, password, name, role, active)
     VALUES ($1, $2, $3, $4, 'admin', TRUE)
     ON CONFLICT (username) DO NOTHING`,
    [env.seedAdmin.username, env.seedAdmin.email, passwordHash, env.seedAdmin.name],
  );

  // ---- Configuración de marca Comfasucre (Manual de Marca 2025) ----
  const brand: Record<string, string> = {
    brand_name: 'Comfasucre',
    brand_tagline: 'Tu mejor opción en deportes',
    brand_primary_color: '#19559B',
    brand_primary_color_text: '#FFFFFF',
    brand_secondary_color: '#1FB5E5',
    brand_secondary_color_text: '#0F3461',
    brand_whatsapp: '',
    brand_email: 'servicioalcliente@comfasucre.com',
    brand_address: 'Sincelejo, Sucre',
    brand_logo: '',
    brand_favicon: '',
    brand_facebook: '',
    brand_instagram: '',
    brand_twitter: '',
  };
  for (const [key, value] of Object.entries(brand)) {
    await dataSource.query(
      `INSERT INTO settings (setting_key, setting_value)
       VALUES ($1, $2) ON CONFLICT (setting_key) DO NOTHING`,
      [key, value],
    );
  }

  // ---- Canchas / recursos de ejemplo ----
  const courts = [
    {
      name: 'Cancha Sintética Principal',
      sport: 'Fútbol',
      type: 'Cancha',
      venue: 'Complejo Deportivo Comfasucre',
      desc: 'Cancha de fútbol 8 con grama sintética e iluminación LED.',
      rates: { a: [50000, 55000, 65000], b: [55000, 60000, 70000], c: [58000, 63000, 73000], d: [60000, 65000, 75000] },
    },
    {
      name: 'Cancha Múltiple Cubierta',
      sport: 'Baloncesto',
      type: 'Cancha',
      venue: 'Complejo Deportivo Comfasucre',
      desc: 'Cancha techada para baloncesto, voleibol y microfútbol.',
      rates: { a: [40000, 45000, 55000], b: [45000, 50000, 60000], c: [48000, 53000, 63000], d: [50000, 55000, 65000] },
    },
    {
      name: 'Auditorio Principal',
      sport: 'Eventos',
      type: 'Auditorio',
      venue: 'Sede Administrativa',
      desc: 'Auditorio para 200 personas con sonido y proyección.',
      rates: { a: [80000, 90000, 110000], b: [90000, 100000, 120000], c: [95000, 105000, 125000], d: [100000, 110000, 130000] },
    },
  ];
  for (const c of courts) {
    await dataSource.query(
      `INSERT INTO courts (
         name, sport_type, court_type, venue_name, description, status, hourly_rate,
         category_a_day_rate, category_a_afternoon_rate, category_a_night_rate,
         category_b_day_rate, category_b_afternoon_rate, category_b_night_rate,
         category_c_day_rate, category_c_afternoon_rate, category_c_night_rate,
         category_d_day_rate, category_d_afternoon_rate, category_d_night_rate
       )
       SELECT $1::varchar,$2,$3,$4,$5,'active',$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
       WHERE NOT EXISTS (SELECT 1 FROM courts WHERE name = $1::varchar)`,
      [
        c.name, c.sport, c.type, c.venue, c.desc, c.rates.d[0],
        c.rates.a[0], c.rates.a[1], c.rates.a[2],
        c.rates.b[0], c.rates.b[1], c.rates.b[2],
        c.rates.c[0], c.rates.c[1], c.rates.c[2],
        c.rates.d[0], c.rates.d[1], c.rates.d[2],
      ],
    );
  }

  // ---- Usuarios / clientes de ejemplo ----
  const users = [
    { name: 'Juan Afiliado', email: 'juan@example.com', phone: '3001112233', category: 'A', doc: '1102233445' },
    { name: 'María Beneficiaria', email: 'maria@example.com', phone: '3004445566', category: 'B', doc: '1102233446' },
    { name: 'Carlos Particular', email: 'carlos@example.com', phone: '3007778899', category: 'D', doc: '1102233447' },
  ];
  for (const u of users) {
    await dataSource.query(
      `INSERT INTO users (name, email, phone, category, document_number, role, status)
       VALUES ($1,$2,$3,$4,$5,'customer','active')
       ON CONFLICT (email) DO NOTHING`,
      [u.name, u.email, u.phone, u.category, u.doc],
    );
  }

  console.log('🌱 Seed completado.');
}
