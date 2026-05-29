# findings.md — Nomara Análisis Completo (29-May-2026)

## ESTADO GENERAL

**Build:** `npm run build` → PASA sin errores  
**Tests:** 13/13 PASAN (turno.service.ts — cobertura del Compliance Engine)  
**Git:** main sincronizado con origin, 6 commits. `frontend/`, `stitch_custom_interface_design/`, `nomara/` y `nul` están UNTRACKED.  
**Deadline:** Sábado 30-May-2026, presentación 10 minutos  

---

## BACKEND — Análisis por archivo

### `src/index.ts` — BUG MENOR
- Express 5 configurado correctamente
- 4 routers montados: `/api/v1/empleados`, `/turnos`, `/vigencias`, `/liquidaciones`
- **BUG**: `testConnection()` e `initializeTables()` se llaman DENTRO del callback de `app.listen()` (líneas 27-30). Si la DB falla, el servidor ya acepta conexiones durante el gap. Solución: moverlas ANTES de `app.listen()`.
- Health endpoint `/health` correcto.

### `src/config/database.ts` — OK
- Pool de pg con SSL para Neon. Correcto.
- Crea 3 tablas: `empleados`, `vigencias_normativas`, `turnos`.
- `turnos` almacena `segmentos` como JSONB — diseño deliberado y correcto.
- No hay tabla `liquidaciones` — las liquidaciones se calculan en tiempo real desde el JSONB. Intencional.

### `src/store/index.ts` — CÓDIGO MUERTO
- Archivo existente con datos hardcodeados (2 empleados, 2 vigencias, 0 turnos).
- **NINGUNA RUTA LO IMPORTA**. La migración a PostgreSQL está completa.
- Puede eliminarse. No afecta al build ni a los tests.

### `src/services/turno.service.ts` — EXCELENTE ✅
- Compliance Engine completo. UTC-5 Colombia correcto.
- `COL_OFFSET_MS = -5 * 3_600_000` — constante correcta.
- `segmentarTurno()`: corte exacto a las 00:00 hora colombiana. Algoritmo while correcto.
- `getTipoHora()`: 4 tipos cubiertos (ORDINARIO, NOCTURNO 19-06h, DOMINICAL dom, NOCTURNO_DOMINICAL).
- `calcularRecargo()`: recargos aditivos para NOCTURNO_DOMINICAL (35+80=115%). Correcto por Ley 2466.
- `parseColombiaDateTime()`: regex en línea 82 fragil pero funciona para los casos de uso. Tests lo validan.
- `getVigenciaActiva()`: ordena descendente y busca la primera vigencia ≤ fecha. Correcto.

### `src/routes/empleados.routes.ts` — COMPLETO ✅
- `POST /`: validación de campos, deduplicación por (tipoDoc, numDoc), INSERT con RETURNING. Correcto.
- `numDoc` normalizado (quita puntos/guiones) en línea 28. **OJO**: el frontend envía `'79.123.456'` — en producción esto es coherente pero los IDs del mock no coincidirán.
- `GET /`: filtro por `?estado=`. Correcto.
- `GET /:id`: 404 si no existe. Correcto.
- `PATCH /:id/desactivar`: soft delete. Correcto.
- Falta: `PUT /:id` (edición completa) y `DELETE /:id` — no está en el plan, OK para MVP.

### `src/routes/turnos.routes.ts` — COMPLETO ✅
- `POST /`: valida empleado activo, parsea fechas, carga vigencias desde DB, segmenta, inserta con JSONB. Pipeline completo.
- Si no hay vigencias en DB, retorna 422 con mensaje claro.
- `GET /`: filtro por `?empleadoId=`. Correcto.
- Falta: `DELETE /:id` (anular turno) — no impide la demo.

### `src/routes/vigencias.routes.ts` — COMPLETO ✅
- `GET /`: lista ordenada ASC. Correcto.
- `POST /`: validación de formato fecha, dedup por fecha_inicio. Correcto.
- Falta: DELETE/PATCH — OK para MVP.

### `src/routes/liquidaciones.routes.ts` — COMPLETO ✅
- `GET /:empleadoId?periodo=YYYY-MM`: calcula desde JSONB segmentos de turnos en DB.
- Usa `AT TIME ZONE 'America/Bogota'` para filtrar por período. Correcto y más robusto que UTC-5 hardcodeado.
- Suma correctamente por tipo de hora.

### `src/middleware/errorHandler.ts` — RIESGO MENOR
- Expone `err.message` directamente. En producción puede filtrar mensajes de error internos de pg (ej. violaciones de constraint con nombres de tabla). Para demo es aceptable.

### `src/models/*.ts` — CORRECTOS ✅
- Tipos TypeScript bien definidos y coherentes con la DB.
- `Segmento` no tiene tabla propia — vive como JSONB en turnos.

---

## FRONTEND — Análisis por archivo

### `frontend/vite.config.ts` — OK
- Proxy `/api` → `http://localhost:3000`. Correcto para dev.
- Puerto 5173. OK.
- Sin configuración de build output — en producción necesitaría servir los estáticos desde Express o un CDN.

### `frontend/package.json` — Stack moderno
- React 19 + Vite 8 + TypeScript 6 + Tailwind v4 + TanStack Query v5 + Zustand v5 + Recharts v3
- Todas las librerías en versiones muy recientes (algunas bleeding edge).

### `frontend/src/types/index.ts` — SINCRONIZADO ✅
- Tipos exactamente alineados con el backend. Sin divergencias.

### `frontend/src/services/api.ts` — LISTO pero no usado ✅
- Todas las funciones implementadas: empleadosAPI, turnosAPI, vigenciasAPI, liquidacionesAPI, healthAPI.
- BASE_URL = '/api/v1' — correcto con el proxy de Vite.
- **PROBLEMA**: Ninguna página llama a estas funciones. Todo es mock.

### `frontend/src/store/index.ts` — OK
- Solo UI state (sidebar). Correcto — los datos de la API van en TanStack Query.

### `frontend/src/App.tsx` — OK
- 11 rutas bajo AdminLayout. Todas las páginas existen.
- QueryClient configurado. Listo para TanStack Query.

### `frontend/src/pages/dashboard.tsx` — MOCK ❌
- KPIs hardcodeados (128 empleados, 47 turnos, etc.)
- Charts con datos hardcodeados.
- No hay endpoint `GET /api/v1/dashboard/resumen` en backend todavía.
- Para presentación: dejar mock está bien si se explica como "demo".

### `frontend/src/pages/empleados.tsx` — MOCK ❌
- 8 empleados hardcodeados.
- Búsqueda funciona sobre el mock (filtrado local).
- Dialog "Nuevo Empleado" dice "próximamente conectado al backend".
- **DEBE CONECTARSE** para la demo real.

### `frontend/src/pages/turnos.tsx` — MOCK ❌
- 3 turnos hardcodeados con segmentos.
- Dialog "Asignar Turno" tiene form pero botón no hace nada.
- **ESTE ES EL WOW FACTOR** — conectar la creación de turno al backend y mostrar los segmentos reales es el punto de venta de la presentación.

### `frontend/src/pages/vigencias.tsx` — MOCK ❌ + DATO INCORRECTO
- `pctDominical: 75` vs backend `pctDominical: 80`. DATOS DESINCRONIZADOS.
- Dialog "Nueva Vigencia" placeholder.
- Conectar para la demo.

### `frontend/src/pages/liquidaciones.tsx` — MOCK ❌
- Datos hardcodeados. La suma está internamente consistente pero no viene del backend.
- Debe conectarse para mostrar liquidación real tras asignar turnos.

---

## PROBLEMAS CRÍTICOS PARA LA PRESENTACIÓN

| # | Severidad | Problema | Archivo | Solución |
|---|-----------|---------|---------|---------|
| 1 | 🔴 CRÍTICO | Frontend usa mock data — no se ve nada real | todos los pages | Conectar con TanStack Query |
| 2 | 🔴 CRÍTICO | DB Neon vacía — no hay datos de demo | DB | Seed script o insertar via API |
| 3 | 🔴 CRÍTICO | "Asignar Turno" no llama al API | turnos.tsx | Conectar POST /turnos |
| 4 | 🟡 IMPORTANTE | `app.listen` inicia antes que la DB se conecte | index.ts | Mover await antes de listen |
| 5 | 🟡 IMPORTANTE | frontend/ no está en git | git | `git add frontend/` |
| 6 | 🟡 IMPORTANTE | Vigencias mock tienen pctDominical=75 vs 80 en backend | vigencias.tsx | Corregir dato |
| 7 | 🟠 MENOR | `store/index.ts` es código muerto | store/index.ts | Eliminar |
| 8 | 🟠 MENOR | No hay CORS en backend | index.ts | Añadir cors package |
| 9 | 🔴 SEGURIDAD | RAILWAY_TOKEN expuesto en task_plan.md | task_plan.md | Rotar token |
| 10 | 🟠 MENOR | Sin auth JWT/RBAC | - | Fuera de scope para mañana |

---

## CONFIGURACIÓN / DEVOPS

### `.github/workflows/main.yml` — OK ✅
- Pipeline: lint → build → test (paralelo con build) → security → deploy
- Deploy condicionado a push a main. Correcto.
- Usa `RAILWAY_TOKEN` de Secrets. Correcto.
- `RAILWAY_PROJECT_ID` hardcodeado en el workflow — aceptable.

### `railway.toml` — OK
- `startCommand = "npm start"` → `node dist/index.js`. Correcto.
- Restart on failure. Correcto.

### `nixpacks.toml` — OK
- Instala → build → start. Coherente con railway.toml.
- **REDUNDANTE**: Railway ya detecta Node.js automáticamente con nixpacks. Pero no hace daño.

### `.env.example` — OK
- Documenta las 4 variables necesarias.

---

## ESTRUCTURA DE ARCHIVOS ANÓMALOS

- `nomara/nomara/` — copia anidada completa del proyecto (directorio duplicado). No debería existir.
- `nomara/nul` — artefacto Windows de un comando mal redirigido (`cmd > nul` sin PowerShell).
- `frontend/nul` — mismo problema.
- `stitch_custom_interface_design/` — diseños HTML de referencia. No son parte del build. OK tenerlos.

---

## TESTS — Cobertura actual

13 tests en `src/__tests__/turno.service.test.ts`:
- parseColombiaDateTime: 2 tests
- getVigenciaActiva: 3 tests  
- segmentarTurno: 8 tests (incluyendo casos de cruce de medianoche, cálculo monetario, dominicales)

**Sin tests de rutas (integración)** — aceptable para el sprint académico.
