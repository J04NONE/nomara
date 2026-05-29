import { useState } from 'react'
import { Clock, Plus, Moon, Sun, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Turno, Empleado } from '@/types'

const mockEmpleados: Empleado[] = [
  { id: '1', tipoDoc: 'CC', numDoc: '79.123.456', nombre: 'Carlos Méndez', sueldoBase: 1800000, estado: 'ACTIVO', rol: 'COLABORADOR', fechaIngreso: '2024-03-15', createdAt: '' },
  { id: '2', tipoDoc: 'CC', numDoc: '52.987.654', nombre: 'Ana Romero', sueldoBase: 2800000, estado: 'ACTIVO', rol: 'JEFE_OPERACIONES', fechaIngreso: '2023-11-01', createdAt: '' },
  { id: '4', tipoDoc: 'CC', numDoc: '34.567.890', nombre: 'Laura Gómez', sueldoBase: 1600000, estado: 'ACTIVO', rol: 'COLABORADOR', fechaIngreso: '2024-07-22', createdAt: '' },
]

const mockTurnos: (Turno & { empleadoNombre: string })[] = [
  {
    id: '1', empleadoId: '1', empleadoNombre: 'Carlos Méndez',
    horaEntrada: '2026-05-26T06:00:00-05:00', horaSalida: '2026-05-26T14:00:00-05:00',
    estado: 'ACTIVO', createdAt: '',
    segmentos: [
      { id: 's1', turnoId: '1', fecha: '2026-05-26', tipoHora: 'ORDINARIO', horas: 8, valorHora: 8181.82, recargoAplicado: 0, valorTotal: 65454.55 },
    ],
  },
  {
    id: '2', empleadoId: '2', empleadoNombre: 'Ana Romero',
    horaEntrada: '2026-05-26T22:00:00-05:00', horaSalida: '2026-05-27T06:00:00-05:00',
    estado: 'ACTIVO', createdAt: '',
    segmentos: [
      { id: 's2a', turnoId: '2', fecha: '2026-05-26', tipoHora: 'NOCTURNO', horas: 2, valorHora: 12727.27, recargoAplicado: 0.35, valorTotal: 25454.55 },
      { id: 's2b', turnoId: '2', fecha: '2026-05-27', tipoHora: 'NOCTURNO', horas: 6, valorHora: 12727.27, recargoAplicado: 0.35, valorTotal: 76363.64 },
    ],
  },
  {
    id: '3', empleadoId: '4', empleadoNombre: 'Laura Gómez',
    horaEntrada: '2026-05-27T06:00:00-05:00', horaSalida: '2026-05-27T18:00:00-05:00',
    estado: 'ACTIVO', createdAt: '',
    segmentos: [
      { id: 's3', turnoId: '3', fecha: '2026-05-27', tipoHora: 'ORDINARIO', horas: 12, valorHora: 7272.73, recargoAplicado: 0, valorTotal: 87272.73 },
    ],
  },
]

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
  const [selectedEmpleado, setSelectedEmpleado] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Gestión de Turnos</h1>
          <p className="text-sm text-text-muted mt-1">Asignación y segmentación automática de turnos laborales</p>
        </div>
        <Dialog>
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
                    {mockEmpleados.map((emp) => (
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
              <Button className="w-full">Asignar Turno</Button>
              <p className="text-xs text-text-dim text-center">
                El motor de compliance segmentará automáticamente el turno según la normativa colombiana.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Turnos List */}
      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="nocturnos">Nocturnos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {mockTurnos.map((turno) => {
            const isNocturno = turno.segmentos.some(s => s.tipoHora === 'NOCTURNO' || s.tipoHora === 'NOCTURNO_DOMINICAL')
            return (
              <Card key={turno.id} className="overflow-hidden hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-0">
                  {/* Turno Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isNocturno ? 'bg-secondary/10' : 'bg-primary/10'
                      }`}>
                        {isNocturno ? (
                          <Moon className="h-6 w-6 text-secondary" />
                        ) : (
                          <Sun className="h-6 w-6 text-primary" />
                        )}
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

                  {/* Segmentos */}
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
                          <div
                            key={seg.id}
                            className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-4 hover:bg-surface-hover transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-12">
                                <span className="text-sm font-bold text-text">{seg.fecha.slice(8)}</span>
                                <span className="text-[10px] text-text-muted">{diaSemana}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-text">{seg.tipoHora === 'NOCTURNO' || seg.tipoHora === 'NOCTURNO_DOMINICAL' ? '19:00' : '06:00'}</span>
                                <span className="text-text-dim">→</span>
                                <span className="text-sm font-mono text-text">{seg.tipoHora === 'NOCTURNO' || seg.tipoHora === 'NOCTURNO_DOMINICAL' ? '00:00' : '19:00'}</span>
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

                    {/* Total */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-text">Total del turno</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-text-muted">
                          {turno.segmentos.reduce((a, s) => a + s.horas, 0)}h totales
                        </span>
                        <span className="text-lg font-bold text-primary font-mono">
                          {formatCurrency(turno.segmentos.reduce((a, s) => a + s.valorTotal, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
