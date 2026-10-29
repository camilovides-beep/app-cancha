import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Esquema inicial del sistema de reservas de canchas.
 * Idempotente (IF NOT EXISTS) para poder ejecutarse tanto sobre una base de
 * datos nueva (docker) como sobre una base de datos remota ya existente.
 */
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    // ===== admins (usuarios del panel) =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id          SERIAL PRIMARY KEY,
        username    VARCHAR(100) NOT NULL UNIQUE,
        email       VARCHAR(150) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        name        VARCHAR(150) NOT NULL,
        role        VARCHAR(50)  DEFAULT 'admin',
        active      BOOLEAN      DEFAULT TRUE,
        last_login  TIMESTAMP,
        created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ===== users (clientes) =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name            VARCHAR(150) NOT NULL,
        email           VARCHAR(150) NOT NULL UNIQUE,
        phone           VARCHAR(50),
        role            VARCHAR(50)  NOT NULL DEFAULT 'customer',
        password_hash   TEXT,
        category        VARCHAR(2)   DEFAULT 'D',
        document_number VARCHAR(50),
        document_type   VARCHAR(10)  DEFAULT 'CC',
        status          VARCHAR(20)  DEFAULT 'active',
        created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
      )
    `);

    // ===== courts (recursos reservables: canchas, auditorios, chivas...) =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name             VARCHAR(150) NOT NULL,
        sport_type       VARCHAR(100) NOT NULL,
        location         VARCHAR(255),
        status           VARCHAR(20)  NOT NULL DEFAULT 'active',
        court_type       VARCHAR(100),
        venue_name       VARCHAR(150),
        description      TEXT,
        address          TEXT,
        additional_info  TEXT,
        images           JSONB DEFAULT '[]'::jsonb,
        attributes       JSONB DEFAULT '[]'::jsonb,
        venue_services   JSONB DEFAULT '[]'::jsonb,
        map_lat          NUMERIC,
        map_lng          NUMERIC,
        map_address      TEXT,
        hourly_rate      NUMERIC NOT NULL DEFAULT 0,
        day_rate         NUMERIC,
        afternoon_rate   NUMERIC,
        night_rate       NUMERIC,
        category_a_day_rate       NUMERIC,
        category_a_afternoon_rate NUMERIC,
        category_a_night_rate     NUMERIC,
        category_b_day_rate       NUMERIC,
        category_b_afternoon_rate NUMERIC,
        category_b_night_rate     NUMERIC,
        category_c_day_rate       NUMERIC,
        category_c_afternoon_rate NUMERIC,
        category_c_night_rate     NUMERIC,
        category_d_day_rate       NUMERIC,
        category_d_afternoon_rate NUMERIC,
        category_d_night_rate     NUMERIC,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // ===== reservations =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        court_id                UUID NOT NULL REFERENCES courts(id),
        user_id                 UUID REFERENCES users(id),
        start_time              TIMESTAMPTZ NOT NULL,
        end_time                TIMESTAMPTZ NOT NULL,
        status                  VARCHAR(20) NOT NULL DEFAULT 'pending',
        payment_status          VARCHAR(20) NOT NULL DEFAULT 'unpaid',
        total_amount            NUMERIC NOT NULL DEFAULT 0,
        notes                   TEXT,
        user_name               VARCHAR(150),
        court_name              VARCHAR(150),
        user_phone              VARCHAR(50),
        user_email              VARCHAR(150),
        user_category           VARCHAR(2)  DEFAULT 'D',
        category_price          NUMERIC     DEFAULT 20000,
        user_document           VARCHAR(50),
        verification_code       VARCHAR(10),
        verification_expires_at TIMESTAMP,
        verified_at             TIMESTAMP,
        payment_method          VARCHAR(50),
        epayco_reference        VARCHAR(100),
        paid_at                 TIMESTAMP,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_court_start ON reservations(court_id, start_time)`,
    );

    // ===== payments =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
        amount          NUMERIC NOT NULL,
        method          VARCHAR(50) NOT NULL,
        status          VARCHAR(20) NOT NULL DEFAULT 'pending',
        reference       VARCHAR(100),
        paid_at         TIMESTAMPTZ,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // ===== settings (clave/valor; incluye configuración de marca) =====
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id            SERIAL PRIMARY KEY,
        setting_key   VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        updated_at    TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
    await queryRunner.query(`DROP TABLE IF EXISTS reservations`);
    await queryRunner.query(`DROP TABLE IF EXISTS settings`);
    await queryRunner.query(`DROP TABLE IF EXISTS courts`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS admins`);
  }
}
