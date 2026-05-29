import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, getInitials } from '@/lib/utils'

const mockAusentismo = [
  { id: '1', empleado: 'Carlos Méndez', tipo: 'Incapacidad Médica', inicio: '2026-05-25', fin: '2026-05-28', estado: 'activo', dias: 4, documento: 'INC-2026-05-001' },
  { id: '2', empleado: 'Laura Gómez', tipo: 'Permiso Remunerado', inicio: '2026-05-27', fin: '2026-05-27', estado: 'aprobado', dias: 1, documento: 'PER-2026-05-002' },
  { id: '3', empleado: 'Pedro Castillo', tipo: 'Vacaciones', inicio: '2026-06-01', fin: '2026-06-15', estado: 'pendiente', dias: 15, documento: 'VAC-2026-06-001' },
]

export function AusentismoPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Novedades de Ausentismo</h1>
          <p className="text-sm text-text-muted mt-1">Gestión de incapacidades, permisos y vacaciones</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Novedad
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Documento</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Empleado</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Tipo</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Inicio</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Fin</th>
                  <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Días</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockAusentismo.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-text-muted">{item.documento}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {getInitials(item.empleado)}
                        </div>
                        <span className="text-sm font-medium text-text">{item.empleado}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">{item.tipo}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(item.inicio)}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(item.fin)}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-text font-mono">{item.dias}</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.estado === 'activo' ? 'warning' : item.estado === 'aprobado' ? 'success' : 'info'}>
                        {item.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
