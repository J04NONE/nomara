import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router();

router.get('/:empleadoId', (req: Request, res: Response): void => {
  const { empleadoId } = req.params;
  const { periodo } = req.query;

  const empleado = store.empleados.find((e) => e.id === empleadoId);
  if (!empleado) {
    res.status(404).json({ error: 'Empleado no encontrado' });
    return;
  }

  let turnos = store.turnos.filter(
    (t) => t.empleadoId === empleadoId && t.estado === 'ACTIVO'
  );

  if (periodo && typeof periodo === 'string') {
    turnos = turnos.filter((t) => t.horaEntrada.startsWith(periodo));
  }

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

  for (const turno of turnos) {
    for (const seg of turno.segmentos) {
      resumen.totalHoras += seg.horas;
      resumen.totalDevengado += seg.valorTotal;
      resumen.detalleSegmentos++;
      switch (seg.tipoHora) {
        case 'ORDINARIO':           resumen.totalOrdinario += seg.valorTotal; break;
        case 'NOCTURNO':            resumen.totalNocturno += seg.valorTotal; break;
        case 'DOMINICAL':           resumen.totalDominical += seg.valorTotal; break;
        case 'NOCTURNO_DOMINICAL':  resumen.totalNocturnoDominical += seg.valorTotal; break;
      }
    }
  }

  resumen.totalHoras      = Math.round(resumen.totalHoras * 100) / 100;
  resumen.totalDevengado  = Math.round(resumen.totalDevengado * 100) / 100;
  resumen.totalOrdinario  = Math.round(resumen.totalOrdinario * 100) / 100;
  resumen.totalNocturno   = Math.round(resumen.totalNocturno * 100) / 100;
  resumen.totalDominical  = Math.round(resumen.totalDominical * 100) / 100;
  resumen.totalNocturnoDominical = Math.round(resumen.totalNocturnoDominical * 100) / 100;

  res.json(resumen);
});

export default router;
