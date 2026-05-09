import { Empleado } from '../models/empleado.model';
import { Turno } from '../models/turno.model';
import { VigenciaNormativa } from '../models/vigencia.model';

const empleados: Empleado[] = [
  {
    id: 'emp-001',
    tipoDoc: 'CC',
    numDoc: '1023456789',
    nombre: 'Ana María Torres',
    sueldoBase: 2000000,
    estado: 'ACTIVO',
    rol: 'JEFE_OPERACIONES',
    fechaIngreso: '2024-01-15',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'emp-002',
    tipoDoc: 'CC',
    numDoc: '98765432',
    nombre: 'Carlos Pérez Gómez',
    sueldoBase: 1423500,
    estado: 'ACTIVO',
    rol: 'COLABORADOR',
    fechaIngreso: '2025-03-01',
    createdAt: '2025-03-01T00:00:00.000Z',
  },
];

const vigencias: VigenciaNormativa[] = [
  {
    id: 'vig-001',
    fechaInicio: '2026-01-01',
    divisor: 220,
    pctNocturno: 35,
    pctDominical: 80,
  },
  {
    id: 'vig-002',
    fechaInicio: '2026-07-15',
    divisor: 210,
    pctNocturno: 35,
    pctDominical: 90,
  },
];

const turnos: Turno[] = [];

export const store = { empleados, turnos, vigencias };
