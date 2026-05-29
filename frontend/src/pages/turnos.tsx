import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Plus, Moon, Sun, Calendar, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { turnosAPI, empleadosAPI } from '@/services/api'
import type { Turno, CreateTurnoDto } from '@/types'

type TurnoConNombre = Turno & { empleadoNombre: string }

const hourTypeColors: Record<string, string> = {
  ORDINARIO: 'bg-primary/10 text-primary border-primary/20',
  NOCTURNO: 'bg-secondary/10 text-secondary border-secondary/20',
  DOMINICAL: 'bg-success/10 text-success border-success/20',
  NOCTURNO_DOMINICAL: 'bg-warning/10 text-warning border-warning/20',
}

const hourTypeLabels: Record<string, string> = {
  ORDINARIO: 'Ordinario',
  NOCTURNO: 'Nocturno',
  DOMINICAL: 'Dominical',
  NOCTURNO_DOMINICAL: 'Noct. Dominical',
}

export function TurnosPage() {
  const [open, setOpen] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  const queryClient = useQueryClient()

  const { data: turnos = [], isLoading: isLoadingTurnos } = useQuery({
    queryKey: ['turnos'],
    queryFn: () => turnosAPI.getAll(),
  })

  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados'],
    queryFn: () => empleadosAPI.getAll(),
  })

  const crearTurnoMutation = useMutation({
    mutationFn: (dto: CreateTurnoDto) => turnosAPI.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] })
      setOpen(false)
      setSelectedEmpleado(''); setFechaInicio(''); setFechaFin('')
    },
  })

  const empleadosActivos = empleados.filter((e) => e.estado === 'ACTIVO')

  const turnosConNombre: TurnoConNombre[] = turnos.map((turno) => ({
    ...turno,
    empleadoNombre: empleados.find((e) => e.id === turno.empleadoId)?.nombre ?? turno.empleadoId,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Gestión de Turnos</h1>
          <p className="text-sm text-text-muted mt-1">Asignación y segmentación automática de turnos laborales</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Turno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Empleado</label>
                <Select value={selectedEmpleado} onValueChange={setSelectedEmpleado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleadosActivos.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Inicio</label>
                  <Input type="datetime-local" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Fin</label>
                  <Input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                </div>
              </div>
              {crearTurnoMutation.isError && (
                <p className="text-sm text-danger">{crearTurnoMutation.error?.message}</p>
              )}
              <Button
                className="w-full"
                disabled={crearTurnoMutation.isPending || !selectedEmpleado || !fechaInicio || !fechaFin}
                onClick={() => crearTurnoMutation.mutate({ empleadoId: selectedEmpleado, horaEntrada: fechaInicio, horaSalida: fechaFin })}
              >
                {crearTurnoMutation.isPending
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Procesando...</>
                  : 'Asignar Turno'}
              </Button>
              <p className="text-xs text-text-dim text-center">
                El motor de compliance segmentará automáticamente el turno según la normativa colombiana.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="nocturnos">Nocturnos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {isLoadingTurnos ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-text-muted">Cargando turnos...</p>
            </div>
          ) : turnosConNombre.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 gap-2">
              <Clock className="h-8 w-8 text-text-dim" />
              <p className="text-text-muted">No hay turnos registrados. Crea el primero.</p>
            </div>
          ) : (
            turnosConNombre.map((turno) => {
              const isNocturno = turno.segmentos.some(s => s.tipoHora === 'NOCTURNO' || s.tipoHora === 'NOCTURNO_DOMINICAL')
              return (
                <Card key={turno.id} className="overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isNocturno ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                          {isNocturno ? <Moon className="h-6 w-6 text-secondary" /> : <Sun className="h-6 w-6 text-primary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-text">{turno.empleadoNombre}</h3>
                            <Badge variant={turno.estado === 'ACTIVO' ? 'info' : 'outline'}>
                              {turno.estado === 'ACTIVO' ? 'Activo' : 'Anulado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-muted mt-0.5">
                            {formatDateTime(turno.horaEntrada)} → {formatDateTime(turno.horaSalida)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isNocturno ? 'info' : 'default'}>
                        {isNocturno ? 'Nocturno' : 'Diurno'}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-text">Segmentación automática</span>
                        <Badge variant="info" className="text-[10px]">{turno.segmentos.length} segmentos</Badge>
                      </div>
                      <div className="space-y-2">
                        {turno.segmentos.map((seg) => {
                          const diaSemana = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][new Date(seg.fecha + 'T12:00:00').getDay()]
                          return (
                            <div key={seg.id} className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-4 hover:bg-surface-hover transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-12">
                                  <span className="text-sm font-bold text-text">{seg.fecha.slice(8)}</span>
                                  <span className="text-[10px] text-text-muted">{diaSemana}</span>
                                </div>
                                <Badge className={hourTypeColors[seg.tipoHora]}>
                                  {hourTypeLabels[seg.tipoHora]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-sm text-text-muted">Horas</p>
                                  <p className="text-sm font-bold text-text font-mono">{seg.horas}h</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-text-muted">Recargo</p>
                                  <p className="text-sm font-bold text-success font-mono">+{(seg.recargoAplicado * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-right min-w-[100px]">
                                  <p className="text-sm text-text-muted">Valor</p>
                                  <p className="text-sm font-bold text-text font-mono">{formatCurrency(seg.valorTotal)}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-text">Total del turno</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm text-text-muted">{turno.segmentos.reduce((a, s) => a + s.horas, 0)}h totales</span>
                          <span className="text-lg font-bold text-primary font-mono">
                            {formatCurrency(turno.segmentos.reduce((a, s) => a + s.valorTotal, 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="hoy">
          <div className="flex items-center justify-center p-12">
            <Calendar className="h-8 w-8 text-text-dim mb-2" />
            <p className="text-text-muted">Filtro de turnos del día (próximamente)</p>
          </div>
        </TabsContent>

        <TabsContent value="nocturnos">
          <div className="flex items-center justify-center p-12">
            <Moon className="h-8 w-8 text-text-dim mb-2" />
            <p className="text-text-muted">Filtro de turnos nocturnos (próximamente)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
