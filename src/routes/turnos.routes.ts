import { Router, Request, Response, NextFunction } from 'express';
import { store } from '../store';
import { CreateTurnoDto, Turno } from '../models/turno.model';
import { segmentarTurno, parseColombiaDateTime } from '../services/turno.service';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const dto = req.body as CreateTurnoDto;

    if (!dto.empleadoId || !dto.horaEntrada || !dto.horaSalida) {
      res.status(400).json({ error: 'Campos requeridos: empleadoId, horaEntrada, horaSalida' });
      return;
    }

    const empleado = store.empleados.find((e) => e.id === dto.empleadoId);
    if (!empleado) {
      res.status(404).json({ error: `Empleado ${dto.empleadoId} no encontrado` });
      return;
    }
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

    const turnoId = crypto.randomUUID();
    const segmentos = segmentarTurno(turnoId, entrada, salida, empleado.sueldoBase);

    const nuevo: Turno = {
      id: turnoId,
      empleadoId: dto.empleadoId,
      horaEntrada: entrada.toISOString(),
      horaSalida: salida.toISOString(),
      estado: 'ACTIVO',
      segmentos,
      createdAt: new Date().toISOString(),
    };

    store.turnos.push(nuevo);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
});

router.get('/', (req: Request, res: Response): void => {
  const { empleadoId } = req.query;
  const resultado = empleadoId
    ? store.turnos.filter((t) => t.empleadoId === empleadoId)
    : store.turnos;
  res.json(resultado);
});

export default router;
