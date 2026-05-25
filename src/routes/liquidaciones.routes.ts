import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { Turno } from '../models/turno.model';
import { Empleado } from '../models/empleado.model';

const router = Router();

router.get('/:empleadoId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { empleadoId } = req.params;
    const { periodo } = req.query;

    const { rows: empRows } = await pool.query<Empleado>(
      `SELECT id, nombre FROM empleados WHERE id = $1`,
      [empleadoId]
    );
    if (empRows.length === 0) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }
    const empleado = empRows[0];

    const { rows: turnoRows } = periodo
      ? await pool.query<Turno>(
          `SELECT id, empleado_id AS "empleadoId",
                  hora_entrada AS "horaEntrada", hora_salida AS "horaSalida",
                  estado, segmentos, created_at AS "createdAt"
           FROM turnos
           WHERE empleado_id = $1 AND estado = 'ACTIVO'
             AND to_char(hora_entrada AT TIME ZONE 'America/Bogota', 'YYYY-MM') = $2`,
          [empleadoId, periodo]
        )
      : await pool.query<Turno>(
          `SELECT id, empleado_id AS "empleadoId",
                  hora_entrada AS "horaEntrada", hora_salida AS "horaSalida",
                  estado, segmentos, created_at AS "createdAt"
           FROM turnos WHERE empleado_id = $1 AND estado = 'ACTIVO'`,
          [empleadoId]
        );

    const resumen = {
      empleadoId,
      nombreEmpleado: empleado.nombre,
      periodo: periodo ?? 'todos',
      totalHoras: 0,
      totalOrdinario: 0,
      totalNocturno: 0,
      totalDominical: 0,
      totalNocturnoDominical: 0,
      totalDevengado: 0,
      detalleSegmentos: 0,
    };

    for (const turno of turnoRows) {
      const segmentos = Array.isArray(turno.segmentos) ? turno.segmentos : [];
      for (const seg of segmentos) {
        resumen.totalHoras += seg.horas;
        resumen.totalDevengado += seg.valorTotal;
        resumen.detalleSegmentos++;
        switch (seg.tipoHora) {
          case 'ORDINARIO':          resumen.totalOrdinario += seg.valorTotal; break;
          case 'NOCTURNO':           resumen.totalNocturno += seg.valorTotal; break;
          case 'DOMINICAL':          resumen.totalDominical += seg.valorTotal; break;
          case 'NOCTURNO_DOMINICAL': resumen.totalNocturnoDominical += seg.valorTotal; break;
        }
      }
    }

    resumen.totalHoras             = Math.round(resumen.totalHoras * 100) / 100;
    resumen.totalDevengado         = Math.round(resumen.totalDevengado * 100) / 100;
    resumen.totalOrdinario         = Math.round(resumen.totalOrdinario * 100) / 100;
    resumen.totalNocturno          = Math.round(resumen.totalNocturno * 100) / 100;
    resumen.totalDominical         = Math.round(resumen.totalDominical * 100) / 100;
    resumen.totalNocturnoDominical = Math.round(resumen.totalNocturnoDominical * 100) / 100;

    res.json(resumen);
  } catch (err) {
    next(err);
  }
});

export default router;
