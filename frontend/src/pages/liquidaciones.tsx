import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileSpreadsheet, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { empleadosAPI, liquidacionesAPI } from '@/services/api'
import { formatCurrency } from '@/lib/utils'

export function LiquidacionesPage() {
  const [empleadoId, setEmpleadoId] = useState('')
  const [periodo, setPeriodo] = useState('')

  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados'],
    queryFn: () => empleadosAPI.getAll(),
  })

  const { data: liquidacion, isLoading, isError, error } = useQuery({
    queryKey: ['liquidacion', empleadoId, periodo],
    queryFn: () => liquidacionesAPI.getByEmpleado(empleadoId, periodo || undefined),
    enabled: !!empleadoId,
  })

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
            Exportar
          </Button>
          <Button className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Generar Liquidación
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Empleado</label>
              <Select value={empleadoId} onValueChange={setEmpleadoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un empleado..." />
                </SelectTrigger>
                <SelectContent>
                  {empleados.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Período (opcional)</label>
              <input
                type="month"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!empleadoId ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-text-dim mx-auto mb-3" />
            <p className="text-text-muted">Selecciona un empleado para ver su liquidación</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center gap-3 text-text-muted">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Calculando liquidación...</span>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-danger font-medium">{error instanceof Error ? error.message : 'Error al cargar la liquidación'}</p>
          </CardContent>
        </Card>
      ) : liquidacion ? (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text">{liquidacion.nombreEmpleado}</h2>
                <p className="text-xs text-text-muted mt-0.5">{liquidacion.detalleSegmentos} segmentos calculados</p>
              </div>
              <Badge variant="outline">
                {liquidacion.periodo === 'todos' ? 'Todos los períodos' : liquidacion.periodo}
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">Concepto</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider pb-3">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {liquidacion.totalOrdinario > 0 && (
                  <tr>
                    <td className="py-3 pr-4 text-text">Horas Ordinarias</td>
                    <td className="py-3 text-right font-mono text-text">{formatCurrency(liquidacion.totalOrdinario)}</td>
                  </tr>
                )}
                {liquidacion.totalNocturno > 0 && (
                  <tr>
                    <td className="py-3 pr-4 text-text">Horas Nocturnas <span className="text-text-muted text-xs">(+35%)</span></td>
                    <td className="py-3 text-right font-mono text-secondary">{formatCurrency(liquidacion.totalNocturno)}</td>
                  </tr>
                )}
                {liquidacion.totalDominical > 0 && (
                  <tr>
                    <td className="py-3 pr-4 text-text">Horas Dominicales <span className="text-text-muted text-xs">(+80%)</span></td>
                    <td className="py-3 text-right font-mono text-secondary">{formatCurrency(liquidacion.totalDominical)}</td>
                  </tr>
                )}
                {liquidacion.totalNocturnoDominical > 0 && (
                  <tr>
                    <td className="py-3 pr-4 text-text">Noct. Dominicales <span className="text-text-muted text-xs">(+115%)</span></td>
                    <td className="py-3 text-right font-mono text-secondary">{formatCurrency(liquidacion.totalNocturnoDominical)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="pt-4 pr-4 font-semibold text-text">Total Horas</td>
                  <td className="pt-4 text-right font-mono font-semibold text-text">{liquidacion.totalHoras.toFixed(2)} h</td>
                </tr>
                <tr>
                  <td className="pt-2 pr-4 font-bold text-text text-base">Total Devengado</td>
                  <td className="pt-2 text-right font-mono font-bold text-success text-base">{formatCurrency(liquidacion.totalDevengado)}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
