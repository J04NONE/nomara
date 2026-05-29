import express from 'express';
import cors from 'cors';
import empleadosRouter from './routes/empleados.routes';
import turnosRouter from './routes/turnos.routes';
import vigenciasRouter from './routes/vigencias.routes';
import liquidacionesRouter from './routes/liquidaciones.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { testConnection, initializeTables } from './config/database';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(cors({
  origin: process.env['ALLOWED_ORIGIN'] ?? '*',
}));
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

(async () => {
  await testConnection();
  await initializeTables();
  app.listen(PORT, () => {
    console.log(`Nomara API corriendo en http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
})().catch((err) => {
  console.error('Error crítico al iniciar la base de datos:', err);
  process.exit(1);
});

export default app;
