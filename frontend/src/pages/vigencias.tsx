import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { vigenciasAPI } from '@/services/api'
import type { CreateVigenciaDto } from '@/types'

export function VigenciasPage() {
  const [open, setOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [divisor, setDivisor] = useState('')
  const [pctNocturno, setPctNocturno] = useState('')
  const [pctDominical, setPctDominical] = useState('')

  const queryClient = useQueryClient()

  const { data: vigencias = [], isLoading, isError, error } = useQuery({
    queryKey: ['vigencias'],
    queryFn: () => vigenciasAPI.getAll(),
  })

  const crearMutation = useMutation({
    mutationFn: (dto: CreateVigenciaDto) => vigenciasAPI.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vigencias'] })
      setOpen(false)
      setFechaInicio(''); setDivisor(''); setPctNocturno(''); setPctDominical('')
    },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Vigencias Normativas</h1>
          <p className="text-sm text-text-muted mt-1">Parámetros legales para el motor de compliance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Vigencia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Vigencia Normativa</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text">Fecha de Inicio</label>
                <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text">Divisor de horas</label>
                <Input type="number" value={divisor} onChange={(e) => setDivisor(e.target.value)} placeholder="220" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">% Nocturno</label>
                  <Input type="number" value={pctNocturno} onChange={(e) => setPctNocturno(e.target.value)} placeholder="35" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text">% Dominical</label>
                  <Input type="number" value={pctDominical} onChange={(e) => setPctDominical(e.target.value)} placeholder="80" />
                </div>
              </div>
              {crearMutation.isError && (
                <p className="text-sm text-danger">{crearMutation.error?.message}</p>
              )}
              <Button
                className="w-full"
                disabled={crearMutation.isPending || !fechaInicio || !divisor || !pctNocturno || !pctDominical}
                onClick={() => crearMutation.mutate({ fechaInicio, divisor: Number(divisor), pctNocturno: Number(pctNocturno), pctDominical: Number(pctDominical) })}
              >
                {crearMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : 'Crear Vigencia'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 p-12 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Cargando vigencias...</span>
        </div>
      ) : isError ? (
        <div className="p-12 text-center">
          <p className="text-danger">{(error as Error)?.message}</p>
        </div>
      ) : vigencias.length === 0 ? (
        <div className="p-12 text-center text-text-muted">No hay vigencias registradas. Crea la primera.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {vigencias.map((vig) => {
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
      )}
    </div>
  )
}
