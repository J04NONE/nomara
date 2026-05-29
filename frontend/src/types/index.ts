// === Empleados (backend: POST/GET /api/v1/empleados) ===
export interface Empleado {
  id: string
  tipoDoc: 'CC' | 'NIT' | 'CE' | 'PA'
  numDoc: string
  nombre: string
  sueldoBase: number
  estado: 'ACTIVO' | 'INACTIVO'
  rol: 'ADMIN_NOMINA' | 'JEFE_OPERACIONES' | 'ADMIN_SISTEMA' | 'COLABORADOR'
  fechaIngreso: string  // YYYY-MM-DD
  createdAt: string     // ISO
}

export interface CreateEmpleadoDto {
  tipoDoc: Empleado['tipoDoc']
  numDoc: string
  nombre: string
  sueldoBase: number
  rol?: Empleado['rol']
  fechaIngreso: string
}

// === Turnos (backend: POST/GET /api/v1/turnos) ===
export interface Turno {
  id: string
  empleadoId: string
  horaEntrada: string   // ISO
  horaSalida: string    // ISO
  estado: 'ACTIVO' | 'ANULADO'
  segmentos: Segmento[]
  createdAt: string     // ISO
}

export interface CreateTurnoDto {
  empleadoId: string
  horaEntrada: string
  horaSalida: string
}

// === Segmentos (generados por el motor de compliance) ===
export interface Segmento {
  id: string
  turnoId: string
  fecha: string         // YYYY-MM-DD
  tipoHora: 'ORDINARIO' | 'NOCTURNO' | 'DOMINICAL' | 'NOCTURNO_DOMINICAL'
  horas: number
  valorHora: number
  recargoAplicado: number
  valorTotal: number
}

// === Vigencias Normativas (backend: GET/POST /api/v1/vigencias) ===
export interface VigenciaNormativa {
  id: string
  fechaInicio: string   // YYYY-MM-DD
  divisor: number
  pctNocturno: number
  pctDominical: number
}

export interface CreateVigenciaDto {
  fechaInicio: string
  divisor: number
  pctNocturno: number
  pctDominical: number
}

// === Liquidación (backend: GET /api/v1/liquidaciones/:empleadoId) ===
export interface LiquidacionResumen {
  empleadoId: string
  nombreEmpleado: string
  periodo: string
  totalHoras: number
  totalOrdinario: number
  totalNocturno: number
  totalDominical: number
  totalNocturnoDominical: number
  totalDevengado: number
  detalleSegmentos: number
}

// === Health ===
export interface HealthResponse {
  status: string
  proyecto: string
  version: string
}

// === Layout ===
export interface NavItem {
  label: string
  path: string
  icon: string
  badge?: number
}
