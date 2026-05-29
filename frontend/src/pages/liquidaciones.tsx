import { FileSpreadsheet, Download, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, getInitials } from '@/lib/utils'
import type { LiquidacionResumen } from '@/types'

const mockLiquidaciones: (LiquidacionResumen & { id: string })[] = [
  { id: '1', empleadoId: '1', nombreEmpleado: 'Carlos Méndez', periodo: '2026-05', totalHoras: 160, totalOrdinario: 1309090, totalNocturno: 327272, totalDominical: 0, totalNocturnoDominical: 0, totalDevengado: 1636362, detalleSegmentos: 20 },
  { id: '2', empleadoId: '2', nombreEmpleado: 'Ana Romero', periodo: '2026-05', totalHoras: 168, totalOrdinario: 2181818, totalNocturno: 763636, totalDominical: 0, totalNocturnoDominical: 0, totalDevengado: 2945454, detalleSegmentos: 22 },
  { id: '3', empleadoId: '4', nombreEmpleado: 'Laura Gómez', periodo: '2026-05', totalHoras: 144, totalOrdinario: 1047272, totalNocturno: 0, totalDominical: 0, totalNocturnoDominical: 0, totalDevengado: 1047272, detalleSegmentos: 18 },
  { id: '4', empleadoId: '3', nombreEmpleado: 'Pedro Castillo', periodo: '2026-05', totalHoras: 176, totalOrdinario: 3600000, totalNocturno: 0, totalDominical: 0, totalNocturnoDominical: 0, totalDevengado: 3600000, detalleSegmentos: 22 },
]

export function LiquidacionesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Liquidaciones</h1>
          <p className="text-sm text-text-muted mt-1">Gestión de nómina electrónica - resumen por empleado</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Todo
          </Button>
          <Button className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Generar Liquidación
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Empleado</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Período</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Horas</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Ordinario</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Nocturno</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Total Devengado</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockLiquidaciones.map((liq) => (
                  <tr key={liq.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {getInitials(liq.nombreEmpleado)}
                        </div>
                        <span className="text-sm font-medium text-text">{liq.nombreEmpleado}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">{liq.periodo}</td>
                    <td className="px-6 py-4 text-sm text-text font-mono text-right">{liq.totalHoras}h</td>
                    <td className="px-6 py-4 text-sm text-text font-mono text-right">{formatCurrency(liq.totalOrdinario)}</td>
                    <td className="px-6 py-4 text-sm text-text font-mono text-right">
                      {liq.totalNocturno > 0 ? (
                        <span className="text-secondary">{formatCurrency(liq.totalNocturno)}</span>
                      ) : (
                        <span className="text-text-dim">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-success font-bold font-mono text-right">{formatCurrency(liq.totalDevengado)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors" title="Ver detalle">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Descargar">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
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
