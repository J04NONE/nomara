import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, MoreHorizontal, Users, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, getInitials } from '@/lib/utils'
import { empleadosAPI } from '@/services/api'
import type { CreateEmpleadoDto } from '@/types'

const rolLabels: Record<string, string> = {
  COLABORADOR: 'Colaborador',
  JEFE_OPERACIONES: 'Jefe Operaciones',
  ADMIN_NOMINA: 'Admin Nómina',
  ADMIN_SISTEMA: 'Admin Sistema',
}

export function EmpleadosPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [tipoDoc, setTipoDoc] = useState('CC')
  const [numDoc, setNumDoc] = useState('')
  const [nombre, setNombre] = useState('')
  const [sueldoBase, setSueldoBase] = useState('')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [rol, setRol] = useState('COLABORADOR')

  const queryClient = useQueryClient()

  const { data: empleados = [], isLoading, isError, error } = useQuery({
    queryKey: ['empleados'],
    queryFn: () => empleadosAPI.getAll(),
  })

  const crearMutation = useMutation({
    mutationFn: (dto: CreateEmpleadoDto) => empleadosAPI.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] })
      setOpen(false)
      setNumDoc(''); setNombre(''); setSueldoBase(''); setFechaIngreso('')
      setTipoDoc('CC'); setRol('COLABORADOR')
    },
  })

  const desactivarMutation = useMutation({
    mutationFn: (id: string) => empleadosAPI.desactivar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empleados'] }),
  })

  const filtered = empleados.filter((emp) => {
    const docStr = `${emp.tipoDoc} ${emp.numDoc}`
    return (
      emp.nombre.toLowerCase().includes(search.toLowerCase()) ||
      docStr.includes(search) ||
      rolLabels[emp.rol]?.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Empleados</h1>
          <p className="text-sm text-text-muted mt-1">{empleados.length} empleados registrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">Tipo Doc.</label>
                  <Select value={tipoDoc} onValueChange={setTipoDoc}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">CC</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">Nro. Documento</label>
                  <Input value={numDoc} onChange={(e) => setNumDoc(e.target.value)} placeholder="1023456789" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text">Nombre completo</label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ana María Torres" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">Sueldo Base</label>
                  <Input type="number" value={sueldoBase} onChange={(e) => setSueldoBase(e.target.value)} placeholder="1423500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">Fecha Ingreso</label>
                  <Input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text">Rol</label>
                <Select value={rol} onValueChange={setRol}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COLABORADOR">Colaborador</SelectItem>
                    <SelectItem value="JEFE_OPERACIONES">Jefe Operaciones</SelectItem>
                    <SelectItem value="ADMIN_NOMINA">Admin Nómina</SelectItem>
                    <SelectItem value="ADMIN_SISTEMA">Admin Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {crearMutation.isError && (
                <p className="text-sm text-danger">{crearMutation.error?.message}</p>
              )}
              <Button
                className="w-full"
                disabled={crearMutation.isPending || !numDoc || !nombre || !sueldoBase || !fechaIngreso}
                onClick={() => crearMutation.mutate({ tipoDoc: tipoDoc as CreateEmpleadoDto['tipoDoc'], numDoc, nombre, sueldoBase: Number(sueldoBase), fechaIngreso, rol: rol as CreateEmpleadoDto['rol'] })}
              >
                {crearMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : 'Registrar Empleado'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <Input
              placeholder="Buscar por nombre, documento o rol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Cargando empleados...</span>
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-danger">{(error as Error)?.message}</p>
            </div>
          ) : (
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
                          <button
                            className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-40"
                            title="Desactivar"
                            disabled={emp.estado === 'INACTIVO' || desactivarMutation.isPending}
                            onClick={() => desactivarMutation.mutate(emp.id)}
                          >
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
              {filtered.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-text-dim mx-auto mb-3" />
                  <p className="text-text-muted">No se encontraron empleados</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
