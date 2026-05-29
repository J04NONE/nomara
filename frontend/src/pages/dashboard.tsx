import { TrendingUp, Users, Clock, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const kpiData = [
  {
    title: 'Empleados Activos',
    value: '128',
    change: '+4',
    positive: true,
    icon: Users,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Turnos Hoy',
    value: '47',
    change: '+12',
    positive: true,
    icon: Clock,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    title: 'Liquidaciones Pend.',
    value: '23',
    change: '-8',
    positive: false,
    icon: Activity,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    title: 'Nómina del Mes',
    value: formatCurrency(589_000_000),
    change: '+3.2%',
    positive: true,
    icon: DollarSign,
    color: 'text-info',
    bg: 'bg-info/10',
  },
]

const hourlyData = [
  { hora: '06h', ordinario: 12, nocturno: 0, dominical: 0 },
  { hora: '08h', ordinario: 18, nocturno: 0, dominical: 2 },
  { hora: '10h', ordinario: 24, nocturno: 0, dominical: 4 },
  { hora: '12h', ordinario: 20, nocturno: 0, dominical: 3 },
  { hora: '14h', ordinario: 22, nocturno: 0, dominical: 5 },
  { hora: '16h', ordinario: 19, nocturno: 1, dominical: 2 },
  { hora: '18h', ordinario: 15, nocturno: 3, dominical: 1 },
  { hora: '20h', ordinario: 5, nocturno: 8, dominical: 0 },
  { hora: '22h', ordinario: 0, nocturno: 12, dominical: 0 },
  { hora: '00h', ordinario: 0, nocturno: 8, dominical: 0 },
]

const weeklyData = [
  { dia: 'Lun', nomina: 82_000_000, turnos: 45 },
  { dia: 'Mar', nomina: 85_000_000, turnos: 48 },
  { dia: 'Mié', nomina: 78_000_000, turnos: 42 },
  { dia: 'Jue', nomina: 91_000_000, turnos: 52 },
  { dia: 'Vie', nomina: 88_000_000, turnos: 50 },
  { dia: 'Sáb', nomina: 65_000_000, turnos: 35 },
  { dia: 'Dom', nomina: 45_000_000, turnos: 22 },
]

const tipoHorasData = [
  { name: 'Ordinarias', value: 65, color: '#00DAFF' },
  { name: 'Nocturnas', value: 20, color: '#7C3AED' },
  { name: 'Dominicales', value: 10, color: '#00F08F' },
  { name: 'Noct. Dom.', value: 5, color: '#FFB347' },
]

const recentActivity = [
  { action: 'Turno creado', empleado: 'Carlos Méndez', tipo: 'Nocturno (22:00-06:00)', tiempo: 'hace 5 min' },
  { action: 'Liquidación generada', empleado: 'Ana Romero', tipo: 'Periodo Abril 2026', tiempo: 'hace 18 min' },
  { action: 'Empleado agregado', empleado: 'Pedro Castillo', tipo: 'Desarrollador Senior', tiempo: 'hace 1 h' },
  { action: 'Vigencia actualizada', empleado: 'Sistema', tipo: 'Divisor: 220 → 210', tiempo: 'hace 2 h' },
  { action: 'Turno completado', empleado: 'Laura Gómez', tipo: 'Diurno (06:00-14:00)', tiempo: 'hace 3 h' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-xl">
        <p className="text-sm font-medium text-text">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-text-muted" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Resumen operativo de Nomara</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Sistema operativo
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="group hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.positive ? 'text-success' : 'text-danger'}`}>
                  {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-text">{kpi.value}</p>
              <p className="text-sm text-text-muted">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Hourly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Distribución Horaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="ordinario" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00DAFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00DAFF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="nocturno" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                  <XAxis dataKey="hora" stroke="#5A6278" fontSize={12} />
                  <YAxis stroke="#5A6278" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ordinario" stroke="#00DAFF" fill="url(#ordinario)" strokeWidth={2} />
                  <Area type="monotone" dataKey="nocturno" stroke="#7C3AED" fill="url(#nocturno)" strokeWidth={2} />
                  <Area type="monotone" dataKey="dominical" stroke="#00F08F" fill="url(#ordinario)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Nómina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Nómina Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                  <XAxis dataKey="dia" stroke="#5A6278" fontSize={12} />
                  <YAxis stroke="#5A6278" fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="nomina" fill="#00DAFF" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Tipos de Horas Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Tipos de Horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipoHorasData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tipoHorasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {tipoHorasData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-text-muted">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{item.action}</p>
                      <p className="text-xs text-text-muted">{item.empleado} · {item.tipo}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-dim">{item.tiempo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
