import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Users, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency, getInitials } from '@/lib/utils'
import type { Empleado } from '@/types'

const mockEmpleados: Empleado[] = [
  { id: '1', tipoDoc: 'CC', numDoc: '79.123.456', nombre: 'Carlos Méndez', sueldoBase: 1800000, estado: 'ACTIVO', rol: 'COLABORADOR', fechaIngreso: '2024-03-15', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '2', tipoDoc: 'CC', numDoc: '52.987.654', nombre: 'Ana Romero', sueldoBase: 2800000, estado: 'ACTIVO', rol: 'JEFE_OPERACIONES', fechaIngreso: '2023-11-01', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '3', tipoDoc: 'CE', numDoc: '101.234.567', nombre: 'Pedro Castillo', sueldoBase: 4500000, estado: 'ACTIVO', rol: 'ADMIN_SISTEMA', fechaIngreso: '2025-01-10', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '4', tipoDoc: 'CC', numDoc: '34.567.890', nombre: 'Laura Gómez', sueldoBase: 1600000, estado: 'ACTIVO', rol: 'COLABORADOR', fechaIngreso: '2024-07-22', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '5', tipoDoc: 'CC', numDoc: '1.234.567', nombre: 'Diego Ramírez', sueldoBase: 1500000, estado: 'INACTIVO', rol: 'COLABORADOR', fechaIngreso: '2025-02-01', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '6', tipoDoc: 'CC', numDoc: '65.432.109', nombre: 'Sofía Torres', sueldoBase: 3800000, estado: 'ACTIVO', rol: 'ADMIN_NOMINA', fechaIngreso: '2024-09-05', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '7', tipoDoc: 'CC', numDoc: '87.654.321', nombre: 'Jorge Hernández', sueldoBase: 1800000, estado: 'ACTIVO', rol: 'COLABORADOR', fechaIngreso: '2025-04-01', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '8', tipoDoc: 'CC', numDoc: '43.210.987', nombre: 'María López', sueldoBase: 3200000, estado: 'ACTIVO', rol: 'ADMIN_NOMINA', fechaIngreso: '2024-05-18', createdAt: '2026-01-01T00:00:00.000Z' },
]

const rolLabels: Record<string, string> = {
  COLABORADOR: 'Colaborador',
  JEFE_OPERACIONES: 'Jefe Operaciones',
  ADMIN_NOMINA: 'Admin Nómina',
  ADMIN_SISTEMA: 'Admin Sistema',
}

export function EmpleadosPage() {
  const [search, setSearch] = useState('')

  const filtered = mockEmpleados.filter((emp) => {
    const docStr = `${emp.tipoDoc} ${emp.numDoc}`
    const matchesSearch = emp.nombre.toLowerCase().includes(search.toLowerCase()) ||
      docStr.includes(search) ||
      rolLabels[emp.rol]?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Empleados</h1>
          <p className="text-sm text-text-muted mt-1">{mockEmpleados.length} empleados registrados</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Empleado</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-muted">Formulario de registro de empleado (próximamente conectado al backend).</p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <Input
                placeholder="Buscar por nombre, documento o rol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Empleado</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Documento</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Rol</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Salario Base</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Ingreso</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {getInitials(emp.nombre)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{emp.nombre}</p>
                          <p className="text-xs text-text-muted">{rolLabels[emp.rol] || emp.rol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-muted font-mono">{emp.tipoDoc} {emp.numDoc}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text">{rolLabels[emp.rol] || emp.rol}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text font-medium font-mono">{formatCurrency(emp.sueldoBase)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-muted">{emp.fechaIngreso}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={emp.estado === 'ACTIVO' ? 'success' : 'outline'}>
                        {emp.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors" title="Editar">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Desactivar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors" title="Más">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-text-dim mx-auto mb-3" />
              <p className="text-text-muted">No se encontraron empleados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
