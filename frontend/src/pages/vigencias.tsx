import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { VigenciaNormativa } from '@/types'

const mockVigencias: VigenciaNormativa[] = [
  { id: '1', fechaInicio: '2025-07-16', divisor: 220, pctNocturno: 35, pctDominical: 75 },
  { id: '2', fechaInicio: '2026-07-15', divisor: 210, pctNocturno: 35, pctDominical: 75 },
]

export function VigenciasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Vigencias Normativas</h1>
          <p className="text-sm text-text-muted mt-1">Parámetros legales para el motor de compliance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Vigencia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Vigencia</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-muted">Formulario de nueva vigencia (próximamente conectado al backend).</p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vigencias Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {mockVigencias.map((vig) => {
          const esActual = vig.fechaInicio <= new Date().toISOString().slice(0, 10)
          return (
            <Card key={vig.id} className="group hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      Vigencia desde {vig.fechaInicio}
                    </CardTitle>
                    <CardDescription>
                      Parámetros normativos configurados para el motor de compliance.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {esActual ? (
                      <Badge variant="success" className="gap-1">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="outline">Futura</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-text-muted mb-1">Divisor</p>
                    <p className="text-xl font-bold text-text font-mono">{vig.divisor}</p>
                    <p className="text-[10px] text-text-dim">días</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-text-muted mb-1">Nocturno</p>
                    <p className="text-xl font-bold text-primary font-mono">{vig.pctNocturno}%</p>
                    <p className="text-[10px] text-text-dim">Ley 2466</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-text-muted mb-1">Dominical</p>
                    <p className="text-xl font-bold text-success font-mono">{vig.pctDominical}%</p>
                    <p className="text-[10px] text-text-dim">recargo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
