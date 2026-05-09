import { Segmento } from './segmento.model';

export type EstadoTurno = 'ACTIVO' | 'ANULADO';

export interface Turno {
  id: string;
  empleadoId: string;
  horaEntrada: string;
  horaSalida: string;
  estado: EstadoTurno;
  segmentos: Segmento[];
  createdAt: string;
}

export interface CreateTurnoDto {
  empleadoId: string;
  horaEntrada: string;
  horaSalida: string;
}
