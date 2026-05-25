import { describe, it, expect } from 'vitest';
import { segmentarTurno, parseColombiaDateTime, getVigenciaActiva } from '../services/turno.service';
import type { VigenciaNormativa } from '../models/vigencia.model';

const VIGENCIA_BASE: VigenciaNormativa = {
  id: 'vig-001',
  fechaInicio: '2026-01-01',
  divisor: 220,
  pctNocturno: 35,
  pctDominical: 80,
};

const SUELDO = 1_423_500; // Carlos Pérez
const TURNO_ID = 'turno-test-001';

// ── parseColombiaDateTime ─────────────────────────────────────────────────────

describe('parseColombiaDateTime', () => {
  it('trata string sin zona horaria como UTC-5', () => {
    const d = parseColombiaDateTime('2026-05-26T22:00:00');
    // 22:00 COL = 03:00 UTC del día siguiente
    expect(d.toISOString()).toBe('2026-05-27T03:00:00.000Z');
  });

  it('respeta offset explícito Z', () => {
    const d = parseColombiaDateTime('2026-05-26T22:00:00.000Z');
    expect(d.toISOString()).toBe('2026-05-26T22:00:00.000Z');
  });
});

// ── getVigenciaActiva ─────────────────────────────────────────────────────────

describe('getVigenciaActiva', () => {
  const VIGENCIA_JULIO: VigenciaNormativa = {
    id: 'vig-002',
    fechaInicio: '2026-07-15',
    divisor: 210,
    pctNocturno: 35,
    pctDominical: 90,
  };

  it('retorna la vigencia correcta para mayo 2026', () => {
    const fecha = new Date('2026-05-26T22:00:00.000Z');
    const vig = getVigenciaActiva(fecha, [VIGENCIA_BASE, VIGENCIA_JULIO]);
    expect(vig.divisor).toBe(220);
  });

  it('retorna la vigencia julio para fecha posterior al 15 jul 2026', () => {
    const fecha = new Date('2026-07-20T12:00:00.000Z');
    const vig = getVigenciaActiva(fecha, [VIGENCIA_BASE, VIGENCIA_JULIO]);
    expect(vig.divisor).toBe(210);
  });

  it('lanza error si no hay vigencia aplicable', () => {
    const fechaAntes = new Date('2025-12-31T23:59:00.000Z');
    expect(() => getVigenciaActiva(fechaAntes, [VIGENCIA_JULIO])).toThrow('Sin vigencia normativa');
  });
});

// ── segmentarTurno ────────────────────────────────────────────────────────────

describe('segmentarTurno', () => {
  it('turno ordinario de día: un solo segmento ORDINARIO', () => {
    // Lunes 25 May 2026, 08:00–12:00 COL
    const entrada = parseColombiaDateTime('2026-05-25T08:00:00');
    const salida = parseColombiaDateTime('2026-05-25T12:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    expect(segs).toHaveLength(1);
    expect(segs[0].tipoHora).toBe('ORDINARIO');
    expect(segs[0].horas).toBe(4);
    expect(segs[0].recargoAplicado).toBe(0);
  });

  it('turno nocturno puro: segmento NOCTURNO', () => {
    // Lunes 25 May 2026, 20:00–23:00 COL
    const entrada = parseColombiaDateTime('2026-05-25T20:00:00');
    const salida = parseColombiaDateTime('2026-05-25T23:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    expect(segs).toHaveLength(1);
    expect(segs[0].tipoHora).toBe('NOCTURNO');
    expect(segs[0].recargoAplicado).toBe(0.35);
  });

  it('turno sábado–domingo 22:00–06:00: genera 2 segmentos NOCTURNO + NOCTURNO_DOMINICAL', () => {
    // Sáb 30 May → Dom 31 May
    const entrada = parseColombiaDateTime('2026-05-30T22:00:00');
    const salida = parseColombiaDateTime('2026-05-31T06:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    expect(segs).toHaveLength(2);
    expect(segs[0].fecha).toBe('2026-05-30');
    expect(segs[0].tipoHora).toBe('NOCTURNO');
    expect(segs[0].horas).toBe(2);

    expect(segs[1].fecha).toBe('2026-05-31');
    expect(segs[1].tipoHora).toBe('NOCTURNO_DOMINICAL');
    expect(segs[1].horas).toBe(6);
  });

  it('WOW demo: valores monetarios correctos para turno SAB–DOM', () => {
    const entrada = parseColombiaDateTime('2026-05-30T22:00:00');
    const salida = parseColombiaDateTime('2026-05-31T06:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    // valorHoraBase = round(1423500 / 220) = 6470.45
    const valorHoraBase = Math.round((SUELDO / 220) * 100) / 100;

    // Segmento nocturno: valorHoraBase * 1.35 * 2
    const expectedNocturno = Math.round(valorHoraBase * 1.35 * 2 * 100) / 100;
    expect(segs[0].valorTotal).toBe(expectedNocturno);

    // Segmento noc-dominical: valorHoraBase * (1 + 0.35 + 0.80) * 6
    const expectedNocDom = Math.round(valorHoraBase * 2.15 * 6 * 100) / 100;
    expect(segs[1].valorTotal).toBe(expectedNocDom);
  });

  it('turno dominical de día: segmento DOMINICAL', () => {
    // Dom 31 May, 08:00–16:00 COL
    const entrada = parseColombiaDateTime('2026-05-31T08:00:00');
    const salida = parseColombiaDateTime('2026-05-31T16:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    expect(segs).toHaveLength(1);
    expect(segs[0].tipoHora).toBe('DOMINICAL');
    expect(segs[0].recargoAplicado).toBe(0.8);
  });

  it('turno que cruza medianoche colombiana: corta en 00:00 COL', () => {
    // Lun 25 May 23:00 → Mar 26 May 02:00 COL
    const entrada = parseColombiaDateTime('2026-05-25T23:00:00');
    const salida = parseColombiaDateTime('2026-05-26T02:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);

    expect(segs).toHaveLength(2);
    expect(segs[0].fecha).toBe('2026-05-25');
    expect(segs[0].horas).toBe(1); // 23:00–00:00
    expect(segs[1].fecha).toBe('2026-05-26');
    expect(segs[1].horas).toBe(2); // 00:00–02:00
  });

  it('rechaza turno con salida <= entrada', () => {
    const entrada = parseColombiaDateTime('2026-05-25T10:00:00');
    const salida = parseColombiaDateTime('2026-05-25T08:00:00');
    expect(() => segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE])).toThrow();
  });

  it('turno ordinario: suma de horas = duración total', () => {
    const entrada = parseColombiaDateTime('2026-05-25T06:00:00');
    const salida = parseColombiaDateTime('2026-05-25T14:00:00');
    const segs = segmentarTurno(TURNO_ID, entrada, salida, SUELDO, [VIGENCIA_BASE]);
    const totalHoras = segs.reduce((acc, s) => acc + s.horas, 0);
    expect(totalHoras).toBe(8);
  });
});
