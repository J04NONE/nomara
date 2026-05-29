import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { CreateEmpleadoDto, Empleado } from '../models/empleado.model';

const router = Router();

const SELECT_EMPLEADO = `
  SELECT id, tipo_doc AS "tipoDoc", num_doc AS "numDoc", nombre,
         sueldo_base AS "sueldoBase", estado, rol,
         fecha_ingreso::text AS "fechaIngreso", created_at AS "createdAt"
  FROM empleados
`;

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto = req.body as CreateEmpleadoDto;

    if (!dto.tipoDoc || !dto.numDoc || !dto.nombre || dto.sueldoBase === undefined || !dto.fechaIngreso) {
      res.status(400).json({ error: 'Campos requeridos: tipoDoc, numDoc, nombre, sueldoBase, fechaIngreso' });
      return;
    }

    if (dto.sueldoBase <= 0) {
      res.status(400).json({ error: 'sueldoBase debe ser mayor a 0' });
      return;
    }

    const numDocNorm = dto.numDoc.replace(/[^a-zA-Z0-9]/g, '');

    const { rowCount } = await pool.query(
      'SELECT 1 FROM empleados WHERE tipo_doc = $1 AND num_doc = $2',
      [dto.tipoDoc, numDocNorm]
    );
    if (rowCount && rowCount > 0) {
      res.status(409).json({ error: `Ya existe un empleado con ${dto.tipoDoc} ${numDocNorm}` });
      return;
    }

    const id = crypto.randomUUID();
    const { rows } = await pool.query<Empleado>(
      `INSERT INTO empleados (id, tipo_doc, num_doc, nombre, sueldo_base, estado, rol, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVO', $6, $7)
       RETURNING id, tipo_doc AS "tipoDoc", num_doc AS "numDoc", nombre,
                 sueldo_base AS "sueldoBase", estado, rol,
                 fecha_ingreso::text AS "fechaIngreso", created_at AS "createdAt"`,
      [id, dto.tipoDoc, numDocNorm, dto.nombre.trim(), dto.sueldoBase, dto.rol ?? 'COLABORADOR', dto.fechaIngreso]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { estado } = req.query;
    const { rows } = estado
      ? await pool.query<Empleado>(`${SELECT_EMPLEADO} WHERE estado = $1 ORDER BY nombre`, [estado])
      : await pool.query<Empleado>(`${SELECT_EMPLEADO} ORDER BY nombre`);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query<Empleado>(
      `${SELECT_EMPLEADO} WHERE id = $1`,
      [req.params['id']]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/desactivar', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query<Empleado>(
      `UPDATE empleados SET estado = 'INACTIVO'
       WHERE id = $1
       RETURNING id, tipo_doc AS "tipoDoc", num_doc AS "numDoc", nombre,
                 sueldo_base AS "sueldoBase", estado, rol,
                 fecha_ingreso::text AS "fechaIngreso", created_at AS "createdAt"`,
      [req.params['id']]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
