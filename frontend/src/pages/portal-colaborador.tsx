import { Clock, DollarSign, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getInitials } from '@/lib/utils'

const empleado = {
  nombre: 'Carlos Méndez',
  cargo: 'Operario de Producción',
  identificacion: 'CC 79.123.456',
  centro: 'Producción',
  salario: 1800000,
  fechaIngreso: '2024-03-15',
}

const turnosProximos = [
  { fecha: '2026-05-28', inicio: '06:00', fin: '14:00', tipo: 'Diurno' },
  { fecha: '2026-05-29', inicio: '06:00', fin: '14:00', tipo: 'Diurno' },
  { fecha: '2026-05-30', inicio: '14:00', fin: '22:00', tipo: 'Mixto' },
]

export function PortalColaboradorPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Portal del Colaborador</h1>
          <p className="text-sm text-text-muted mt-1">Autogestión de información laboral</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(empleado.nombre)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text">{empleado.nombre}</h2>
              <p className="text-sm text-text-muted">{empleado.cargo} · {empleado.centro}</p>
              <p className="text-xs text-text-dim mt-1">{empleado.identificacion}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-success font-mono">{formatCurrency(empleado.salario)}</p>
              <p className="text-xs text-text-muted">Salario Base Mensual</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="turnos">
        <TabsList>
          <TabsTrigger value="turnos" className="gap-2">
            <Clock className="h-4 w-4" /> Mis Turnos
          </TabsTrigger>
          <TabsTrigger value="liquidaciones" className="gap-2">
            <DollarSign className="h-4 w-4" /> Liquidaciones
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-2">
            <FileText className="h-4 w-4" /> Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="turnos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Próximos Turnos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {turnosProximos.map((turno, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-surface-hover transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-text">{turno.fecha.slice(8)}</span>
                        <span className="text-xs text-text-muted">{['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][new Date(turno.fecha).getDay()]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">
                          {turno.inicio} → {turno.fin}
                        </p>
                        <Badge variant="info" className="mt-1">{turno.tipo}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidaciones">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-8 text-text-muted">
                <p>Historial de liquidaciones disponible próximamente.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-8 text-text-muted">
                <p>Certificados laborales y documentos disponibles próximamente.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
