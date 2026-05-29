import 'dotenv/config';
import pool from '../src/config/database';

async function seed(): Promise<void> {
  try {
    // Vigencias normativas
    const vig1 = await pool.query(
      `INSERT INTO vigencias_normativas (id, fecha_inicio, divisor, pct_nocturno, pct_dominical)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (fecha_inicio) DO NOTHING`,
      ['vig-001', '2026-01-01', 220, 35, 80]
    );

    const vig2 = await pool.query(
      `INSERT INTO vigencias_normativas (id, fecha_inicio, divisor, pct_nocturno, pct_dominical)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (fecha_inicio) DO NOTHING`,
      ['vig-002', '2026-07-15', 210, 35, 90]
    );

    console.log(`vigencias_normativas: ${(vig1.rowCount ?? 0) + (vig2.rowCount ?? 0)} fila(s) insertada(s)`);

    // Empleados
    const emp1 = await pool.query(
      `INSERT INTO empleados (id, tipo_doc, num_doc, nombre, sueldo_base, estado, rol, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (tipo_doc, num_doc) DO NOTHING`,
      ['emp-001', 'CC', '1023456789', 'Ana María Torres', 2000000, 'ACTIVO', 'JEFE_OPERACIONES', '2024-01-15']
    );

    const emp2 = await pool.query(
      `INSERT INTO empleados (id, tipo_doc, num_doc, nombre, sueldo_base, estado, rol, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (tipo_doc, num_doc) DO NOTHING`,
      ['emp-002', 'CC', '98765432', 'Carlos Pérez Gómez', 1423500, 'ACTIVO', 'COLABORADOR', '2025-03-01']
    );

    const emp3 = await pool.query(
      `INSERT INTO empleados (id, tipo_doc, num_doc, nombre, sueldo_base, estado, rol, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (tipo_doc, num_doc) DO NOTHING`,
      ['emp-003', 'CC', '65432109', 'Sofía Ramírez', 3800000, 'ACTIVO', 'ADMIN_NOMINA', '2024-09-05']
    );

    const emp4 = await pool.query(
      `INSERT INTO empleados (id, tipo_doc, num_doc, nombre, sueldo_base, estado, rol, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (tipo_doc, num_doc) DO NOTHING`,
      ['emp-004', 'CC', '87654321', 'Diego Hernández', 1800000, 'ACTIVO', 'COLABORADOR', '2025-04-01']
    );

    const totalEmpleados =
      (emp1.rowCount ?? 0) +
      (emp2.rowCount ?? 0) +
      (emp3.rowCount ?? 0) +
      (emp4.rowCount ?? 0);

    console.log(`empleados: ${totalEmpleados} fila(s) insertada(s)`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  }
}

seed();
