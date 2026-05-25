# Tareas de Iván — Sprint Nomara
**Owner: Iván**
**Días: 1 al 4 del sprint**
**Referencia:** Ver `FRONTEND_SETUP.md` para setup del entorno

---

## URLs del proyecto

| Entorno | URL |
|---|---|
| **Local** | `http://localhost:3000/api/v1` |
| **Producción (Railway)** | `https://nomara-production.up.railway.app/api/v1` |

> Verifica que el backend está corriendo antes de trabajar:
> ```bash
> curl https://nomara-production.up.railway.app/health
> # Respuesta esperada: {"status":"ok","proyecto":"Nomara API","version":"1.0.0"}
> ```

---

## Tu responsabilidad en el sprint

Iván construye las vistas de **Empleados** y **Liquidaciones** — el núcleo administrativo de la app.

---

## Día 1 — Empleados (Base)

### Objetivo del día
Que se pueda ver, crear y filtrar empleados desde la UI, consumiendo la API real de Joan.

### Tarea 1.1 — Tabla de empleados
**Endpoint:** `GET /api/v1/empleados`

Construir una tabla con estas columnas:

| # | Nombre | Documento | Sueldo Base | Estado | Rol | Acción |
|---|---|---|---|---|---|---|

**Requisitos:**
- Mostrar badge de color: ACTIVO (verde) / INACTIVO (rojo)
- Filtro por estado (dropdown: Todos / Activos / Inactivos)
- Loading state mientras carga la API
- Si la lista está vacía, mostrar mensaje "No hay empleados registrados"

```typescript
// Ejemplo de fetch
const [empleados, setEmpleados] = useState([]);

useEffect(() => {
  fetch('/api/v1/empleados')
    .then(r => r.json())
    .then(setEmpleados);
}, []);
```

### Tarea 1.2 — Formulario "Crear Empleado"
**Endpoint:** `POST /api/v1/empleados`

Formulario con estos campos:
- **Tipo de documento:** Select (CC, NIT, CE, PA)
- **Número de documento:** Input texto
- **Nombre completo:** Input texto
- **Sueldo base:** Input número (en pesos COP)
- **Rol:** Select (COLABORADOR, JEFE_OPERACIONES, ADMIN_NOMINA)
- **Fecha de ingreso:** Date picker

**Validaciones en UI (antes de enviar):**
- Todos los campos obligatorios
- Sueldo > 0
- Fecha de ingreso no puede ser futura

**Manejo de respuestas:**
```typescript
const res = await fetch('/api/v1/empleados', { method: 'POST', ... });

if (res.status === 409) {
  // Mostrar: "Ya existe un empleado con ese documento"
}
if (res.status === 201) {
  // Cerrar modal, recargar lista
}
```

### Tarea 1.3 — Dar de baja empleado
**Endpoint:** `PATCH /api/v1/empleados/:id/desactivar`

- Botón "Dar de Baja" en cada fila de la tabla
- **Modal de confirmación** antes de ejecutar (¡obligatorio!)
- Texto del modal: "¿Confirmas dar de baja a [nombre]? Esta acción cambiará su estado a INACTIVO."
- Después de confirmar → recargar tabla

---

## Día 2 — Integración y refinamiento Empleados

### Tarea 2.1 — Ficha de detalle del empleado
**Endpoint:** `GET /api/v1/empleados/:id`

Al hacer clic en un empleado de la tabla → abrir vista de detalle (modal o página nueva):
- Todos los datos del empleado
- Botón "Ver liquidación" → navega a la vista de liquidación (Tarea 3.1)
- Botón "Ver turnos" → navega a la vista de David

### Tarea 2.2 — Estados de error visibles
- Si la API devuelve `500` → mostrar banner rojo "Error del servidor, intenta de nuevo"
- Si pierde conexión → mostrar "Sin conexión con el servidor"

---

## Día 3 — Liquidaciones

### Tarea 3.1 — Vista de liquidación de empleado
**Endpoint:** `GET /api/v1/liquidaciones/:empleadoId?periodo=YYYY-MM`

Construir una vista con:

**Selector de periodo** (mes/año):
```
[Mayo 2026 ▼]
```

**Cards de resumen:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Total Horas    │  │ Horas Ordinarias│  │ Horas Nocturnas │
│     48.5 h      │  │     32 h        │  │     16.5 h      │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────┐
│         TOTAL DEVENGADO                 │
│         $344.999 COP                    │
└─────────────────────────────────────────┘
```

**Tabla de desglose por tipo de hora:**
| Tipo | Horas | Monto |
|---|---|---|
| Ordinario | 32 | $150.000 |
| Nocturno | 10 | $87.272 |
| Dominical | 4.5 | $45.000 |
| Nocturno Dominical | 2 | $62.727 |

```typescript
const [liquidacion, setLiquidacion] = useState(null);
const [periodo, setPeriodo] = useState('2026-05');

useEffect(() => {
  fetch(`/api/v1/liquidaciones/${empleadoId}?periodo=${periodo}`)
    .then(r => r.json())
    .then(setLiquidacion);
}, [empleadoId, periodo]);
```

### Tarea 3.2 — Formatear montos en COP
```typescript
const formatCOP = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

// Uso: formatCOP(344999) → "$344.999"
```

---

## Día 4 — Dashboard de métricas (si hay tiempo)

**Endpoint:** `GET /api/v1/liquidaciones/:id` para cada empleado activo

Cards globales del dashboard:
- Total empleados activos
- Total horas trabajadas este mes
- Total nómina devengada este mes
- Distribución horas: ordinarias vs nocturnas vs dominicales (gráfico de torta)

**Librería de gráficos recomendada (instalar en 5 min):**
```bash
npm install recharts
```

```typescript
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Ordinario', value: 200, color: '#4ade80' },
  { name: 'Nocturno', value: 45, color: '#60a5fa' },
  { name: 'Dominical', value: 30, color: '#f59e0b' },
];

<PieChart width={300} height={300}>
  <Pie data={data} dataKey="value" nameKey="name">
    {data.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

---

## Flujo de trabajo Git — Obligatorio

**Nunca hagas push directo a `main`.** Todo cambio va por Pull Request.

### Pasos para cada tarea

```bash
# 1. Crea tu rama desde main (SIEMPRE desde main actualizado)
git checkout main
git pull origin main
git checkout -b feature/empleados-tabla-ivan     # nombre descriptivo

# 2. Trabaja en tu rama — commits pequeños y descriptivos
git add src/components/EmpleadosTable.tsx
git commit -m "feat: tabla de empleados con filtro por estado"

# 3. Sube tu rama a GitHub
git push origin feature/empleados-tabla-ivan

# 4. Crea el Pull Request en GitHub
#    → Base: main  |  Compare: tu rama
#    → Título: "feat: tabla de empleados con filtro por estado"
#    → Description: qué hace, qué endpoints consume, cómo probarlo
```

### Convención de nombres de ramas

```
feature/<descripción>-ivan     → nueva funcionalidad
fix/<descripción>-ivan         → corrección de bug
```

### El pipeline que debe pasar antes del merge

Tu PR dispara automáticamente estos 4 checks en GitHub Actions:

| Check | Qué valida | Cómo pasarlo |
|---|---|---|
| **Lint** | Código sin errores de estilo TypeScript | `npm run lint` localmente antes de pushear |
| **Build** | TypeScript compila sin errores | `npm run build` localmente antes de pushear |
| **Test** | Tests unitarios del motor de compliance | Tus cambios no deben romper los tests existentes |
| **Security** | Sin vulnerabilidades altas en dependencias | No instales paquetes sin revisar con `npm audit` |

### Antes de abrir tu PR — checklist rápido

```bash
# Correr localmente (en la carpeta raíz del proyecto — donde está package.json):
npm run lint       # ¿pasa sin errores?
npm run build      # ¿compila limpio?
npm run test       # ¿pasan los tests?
```

Si alguno falla localmente, el pipeline en GitHub también fallará. Mejor arreglarlo antes de pushear.

### Cuándo el PR está listo para merge

1. Los 4 checks están en verde ✅
2. Joan Michael revisó y aprobó el PR
3. No hay conflictos con `main`

Avísale a Joan por WhatsApp/Discord cuando abras el PR para que lo revise rápido.

---

## Criterio de Done para cada tarea

Antes de mover una tarjeta a Done en Trello, verifica:
- [ ] Funciona con datos reales de la API (no datos hardcodeados)
- [ ] Probado en producción: `https://nomara-production.up.railway.app`
- [ ] Funciona si el servidor devuelve un error
- [ ] Se ve bien en pantalla de 1366x768 (resolución típica de laptop)
- [ ] El pipeline de GitHub Actions pasa en verde (Lint + Build + Test + Security)
- [ ] Avisaste a Joan que el endpoint está siendo consumido (por si hay bugs de CORS o formato)

---

## Contacto
- **Joan Michael** — Backend API, cualquier duda de endpoints o formato de datos
- **David** — Frontend compañero, coordina con él para no pisar el mismo componente
- **Tablero Trello:** [trello.com/b/fSTeDcry/nomara](https://trello.com/b/fSTeDcry/nomara)
