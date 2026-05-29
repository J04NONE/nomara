import { PieChart, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { mes: 'Ene', nomina: 420_000_000, recargos: 38_000_000 },
  { mes: 'Feb', nomina: 435_000_000, recargos: 42_000_000 },
  { mes: 'Mar', nomina: 458_000_000, recargos: 45_000_000 },
  { mes: 'Abr', nomina: 472_000_000, recargos: 48_000_000 },
  { mes: 'May', nomina: 489_000_000, recargos: 52_000_000 },
]

const costosData = [
  { name: 'Salarios Base', value: 65, color: '#00DAFF' },
  { name: 'Recargos', value: 12, color: '#7C3AED' },
  { name: 'Prestaciones', value: 15, color: '#00F08F' },
  { name: 'Parafiscales', value: 8, color: '#FFB347' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-xl">
        <p className="text-sm font-medium text-text">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-text-muted" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ReportesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Reportes y Analítica</h1>
          <p className="text-sm text-text-muted mt-1">Visualización de datos contables y laborales</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Nómina Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                  <XAxis dataKey="mes" stroke="#5A6278" fontSize={12} />
                  <YAxis stroke="#5A6278" fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="nomina" fill="#00DAFF" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="recargos" fill="#7C3AED" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Composición de Costos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={costosData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {costosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {costosData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-text-muted">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
