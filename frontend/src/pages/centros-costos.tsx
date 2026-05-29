import { Building2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

const mockCentros = [
  { id: '1', nombre: 'Producción', presupuesto: 320_000_000, empleados: 42, estado: 'activo', jefe: 'Ana Romero' },
  { id: '2', nombre: 'Administración', presupuesto: 180_000_000, empleados: 18, estado: 'activo', jefe: 'Laura Gómez' },
  { id: '3', nombre: 'Tecnología', presupuesto: 150_000_000, empleados: 12, estado: 'activo', jefe: 'Pedro Castillo' },
  { id: '4', nombre: 'Contabilidad', presupuesto: 95_000_000, empleados: 8, estado: 'activo', jefe: 'Sofía Torres' },
  { id: '5', nombre: 'Logística', presupuesto: 120_000_000, empleados: 15, estado: 'inactivo', jefe: 'Diego Ramírez' },
  { id: '6', nombre: 'RRHH', presupuesto: 85_000_000, empleados: 6, estado: 'activo', jefe: 'María López' },
]

export function CentrosCostosPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Centros de Costo</h1>
          <p className="text-sm text-text-muted mt-1">Estructura organizacional y presupuestos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Centro
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {mockCentros.map((centro) => (
          <Card key={centro.id} className="group hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  {centro.nombre}
                </CardTitle>
                <Badge variant={centro.estado === 'activo' ? 'success' : 'outline'}>
                  {centro.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Presupuesto</span>
                  <span className="text-text font-mono font-medium">{formatCurrency(centro.presupuesto)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Empleados</span>
                  <span className="text-text font-mono font-medium">{centro.empleados}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Jefe</span>
                  <span className="text-text">{centro.jefe}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
