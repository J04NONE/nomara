# Tareas de David — Sprint Nomara
**Owner: David**
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

David construye las vistas de **Turnos** y **Compliance** — el corazón técnico de Nomara y el **factor WOW de la presentación**.

---

## Día 1 — Setup + Maquetas (mientras Joan termina los endpoints)

### Tarea 1.1 — Setup del proyecto frontend
Sigue los pasos del `FRONTEND_SETUP.md`. Mientras el backend termina de estabilizarse, trabaja con datos mock.

```typescript
// Mock temporal mientras Joan termina el endpoint
const TURNOS_MOCK = [
  {
    id: "turno-001",
    empleadoId: "emp-001",
    horaEntrada: "2026-05-26T22:00:00.000Z",
    horaSalida: "2026-05-27T06:00:00.000Z",
    estado: "ACTIVO",
    segmentos: [
      { fecha: "2026-05-26", tipoHora: "NOCTURNO", horas: 2, valorTotal: 24545 },
      { fecha: "2026-05-27", tipoHora: "NOCTURNO_DOMINICAL", horas: 6, valorTotal: 62727 }
    ]
  }
];
```

### Tarea 1.2 — Navbar y estructura de la app
Construir la navegación principal:
```
[🏠 Dashboard] [👥 Empleados] [📅 Turnos] [📋 Liquidaciones]
```

---

## Día 2 — Matriz de Turnos (vista principal)

### Tarea 2.1 — Vista de lista de turnos
**Endpoint:** `GET /api/v1/turnos` o `GET /api/v1/turnos?empleadoId=uuid`

Tabla de turnos con estas columnas:

| Empleado | Entrada | Salida | Horas | Tipo dominante | Valor Total | Estado |
|---|---|---|---|---|---|---|

**Para calcular "tipo dominante"** — el tipo con más horas en los segmentos:
```typescript
function tipoHoraDominante(segmentos: Segmento[]): string {
  const totales: Record<string, number> = {};
  for (const seg of segmentos) {
    totales[seg.tipoHora] = (totales[seg.tipoHora] ?? 0) + seg.horas;
  }
  return Object.entries(totales).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ORDINARIO';
}
```

**Badges de color por tipo:**
```
ORDINARIO          → badge gris
NOCTURNO           → badge azul oscuro
DOMINICAL          → badge naranja
NOCTURNO_DOMINICAL → badge rojo
```

### Tarea 2.2 — Formulario "Asignar Turno" (⭐ más importante)
**Endpoint:** `POST /api/v1/turnos`

Este formulario es el corazón de la demo. Tiene que quedar impecable.

**Campos:**
- **Empleado:** Select cargado desde `GET /api/v1/empleados?estado=ACTIVO`
- **Fecha y hora de entrada:** Date-time picker
- **Fecha y hora de salida:** Date-time picker

**Flujo:**
```
Usuario llena formulario → click "Asignar" → POST /api/v1/turnos
→ Si 201: mostrar tarjeta con segmentos calculados (¡WOW!)
→ Si 422: mostrar error de regla de negocio
→ Si 404: empleado no encontrado
```

**El momento WOW de la demo** — cuando se crea un turno, mostrar los segmentos calculados:
```typescript
// Después de crear el turno, mostrar resultado
const turno = await res.json(); // contiene segmentos[]

// Renderizar cada segmento con color
turno.segmentos.map(seg => (
  <div key={seg.id} style={{ borderLeft: `4px solid ${colorPorTipo[seg.tipoHora]}` }}>
    <span>{seg.fecha}</span>
    <span>{seg.tipoHora}</span>
    <span>{seg.horas}h</span>
    <span>{formatCOP(seg.valorTotal)}</span>
  </div>
))
```

```typescript
const colorPorTipo: Record<string, string> = {
  ORDINARIO:          '#6b7280',
  NOCTURNO:           '#3b82f6',
  DOMINICAL:          '#f59e0b',
  NOCTURNO_DOMINICAL: '#ef4444',
};
```

---

## Día 3 — Compliance Engine UI (⭐⭐ el factor WOW)

### Tarea 3.1 — Validación en tiempo real antes de asignar
**Endpoint:** `POST /api/v1/turnos/validar` *(Joan lo implementa el Día 2)*

Antes de hacer el POST final de creación, primero valida el turno:

```typescript
const validar = async (dto: CreateTurnoDto) => {
  const res = await fetch('/api/v1/turnos/validar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  });

  if (res.status === 422) {
    const error = await res.json();
    // Mostrar violaciones en UI
    setViolaciones(error.violaciones);
    return;
  }

  // Válido: mostrar segmentos simulados y preguntar si confirma
  const { segmentosSimulados } = await res.json();
  setPreview(segmentosSimulados);
};
```

**UI de validación — 3 estados:**

```
Estado 1 — Válido (verde):
┌────────────────────────────────────────┐
│ ✅ Turno válido según Ley 2466         │
│ Vista previa de segmentos:             │
│   • 26 May · NOCTURNO · 2h · $24.545  │
│   • 27 May · NOC-DOM  · 6h · $62.727  │
│                                        │
│ [Confirmar y guardar]                  │
└────────────────────────────────────────┘

Estado 2 — Violación (rojo):
┌────────────────────────────────────────┐
│ ❌ Turno viola la Reforma Laboral      │
│                                        │
│ • Supera el límite de 47h semanales    │
│   (llevaría 52h esta semana)           │
│                                        │
│ [Corregir fechas]                      │
└────────────────────────────────────────┘

Estado 3 — Cargando:
┌────────────────────────────────────────┐
│ ⏳ Validando con motor de compliance... │
└────────────────────────────────────────┘
```

**Esta pantalla es el momento WOW de la presentación. Asegúrate de que quede visual y clara.**

### Tarea 3.2 — Timeline de turnos del empleado
Al ver el detalle de un empleado, mostrar sus turnos en forma de timeline:

```
Semana 25 Mayo — 31 Mayo 2026
─────────────────────────────────────────────────────
Lun 26  [██████████ NOCTURNO 22:00-00:00] [██ NOC-DOM]
Mar 27  [████████ 06:00-14:00 ORDINARIO]
Mié 28  —
Jue 29  [████████████ 22:00-06:00]
─────────────────────────────────────────────────────
Total semana: 24h
```

---

## Día 4 — Pulido y vigencias

### Tarea 4.1 — Vista de vigencias normativas
**Endpoint:** `GET /api/v1/vigencias`

Tabla simple mostrando las vigencias de la Ley 2466:

| Vigente desde | Divisor | % Nocturno | % Dominical | Estado |
|---|---|---|---|---|
| 01 Ene 2026 | 220 | 35% | 80% | Activa |
| 15 Jul 2026 | 210 | 35% | 90% | Próxima |

Esta vista es importante para la explicación ante el profesor.

### Tarea 4.2 — Responsive y pulido visual
- Verificar que todas las vistas se ven bien en 1366x768
- Loading spinners en todas las llamadas API
- Mensajes de error consistentes

---

## Momento WOW — Script de demo (para el sábado)

El flujo que David debe poder demostrar en 3 minutos:

```
1. Abrir https://nomara-production.up.railway.app en el navegador
2. Ir a "Turnos" → "Asignar Turno"
3. Seleccionar empleado: Carlos Pérez
4. Entrada: Sábado 30 Mayo a las 22:00
   Salida:  Domingo 31 Mayo a las 06:00
5. Click "Validar"
   → Aparece: "✅ Turno válido"
   → Se ven los segmentos: 2h Nocturno + 6h Nocturno-Dominical
   → Se ven los valores calculados automáticamente
6. Click "Confirmar"
7. El turno aparece en la lista
8. Ir a Liquidaciones → ver el total devengado de Carlos
```

**Este flujo en 3 minutos = el factor WOW de la presentación.**

---

## Flujo de trabajo Git — Obligatorio

**Nunca hagas push directo a `main`.** Todo cambio va por Pull Request.

### Pasos para cada tarea

```bash
# 1. Crea tu rama desde main (SIEMPRE desde main actualizado)
git checkout main
git pull origin main
git checkout -b feature/formulario-turnos-david    # nombre descriptivo

# 2. Trabaja en tu rama — commits pequeños y descriptivos
git add src/components/AsignarTurnoForm.tsx
git commit -m "feat: formulario asignar turno con preview de segmentos"

# 3. Sube tu rama a GitHub
git push origin feature/formulario-turnos-david

# 4. Crea el Pull Request en GitHub
#    → Base: main  |  Compare: tu rama
#    → Título: "feat: formulario asignar turno con preview de segmentos"
#    → Description: qué hace, qué endpoints consume, cómo probarlo
```

### Convención de nombres de ramas

```
feature/<descripción>-david    → nueva funcionalidad
fix/<descripción>-david        → corrección de bug
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

- [ ] Funciona con datos reales de la API (no mock)
- [ ] Probado en producción: `https://nomara-production.up.railway.app`
- [ ] El formulario de turno muestra el preview de segmentos tras crear
- [ ] Los errores de la API se muestran de forma legible al usuario
- [ ] Se ve bien en 1366x768
- [ ] El pipeline de GitHub Actions pasa en verde (Lint + Build + Test + Security)
- [ ] Coordinaste con Iván para no tener conflictos en componentes compartidos (navbar, etc.)

---

## Contacto
- **Joan Michael** — Backend API, endpoints de compliance y turnos
- **Iván** — Frontend compañero, coordinación de componentes compartidos
- **Tablero Trello:** [trello.com/b/fSTeDcry/nomara](https://trello.com/b/fSTeDcry/nomara)
