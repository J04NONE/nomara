import { Shield, Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const auditLogs = [
  { id: '1', usuario: 'Admin', accion: 'Creación de turno', detalle: 'Turno nocturno asignado a Ana Romero (22:00-06:00)', fecha: '2026-05-27 08:15:00', tipo: 'creacion' },
  { id: '2', usuario: 'Admin', accion: 'Actualización de vigencia', detalle: 'Divisor actualizado de 220 a 210 días', fecha: '2026-05-27 07:30:00', tipo: 'actualizacion' },
  { id: '3', usuario: 'Sistema', accion: 'Liquidación generada', detalle: 'Liquidación de nómina para Carlos Méndez - Periodo Mayo 2026', fecha: '2026-05-27 00:05:00', tipo: 'sistema' },
  { id: '4', usuario: 'Admin', accion: 'Edición de empleado', detalle: 'Actualización de salario base: $1.600.000 → $1.800.000', fecha: '2026-05-26 15:45:00', tipo: 'actualizacion' },
  { id: '5', usuario: 'Admin', accion: 'Eliminación de turno', detalle: 'Turno #T-2026-05-26-003 eliminado', fecha: '2026-05-26 14:20:00', tipo: 'eliminacion' },
]

const actionColors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  creacion: 'info',
  actualizacion: 'success',
  sistema: 'warning',
  eliminacion: 'danger',
}

export function AuditoriaPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Auditoría Legal</h1>
          <p className="text-sm text-text-muted mt-1">Trazabilidad de todas las operaciones del sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <Input placeholder="Buscar en auditoría..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-surface-hover transition-colors">
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                  log.tipo === 'eliminacion' ? 'bg-danger/10' : log.tipo === 'creacion' ? 'bg-primary/10' : log.tipo === 'actualizacion' ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  <Shield className={`h-4 w-4 ${
                    log.tipo === 'eliminacion' ? 'text-danger' : log.tipo === 'creacion' ? 'text-primary' : log.tipo === 'actualizacion' ? 'text-success' : 'text-warning'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text">{log.accion}</span>
                    <Badge variant={actionColors[log.tipo]}>{log.tipo}</Badge>
                  </div>
                  <p className="text-sm text-text-muted mt-1">{log.detalle}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-dim">
                    <span>Usuario: {log.usuario}</span>
                    <span>{log.fecha}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
