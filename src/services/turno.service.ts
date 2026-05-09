import { Segmento, TipoHora } from '../models/segmento.model';
import { VigenciaNormativa } from '../models/vigencia.model';
import { store } from '../store';

const COL_OFFSET_MS = -5 * 3_600_000; // UTC-5

/** Convierte una fecha UTC a su equivalente en Colombia (UTC-5) como objeto Date */
function toColombiaDate(utcDate: Date): Date {
  return new Date(utcDate.getTime() + COL_OFFSET_MS);
}

/** Retorna el string de fecha en hora colombiana: YYYY-MM-DD */
function colombiaDateStr(utcDate: Date): string {
  return toColombiaDate(utcDate).toISOString().split('T')[0] as string;
}

/** Retorna la hora en Colombia (0–23) */
function colombiaHour(utcDate: Date): number {
  return toColombiaDate(utcDate).getUTCHours();
}

/** Retorna el día de la semana en Colombia (0=domingo) */
function colombiaDay(utcDate: Date): number {
  return toColombiaDate(utcDate).getUTCDay();
}

/** Próxima medianoche colombiana (00:00:00 UTC-5 = 05:00:00 UTC del siguiente día Colombia) */
function siguienteMedianocheCol(utcDate: Date): Date {
  const col = toColombiaDate(utcDate);
  // Avanzar al día siguiente en Colombia y poner las 00:00:00
  const colMidnight = new Date(col);
  colMidnight.setUTCHours(24, 0, 0, 0);
  // Convertir de vuelta a UTC
  return new Date(colMidnight.getTime() - COL_OFFSET_MS);
}

export function getVigenciaActiva(utcDate: Date): VigenciaNormativa {
  const fechaCol = colombiaDateStr(utcDate);
  const vigencias = [...store.vigencias].sort((a, b) =>
    b.fechaInicio.localeCompare(a.fechaInicio)
  );
  const vigencia = vigencias.find((v) => v.fechaInicio <= fechaCol);
  if (!vigencia) throw new Error(`Sin vigencia normativa activa para la fecha ${fechaCol}`);
  return vigencia;
}

function esNocturno(utcDate: Date): boolean {
  const h = colombiaHour(utcDate);
  return h >= 19 || h < 6;
}

function esDominical(utcDate: Date): boolean {
  return colombiaDay(utcDate) === 0;
}

function getTipoHora(utcDate: Date): TipoHora {
  const nocturno = esNocturno(utcDate);
  const dominical = esDominical(utcDate);
  if (nocturno && dominical) return 'NOCTURNO_DOMINICAL';
  if (nocturno) return 'NOCTURNO';
  if (dominical) return 'DOMINICAL';
  return 'ORDINARIO';
}

function calcularRecargo(tipoHora: TipoHora, vigencia: VigenciaNormativa): number {
  switch (tipoHora) {
    case 'NOCTURNO':           return vigencia.pctNocturno / 100;
    case 'DOMINICAL':          return vigencia.pctDominical / 100;
    case 'NOCTURNO_DOMINICAL': return (vigencia.pctNocturno + vigencia.pctDominical) / 100;
    default:                   return 0;
  }
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Parsea un datetime string como hora colombiana (UTC-5).
 * Si viene sin zona horaria, lo trata como UTC-5.
 */
export function parseColombiaDateTime(str: string): Date {
  if (str.includes('Z') || str.includes('+') || /\d{2}:\d{2}$/.test(str.slice(-5)) && str.includes('-', 14)) {
    return new Date(str);
  }
  return new Date(str + '-05:00');
}

/**
 * HU-01: Segmenta un turno en fracciones por día calendario colombiano.
 * Corte exacto a las 00:00:00 UTC-5.
 */
export function segmentarTurno(
  turnoId: string,
  entrada: Date,
  salida: Date,
  sueldoBase: number
): Segmento[] {
  if (salida <= entrada) {
    throw new Error('La hora de salida debe ser posterior a la hora de entrada');
  }

  const segmentos: Segmento[] = [];
  let cursor = new Date(entrada);

  while (cursor < salida) {
    const corte = siguienteMedianocheCol(cursor);
    const finSegmento = corte < salida ? corte : salida;

    const horas = redondear((finSegmento.getTime() - cursor.getTime()) / 3_600_000);
    const vigencia = getVigenciaActiva(cursor);
    const valorHoraBase = redondear(sueldoBase / vigencia.divisor);
    const tipoHora = getTipoHora(cursor);
    const recargoAplicado = calcularRecargo(tipoHora, vigencia);
    const valorTotal = redondear(valorHoraBase * (1 + recargoAplicado) * horas);

    segmentos.push({
      id: crypto.randomUUID(),
      turnoId,
      fecha: colombiaDateStr(cursor),
      tipoHora,
      horas,
      valorHora: valorHoraBase,
      recargoAplicado,
      valorTotal,
    });

    cursor = new Date(finSegmento);
  }

  return segmentos;
}
