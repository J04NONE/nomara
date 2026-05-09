import { Router, Request, Response, NextFunction } from 'express';
import { store } from '../store';
import { CreateEmpleadoDto, Empleado } from '../models/empleado.model';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const dto = req.body as CreateEmpleadoDto;

    if (!dto.tipoDoc || !dto.numDoc || !dto.nombre || !dto.sueldoBase || !dto.fechaIngreso) {
      res.status(400).json({ error: 'Campos requeridos: tipoDoc, numDoc, nombre, sueldoBase, fechaIngreso' });
      return;
    }

    const numDocNorm = dto.numDoc.replace(/[^a-zA-Z0-9]/g, '');
    const duplicado = store.empleados.find(
      (e) => e.tipoDoc === dto.tipoDoc && e.numDoc === numDocNorm
    );
    if (duplicado) {
      res.status(409).json({ error: `Ya existe un empleado con ${dto.tipoDoc} ${numDocNorm}` });
      return;
    }

    if (dto.sueldoBase <= 0) {
      res.status(400).json({ error: 'sueldoBase debe ser mayor a 0' });
      return;
    }

    const nuevo: Empleado = {
      id: crypto.randomUUID(),
      tipoDoc: dto.tipoDoc,
      numDoc: numDocNorm,
      nombre: dto.nombre.trim(),
      sueldoBase: dto.sueldoBase,
      estado: 'ACTIVO',
      rol: dto.rol ?? 'COLABORADOR',
      fechaIngreso: dto.fechaIngreso,
      createdAt: new Date().toISOString(),
    };

    store.empleados.push(nuevo);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
});

router.get('/', (req: Request, res: Response): void => {
  const { estado } = req.query;
  const resultado = estado
    ? store.empleados.filter((e) => e.estado === estado)
    : store.empleados;
  res.json(resultado);
});

router.get('/:id', (req: Request, res: Response): void => {
  const empleado = store.empleados.find((e) => e.id === req.params['id']);
  if (!empleado) {
    res.status(404).json({ error: 'Empleado no encontrado' });
    return;
  }
  res.json(empleado);
});

export default router;
