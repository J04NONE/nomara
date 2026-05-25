import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { CreateTurnoDto, Turno } from '../models/turno.model';
import { VigenciaNormativa } from '../models/vigencia.model';
import { segmentarTurno, parseColombiaDateTime } from '../services/turno.service';
import { Empleado } from '../models/empleado.model';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto = req.body as CreateTurnoDto;

    if (!dto.empleadoId || !dto.horaEntrada || !dto.horaSalida) {
      res.status(400).json({ error: 'Campos requeridos: empleadoId, horaEntrada, horaSalida' });
      return;
    }

    const { rows: empRows } = await pool.query<Empleado>(
      `SELECT id, estado, sueldo_base AS "sueldoBase" FROM empleados WHERE id = $1`,
      [dto.empleadoId]
    );
    if (empRows.length === 0) {
      res.status(404).json({ error: `Empleado ${dto.empleadoId} no encontrado` });
      return;
    }
    const empleado = empRows[0];
    if (empleado.estado === 'INACTIVO') {
      res.status(422).json({ error: 'No se pueden asignar turnos a empleados inactivos' });
      return;
    }

    const entrada = parseColombiaDateTime(dto.horaEntrada);
    const salida = parseColombiaDateTime(dto.horaSalida);

    if (isNaN(entrada.getTime()) || isNaN(salida.getTime())) {
      res.status(400).json({ error: 'Formato de fecha inválido. Use ISO 8601: YYYY-MM-DDTHH:mm:ss' });
      return;
    }
    if (salida <= entrada) {
      res.status(400).json({ error: 'horaSalida debe ser posterior a horaEntrada' });
      return;
    }

    const { rows: vigRows } = await pool.query<VigenciaNormativa>(
      `SELECT id, fecha_inicio::text AS "fechaInicio", divisor,
              pct_nocturno AS "pctNocturno", pct_dominical AS "pctDominical"
       FROM vigencias_normativas ORDER BY fecha_inicio ASC`
    );
    if (vigRows.length === 0) {
      res.status(422).json({ error: 'No hay vigencias normativas configuradas. Crea una en /api/v1/vigencias' });
      return;
    }

    const turnoId = crypto.randomUUID();
    const segmentos = segmentarTurno(turnoId, entrada, salida, empleado.sueldoBase, vigRows);

    const { rows } = await pool.query<Turno>(
      `INSERT INTO turnos (id, empleado_id, hora_entrada, hora_salida, estado, segmentos)
       VALUES ($1, $2, $3, $4, 'ACTIVO', $5)
       RETURNING id, empleado_id AS "empleadoId",
                 hora_entrada AS "horaEntrada", hora_salida AS "horaSalida",
                 estado, segmentos, created_at AS "createdAt"`,
      [turnoId, dto.empleadoId, entrada.toISOString(), salida.toISOString(), JSON.stringify(segmentos)]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { empleadoId } = req.query;
    const { rows } = empleadoId
      ? await pool.query<Turno>(
          `SELECT id, empleado_id AS "empleadoId",
                  hora_entrada AS "horaEntrada", hora_salida AS "horaSalida",
                  estado, segmentos, created_at AS "createdAt"
           FROM turnos WHERE empleado_id = $1 ORDER BY hora_entrada DESC`,
          [empleadoId]
        )
      : await pool.query<Turno>(
          `SELECT id, empleado_id AS "empleadoId",
                  hora_entrada AS "horaEntrada", hora_salida AS "horaSalida",
                  estado, segmentos, created_at AS "createdAt"
           FROM turnos ORDER BY hora_entrada DESC`
        );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
