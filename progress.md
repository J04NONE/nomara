# progress.md — Registro de Sesión

## Sesión 29-May-2026 — Sprint completo pre-presentación

### Lo que se completó hoy (todo en main ✅)

| PR | Contenido | Estado |
|----|-----------|--------|
| #2 | Frontend shell + backend migración PostgreSQL inicial | Mergeado |
| #3 | Frontend → API real (4 páginas) + seed script | Mergeado |
| #4 | 7 fixes code review + pipeline Node 22 + Railway CLI container | Mergeado |

### Fixes aplicados (code review exhaustivo)
- `src/index.ts`: IIFE con .catch(), CORS con ALLOWED_ORIGIN, DB init antes de listen
- `src/config/database.ts`: Pool max:5, connectionTimeoutMillis:5000
- `src/routes/empleados.routes.ts`: falsy-zero en sueldoBase
- `frontend/src/services/api.ts`: URLSearchParams en params
- `frontend/src/types/index.ts`: union types en CreateEmpleadoDto
- `frontend/vite.config.ts`: /health en proxy

### Pipeline CI/CD corregido
- Node 20 → 22 LTS (paridad Railway/CI, Nixpacks soporta hasta 22/23)
- `npm install -g @railway/cli` → `ghcr.io/railwayapp/cli:latest`
- `--detach` → `--ci` (bloquea y detecta fallos reales)
- `npm audit fix`: 0 vulnerabilidades (qs resuelto)
- `RAILWAY_TOKEN` rotado y actualizado en GitHub Secrets
- Deploy manual Railway exitoso

### Estado DB
- Tablas creadas por `initializeTables()` al arrancar ✅
- **Neon vacía** — falta ejecutar `npm run seed`

---

## Pendiente antes de la presentación

1. [ ] `npm run seed` — poblar Neon con 2 vigencias + 4 empleados
2. [ ] Railway dashboard → añadir `DATABASE_URL` al servicio nomara
3. [ ] Verificar URL pública de Railway end-to-end
4. [ ] Ensayar script demo (ver task_plan.md)
