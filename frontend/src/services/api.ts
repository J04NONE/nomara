import type { Empleado, Turno, VigenciaNormativa, LiquidacionResumen, HealthResponse, CreateEmpleadoDto, CreateTurnoDto, CreateVigenciaDto } from '@/types'

const BASE_URL = '/api/v1'

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

// === Health (endpoint está en /health, no bajo /api/v1/) ===
export const healthAPI = {
  check: async () => {
    const response = await fetch('/health', { headers: { 'Content-Type': 'application/json' } })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    return response.json() as Promise<HealthResponse>
  },
}

// === Empleados ===
export const empleadosAPI = {
  getAll: (estado?: string) => {
    const params = estado ? `?${new URLSearchParams({ estado })}` : ''
    return fetchJSON<Empleado[]>(`/empleados${params}`)
  },
  getById: (id: string) => fetchJSON<Empleado>(`/empleados/${id}`),
  create: (data: CreateEmpleadoDto) =>
    fetchJSON<Empleado>('/empleados', { method: 'POST', body: JSON.stringify(data) }),
  desactivar: (id: string) =>
    fetchJSON<Empleado>(`/empleados/${id}/desactivar`, { method: 'PATCH' }),
}

// === Turnos ===
export const turnosAPI = {
  getAll: (empleadoId?: string) => {
    const params = empleadoId ? `?empleadoId=${empleadoId}` : ''
    return fetchJSON<Turno[]>(`/turnos${params}`)
  },
  create: (data: CreateTurnoDto) =>
    fetchJSON<Turno>('/turnos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// === Vigencias Normativas ===
export const vigenciasAPI = {
  getAll: () => fetchJSON<VigenciaNormativa[]>('/vigencias'),
  create: (data: CreateVigenciaDto) =>
    fetchJSON<VigenciaNormativa>('/vigencias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// === Liquidaciones ===
export const liquidacionesAPI = {
  getByEmpleado: (empleadoId: string, periodo?: string) => {
    const params = periodo ? `?${new URLSearchParams({ periodo })}` : ''
    return fetchJSON<LiquidacionResumen>(`/liquidaciones/${empleadoId}${params}`)
  },
}
