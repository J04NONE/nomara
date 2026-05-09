import { Router, Request, Response, NextFunction } from 'express';
import { store } from '../store';
import { CreateVigenciaDto, VigenciaNormativa } from '../models/vigencia.model';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const ordenadas = [...store.vigencias].sort((a, b) =>
    a.fechaInicio.localeCompare(b.fechaInicio)
  );
  res.json(ordenadas);
});

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const dto = req.body as CreateVigenciaDto;

    if (!dto.fechaInicio || !dto.divisor || dto.pctNocturno === undefined || dto.pctDominical === undefined) {
      res.status(400).json({ error: 'Campos requeridos: fechaInicio, divisor, pctNocturno, pctDominical' });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dto.fechaInicio)) {
      res.status(400).json({ error: 'fechaInicio debe tener formato YYYY-MM-DD' });
      return;
    }

    const duplicada = store.vigencias.find((v) => v.fechaInicio === dto.fechaInicio);
    if (duplicada) {
      res.status(409).json({ error: `Ya existe una vigencia con fechaInicio ${dto.fechaInicio}` });
      return;
    }

    const nueva: VigenciaNormativa = {
      id: crypto.randomUUID(),
      fechaInicio: dto.fechaInicio,
      divisor: dto.divisor,
      pctNocturno: dto.pctNocturno,
      pctDominical: dto.pctDominical,
    };

    store.vigencias.push(nueva);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
});

export default router;
