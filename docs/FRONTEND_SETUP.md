# Nomara — Guía de Onboarding Frontend
**Para: Iván y David**
**Sprint:** 5 días · Presentación sábado

---

## 1. ¿Qué están construyendo?

Nomara es un motor de cumplimiento de nómina para Pymes colombianas. El backend (Joan) ya tiene la API corriendo. Ustedes construyen la **interfaz web** que consume esa API.

La presentación dura **10 minutos**. El flujo de demo es:
```
Login → Ver empleados → Asignar turno → Ver compliance warning → Ver liquidación
```

---

## 2. Configuración del entorno local

### Requisitos
- Node.js 20+ ([nodejs.org](https://nodejs.org))
- Git
- VS Code (recomendado) o cualquier IDE

### Clonar el repositorio
```bash
git clone https://github.com/J04NONE/nomara.git
cd nomara
```

### Instalar dependencias del backend (para referencia)
```bash
npm install
```

### Variables de entorno
Pídanle a Joan el archivo `.env`. **No lo compartan ni suban a Git.**

---

## 3. Correr el backend localmente

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`.

**Verificar que funciona:**
```bash
curl http://localhost:3000/health
# Respuesta: {"status":"ok","proyecto":"Nomara API","version":"1.0.0"}
```

---

## 4. API disponible — Endpoints que van a consumir

### Base URL
- **Local:** `http://localhost:3000/api/v1`
- **Producción (Railway):** `https://nomara-production.up.railway.app/api/v1`

### Empleados
```
GET    /api/v1/empleados              → lista todos los empleados
GET    /api/v1/empleados?estado=ACTIVO → solo activos
GET    /api/v1/empleados/:id          → detalle de un empleado
POST   /api/v1/empleados              → crear empleado
PATCH  /api/v1/empleados/:id/desactivar → dar de baja
```

**Ejemplo POST empleado:**
```json
{
  "tipoDoc": "CC",
  "numDoc": "1234567890",
  "nombre": "María López",
  "sueldoBase": 1800000,
  "rol": "COLABORADOR",
  "fechaIngreso": "2026-01-15"
}
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "tipoDoc": "CC",
  "numDoc": "1234567890",
  "nombre": "María López",
  "sueldoBase": 1800000,
  "estado": "ACTIVO",
  "rol": "COLABORADOR",
  "fechaIngreso": "2026-01-15",
  "createdAt": "2026-05-25T..."
}
```

### Turnos
```
GET    /api/v1/turnos                       → todos los turnos
GET    /api/v1/turnos?empleadoId=uuid       → turnos de un empleado
POST   /api/v1/turnos                       → asignar turno
```

**Ejemplo POST turno:**
```json
{
  "empleadoId": "uuid-del-empleado",
  "horaEntrada": "2026-05-26T22:00:00",
  "horaSalida": "2026-05-27T06:00:00"
}
```

**Respuesta (incluye segmentos calculados automáticamente):**
```json
{
  "id": "uuid-turno",
  "empleadoId": "uuid-empleado",
  "horaEntrada": "2026-05-26T22:00:00.000Z",
  "horaSalida": "2026-05-27T06:00:00.000Z",
  "estado": "ACTIVO",
  "segmentos": [
    {
      "fecha": "2026-05-26",
      "tipoHora": "NOCTURNO",
      "horas": 2,
      "valorHora": 9090.91,
      "recargoAplicado": 0.35,
      "valorTotal": 24545.46
    },
    {
      "fecha": "2026-05-27",
      "tipoHora": "NOCTURNO_DOMINICAL",
      "horas": 6,
      "valorHora": 9090.91,
      "recargoAplicado": 1.15,
      "valorTotal": 62727.28
    }
  ]
}
```

### Vigencias Normativas
```
GET    /api/v1/vigencias    → lista vigencias (parámetros de la Ley 2466)
POST   /api/v1/vigencias    → crear vigencia
```

### Liquidaciones
```
GET    /api/v1/liquidaciones/:empleadoId               → liquidación total
GET    /api/v1/liquidaciones/:empleadoId?periodo=2026-05 → por mes
```

**Respuesta liquidación:**
```json
{
  "empleadoId": "uuid",
  "nombreEmpleado": "María López",
  "periodo": "2026-05",
  "totalHoras": 48.5,
  "totalOrdinario": 150000,
  "totalNocturno": 87272,
  "totalDominical": 45000,
  "totalNocturnoDominical": 62727,
  "totalDevengado": 344999,
  "detalleSegmentos": 12
}
```

---

## 5. Stack de frontend recomendado

Joan no impone stack. Opciones recomendadas por tiempo:

| Stack | Tiempo setup | Complejidad |
|---|---|---|
| **React + Vite + Tailwind** | 10 min | Media — recomendado |
| **Next.js 15** | 15 min | Media-alta |
| **HTML + Fetch puro** | 5 min | Baja (si el tiempo aprieta) |

### Crear proyecto React + Vite rápido:
```bash
npm create vite@latest nomara-frontend -- --template react-ts
cd nomara-frontend
npm install
npm install axios
npm run dev
```

### Configurar proxy (para evitar CORS en local):
En `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

---

## 6. Hacer llamadas a la API

### Con fetch nativo:
```typescript
// GET empleados
const res = await fetch('/api/v1/empleados');
const empleados = await res.json();

// POST empleado
const res = await fetch('/api/v1/empleados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipoDoc: 'CC',
    numDoc: '1234567890',
    nombre: 'María López',
    sueldoBase: 1800000,
    fechaIngreso: '2026-01-15'
  })
});
const nuevo = await res.json();
```

### Con axios (más cómodo):
```typescript
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

const empleados = await api.get('/empleados').then(r => r.data);
const nuevo = await api.post('/empleados', dto).then(r => r.data);
```

---

## 7. Manejo de errores

La API devuelve siempre este formato de error:
```json
{ "error": "Descripción del error" }
```

Códigos HTTP importantes:
- `400` → campos faltantes o formato inválido
- `404` → empleado o turno no encontrado
- `409` → duplicado (empleado con mismo documento)
- `422` → regla de negocio violada (empleado inactivo, horas inválidas)
- `500` → error interno del servidor (avisar a Joan)

---

## 8. Flujo de trabajo Git

```bash
# Crear rama para su feature
git checkout -b feature/vista-empleados-ivan
git checkout -b feature/formulario-turnos-david

# Trabajar... luego:
git add src/components/EmpleadosTable.tsx
git commit -m "feat: tabla de empleados con filtro por estado"

# Push y PR a main
git push origin feature/vista-empleados-ivan
```

**Reglas:**
- PRs pequeños (máximo 200 líneas)
- No hacer push directo a `main`
- El CI debe pasar (build sin errores)

---

## 9. Datos de prueba

Crear estos empleados primero para tener datos:

```bash
# Ana Torres - Jefe de Operaciones
curl -X POST http://localhost:3000/api/v1/empleados \
  -H "Content-Type: application/json" \
  -d '{"tipoDoc":"CC","numDoc":"1023456789","nombre":"Ana María Torres","sueldoBase":2000000,"rol":"JEFE_OPERACIONES","fechaIngreso":"2024-01-15"}'

# Carlos Pérez - Colaborador
curl -X POST http://localhost:3000/api/v1/empleados \
  -H "Content-Type: application/json" \
  -d '{"tipoDoc":"CC","numDoc":"98765432","nombre":"Carlos Pérez Gómez","sueldoBase":1423500,"rol":"COLABORADOR","fechaIngreso":"2025-03-01"}'
```

---

## 10. Preguntas frecuentes

**¿Cómo sé si el backend está corriendo?**
`curl http://localhost:3000/health` debe responder `{"status":"ok"...}`

**¿Por qué me da CORS?**
Asegúrate de usar el proxy de Vite (paso 5) o pídele a Joan que habilite CORS en el servidor.

**¿Los datos se guardan?**
Sí — ahora el backend usa PostgreSQL (Neon). Los datos persisten aunque reinicies el servidor.

**¿Qué es un "segmento"?**
Es el pedazo de un turno que cae en un tipo de hora diferente. Un turno de 22:00 a 06:00 genera 2 segmentos: nocturno del primer día y nocturno-dominical del segundo.
