export type TipoDocumento = 'CC' | 'NIT' | 'CE' | 'PA';
export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO';
export type RolEmpleado = 'ADMIN_NOMINA' | 'JEFE_OPERACIONES' | 'ADMIN_SISTEMA' | 'COLABORADOR';

export interface Empleado {
  id: string;
  tipoDoc: TipoDocumento;
  numDoc: string;
  nombre: string;
  sueldoBase: number;
  estado: EstadoEmpleado;
  rol: RolEmpleado;
  fechaIngreso: string;
  createdAt: string;
}

export interface CreateEmpleadoDto {
  tipoDoc: TipoDocumento;
  numDoc: string;
  nombre: string;
  sueldoBase: number;
  rol?: RolEmpleado;
  fechaIngreso: string;
}
