export type TipoHora = 'ORDINARIO' | 'NOCTURNO' | 'DOMINICAL' | 'NOCTURNO_DOMINICAL';

export interface Segmento {
  id: string;
  turnoId: string;
  fecha: string;
  tipoHora: TipoHora;
  horas: number;
  valorHora: number;
  recargoAplicado: number;
  valorTotal: number;
}
