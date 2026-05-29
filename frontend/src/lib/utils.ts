import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function formatHour(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(estado: string): string {
  const colors: Record<string, string> = {
    activo: 'text-success',
    inactivo: 'text-text-muted',
    pendiente: 'text-warning',
    en_curso: 'text-primary',
    completado: 'text-success',
  }
  return colors[estado] || 'text-text-muted'
}

export function getStatusBg(estado: string): string {
  const colors: Record<string, string> = {
    activo: 'bg-success/10',
    inactivo: 'bg-text-muted/10',
    pendiente: 'bg-warning/10',
    en_curso: 'bg-primary/10',
    completado: 'bg-success/10',
  }
  return colors[estado] || 'bg-text-muted/10'
}
