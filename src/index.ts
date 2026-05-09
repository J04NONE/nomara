import express from 'express';
import empleadosRouter from './routes/empleados.routes';
import turnosRouter from './routes/turnos.routes';
import vigenciasRouter from './routes/vigencias.routes';
import liquidacionesRouter from './routes/liquidaciones.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', proyecto: 'Nomara API', version: '1.0.0' });
});

app.use('/api/v1/empleados', empleadosRouter);
app.use('/api/v1/turnos', turnosRouter);
app.use('/api/v1/vigencias', vigenciasRouter);
app.use('/api/v1/liquidaciones', liquidacionesRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Nomara API corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
