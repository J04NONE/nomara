import { Bell, Search, Settings } from 'lucide-react'
import { Input } from './ui/input'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <Input
            placeholder="Buscar empleados, turnos..."
            className="pl-9 h-9 text-sm bg-surface border-border/50 focus:bg-surface-hover"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </button>

        <button className="rounded-lg p-2 text-text-muted hover:text-text hover:bg-surface-hover transition-colors">
          <Settings className="h-5 w-5" />
        </button>

        <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
          <div className="text-right">
            <p className="text-sm font-medium text-text">Admin</p>
            <p className="text-xs text-text-muted">admin@nomara.co</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
