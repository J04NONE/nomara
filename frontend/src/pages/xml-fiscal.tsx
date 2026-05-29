import { FileText, Download, Printer, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'

const mockXML = [
  { id: '1', empleado: 'Carlos Méndez', periodo: 'Mayo 2026', estado: 'generado', fecha: '2026-05-27', total: 1757455, codigo: 'NOM-2026-05-001' },
  { id: '2', empleado: 'Ana Romero', periodo: 'Mayo 2026', estado: 'firmado', fecha: '2026-05-27', total: 2798182, codigo: 'NOM-2026-05-002' },
  { id: '3', empleado: 'Laura Gómez', periodo: 'Mayo 2026', estado: 'pendiente', fecha: '2026-05-26', total: 1512000, codigo: 'NOM-2026-05-003' },
]

export function XmlFiscalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">XML Fiscal</h1>
          <p className="text-sm text-text-muted mt-1">Generación de archivos XML para nómina electrónica DIAN</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Generar XML
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Código</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Empleado</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Período</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Fecha</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Valor</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockXML.map((xml) => (
                  <tr key={xml.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-text">{xml.codigo}</td>
                    <td className="px-6 py-4 text-sm text-text">{xml.empleado}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{xml.periodo}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(xml.fecha)}</td>
                    <td className="px-6 py-4 text-sm text-text font-mono text-right">{formatCurrency(xml.total)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={xml.estado === 'firmado' ? 'success' : xml.estado === 'generado' ? 'info' : 'warning'}>
                        {xml.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors" title="Ver XML">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Descargar">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors" title="Imprimir">
                          <Printer className="h-4 w-4" />
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
