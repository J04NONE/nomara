import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Conexión a Neon exitosa');
    client.release();
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
};

export const initializeTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS empleados (
        id          TEXT PRIMARY KEY,
        tipo_doc    VARCHAR(10)    NOT NULL,
        num_doc     VARCHAR(20)    NOT NULL,
        nombre      VARCHAR(200)   NOT NULL,
        sueldo_base NUMERIC(15,2)  NOT NULL,
        estado      VARCHAR(10)    NOT NULL DEFAULT 'ACTIVO',
        rol         VARCHAR(30)    NOT NULL DEFAULT 'COLABORADOR',
        fecha_ingreso DATE         NOT NULL,
        created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
        UNIQUE (tipo_doc, num_doc)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS vigencias_normativas (
        id            TEXT PRIMARY KEY,
        fecha_inicio  DATE          NOT NULL UNIQUE,
        divisor       INTEGER       NOT NULL,
        pct_nocturno  NUMERIC(5,2)  NOT NULL,
        pct_dominical NUMERIC(5,2)  NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS turnos (
        id           TEXT PRIMARY KEY,
        empleado_id  TEXT         NOT NULL REFERENCES empleados(id),
        hora_entrada TIMESTAMPTZ  NOT NULL,
        hora_salida  TIMESTAMPTZ  NOT NULL,
        estado       VARCHAR(10)  NOT NULL DEFAULT 'ACTIVO',
        segmentos    JSONB        NOT NULL DEFAULT '[]',
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    console.log('Tablas inicializadas correctamente');
  } catch (error) {
    console.error('Error al inicializar tablas:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
