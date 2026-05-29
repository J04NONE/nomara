import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Clock,
  FileSpreadsheet,
  Scale,
  FileText,
  Shield,
  PieChart,
  CalendarCheck,
  Building2,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import { Separator } from './ui/separator'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Empleados', path: '/empleados', icon: Users },
  { label: 'Turnos', path: '/turnos', icon: Clock },
  { label: 'Liquidaciones', path: '/liquidaciones', icon: FileSpreadsheet },
  { label: 'Vigencias', path: '/vigencias', icon: Scale },
  { label: 'XML Fiscal', path: '/xml-fiscal', icon: FileText },
  { label: 'Auditoría', path: '/auditoria', icon: Shield },
  { label: 'Reportes', path: '/reportes', icon: PieChart },
  { label: 'Ausentismo', path: '/ausentismo', icon: CalendarCheck },
  { label: 'Centros Costo', path: '/centros-costos', icon: Building2 },
  { label: 'Portal Colab.', path: '/portal-colaborador', icon: UserCircle },
]

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-surface/50 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
          <span className="text-sm font-bold text-background">N</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-text tracking-tight">Nomara</h1>
            <p className="text-[10px] text-text-muted leading-tight">Compliance Engine</p>
          </div>
        )}
      </div>

      <Separator className="mx-3 w-auto" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="animate-fade-in truncate">{item.label}</span>
            )}
            {!collapsed && item.label === 'Turnos' && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                3
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => useUIStore.getState().toggleSidebar()}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-hover transition-colors shadow-lg"
      >
        <svg
          className={cn('h-3 w-3 text-text-muted transition-transform', collapsed && 'rotate-180')}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </aside>
  )
}
