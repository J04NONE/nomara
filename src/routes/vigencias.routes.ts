import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { CreateVigenciaDto, VigenciaNormativa } from '../models/vigencia.model';

const router = Router();

const SELECT_VIGENCIA = `
  SELECT id, fecha_inicio::text AS "fechaInicio", divisor,
         pct_nocturno AS "pctNocturno", pct_dominical AS "pctDominical"
  FROM vigencias_normativas
`;

router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query<VigenciaNormativa>(
      `${SELECT_VIGENCIA} ORDER BY fecha_inicio ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const { rowCount } = await pool.query(
      'SELECT 1 FROM vigencias_normativas WHERE fecha_inicio = $1',
      [dto.fechaInicio]
    );
    if (rowCount && rowCount > 0) {
      res.status(409).json({ error: `Ya existe una vigencia con fechaInicio ${dto.fechaInicio}` });
      return;
    }

    const id = crypto.randomUUID();
    const { rows } = await pool.query<VigenciaNormativa>(
      `INSERT INTO vigencias_normativas (id, fecha_inicio, divisor, pct_nocturno, pct_dominical)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, fecha_inicio::text AS "fechaInicio", divisor,
                 pct_nocturno AS "pctNocturno", pct_dominical AS "pctDominical"`,
      [id, dto.fechaInicio, dto.divisor, dto.pctNocturno, dto.pctDominical]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
