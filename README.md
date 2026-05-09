# Nomara API — Taller 3

Motor especializado de cumplimiento (Compliance Engine) para nómina electrónica en Pymes colombianas. Automatiza la segmentación cronológica de turnos rotativos (Ley 2466 y Ley 2101) y el cálculo de recargos nocturnos y dominicales.

**Proyecto:** Construcción de Software — Universidad Antonio Nariño 2026  
**Autores:** Joan Michael Murillo · David Álvarez · Iván Velasco

---

## Requisitos

- Node.js 18+
- npm 9+

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Modo desarrollo (con hot-reload)
npm run dev

# 3. Compilar a JavaScript
npm run build

# 4. Ejecutar desde dist/
npm start
```

El servidor arranca en `http://localhost:3000`.

---

## Scripts npm

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor con ts-node-dev (hot reload, sin compilar) |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start` | Ejecuta `dist/index.js` (requiere build previo) |

---

## Datos seed (precargados en memoria)

Al iniciar el servidor se cargan automáticamente:

**Empleados:**
| ID | Nombre | tipoDoc+numDoc | Sueldo Base |
|----|--------|----------------|-------------|
| `emp-001` | Ana María Torres | CC 1023456789 | $2,000,000 |
| `emp-002` | Carlos Pérez Gómez | CC 98765432 | $1,423,500 |

**Vigencias Normativas (Ley 2101 + Ley 2466):**
| ID | Desde | Divisor | % Nocturno | % Dominical |
|----|-------|---------|------------|-------------|
| `vig-001` | 2026-01-01 | 220 | 35% | 80% |
| `vig-002` | 2026-07-15 | 210 | 35% | 90% |

> **Nota:** Los datos se pierden al reiniciar el servidor (sin base de datos — Taller 3).

---

## Inventario de Endpoints

### Todos los endpoints están implementados ✅

| # | Método | Ruta | Params | Body (Request) | Response | Descripción | Seguridad |
|---|--------|------|--------|----------------|----------|-------------|-----------|
| 1 | POST | `/api/v1/empleados` | — | `tipoDoc`, `numDoc`, `nombre`, `sueldoBase`, `fechaIngreso`, `rol?` | 201 / 400 / 409 | Crear empleado. Valida unicidad de `tipoDoc+numDoc` (HU-02). | No (MVP — JWT previsto en HU-03) |
| 2 | GET | `/api/v1/empleados` | `?estado=ACTIVO` | — | 200 array | Listar todos los empleados. Filtro opcional por estado. | No |
| 3 | GET | `/api/v1/empleados/:id` | `id: string` (path) | — | 200 / 404 | Obtener un empleado por UUID. | No |
| 4 | POST | `/api/v1/turnos` | — | `empleadoId`, `horaEntrada` (ISO), `horaSalida` (ISO) | 201 / 400 / 404 / 422 | **★ HU-01**: segmentación automática a medianoche Colombia (UTC-5). Calcula recargos por vigencia activa. | No |
| 5 | GET | `/api/v1/turnos` | `?empleadoId=string` | — | 200 array | Listar turnos. Filtro opcional por empleado. | No |
| 6 | GET | `/api/v1/vigencias` | — | — | 200 array | Listar vigencias normativas ordenadas por fecha. | No |
| 7 | POST | `/api/v1/vigencias` | — | `fechaInicio` (YYYY-MM-DD), `divisor`, `pctNocturno`, `pctDominical` | 201 / 400 / 409 | Crear vigencia normativa. Valida fecha única. | No |
| 8 | GET | `/api/v1/liquidaciones/:empleadoId` | `empleadoId` (path), `?periodo=YYYY-MM` | — | 200 / 404 | Resumen de horas y valores devengados, agrupados por tipo de hora. | No |

### Estado de implementación

| Endpoint | Estado |
|----------|--------|
| `POST /api/v1/empleados` | ✅ Implementado |
| `GET /api/v1/empleados` | ✅ Implementado |
| `GET /api/v1/empleados/:id` | ✅ Implementado |
| `POST /api/v1/turnos` | ✅ Implementado |
| `GET /api/v1/turnos` | ✅ Implementado |
| `GET /api/v1/vigencias` | ✅ Implementado |
| `POST /api/v1/vigencias` | ✅ Implementado |
| `GET /api/v1/liquidaciones/:empleadoId` | ✅ Implementado |

---

## Ejemplos curl

### Health check
```bash
curl http://localhost:3000/health
```

### Crear empleado
```bash
curl -X POST http://localhost:3000/api/v1/empleados \
  -H "Content-Type: application/json" \
  -d '{
    "tipoDoc": "CC",
    "numDoc": "55512345",
    "nombre": "Laura Vargas Pinto",
    "sueldoBase": 1800000,
    "rol": "COLABORADOR",
    "fechaIngreso": "2026-01-10"
  }'
```

### Listar empleados
```bash
curl http://localhost:3000/api/v1/empleados
curl "http://localhost:3000/api/v1/empleados?estado=ACTIVO"
```

### Obtener empleado por ID (seed)
```bash
curl http://localhost:3000/api/v1/empleados/emp-001
```

### Registrar turno T8 — cruce de medianoche Dom → Lun (HU-01)
```bash
curl -X POST http://localhost:3000/api/v1/turnos \
  -H "Content-Type: application/json" \
  -d '{
    "empleadoId": "emp-002",
    "horaEntrada": "2026-06-07T22:00:00",
    "horaSalida": "2026-06-08T06:00:00"
  }'
```

**Response esperado:**
```json
{
  "segmentos": [
    {
      "fecha": "2026-06-07",
      "tipoHora": "NOCTURNO_DOMINICAL",
      "horas": 2,
      "recargoAplicado": 1.15,
      "valorTotal": 27822.94
    },
    {
      "fecha": "2026-06-08",
      "tipoHora": "NOCTURNO",
      "horas": 6,
      "recargoAplicado": 0.35,
      "valorTotal": 52410.65
    }
  ]
}
```

### Listar turnos por empleado
```bash
curl "http://localhost:3000/api/v1/turnos?empleadoId=emp-002"
```

### Listar vigencias normativas
```bash
curl http://localhost:3000/api/v1/vigencias
```

### Crear vigencia normativa
```bash
curl -X POST http://localhost:3000/api/v1/vigencias \
  -H "Content-Type: application/json" \
  -d '{
    "fechaInicio": "2027-01-01",
    "divisor": 205,
    "pctNocturno": 35,
    "pctDominical": 90
  }'
```

### Consultar liquidación de un empleado
```bash
curl http://localhost:3000/api/v1/liquidaciones/emp-002
curl "http://localhost:3000/api/v1/liquidaciones/emp-002?periodo=2026-06"
```

---

## Arquitectura

```
src/
├── models/           # Interfaces TypeScript y DTOs
│   ├── empleado.model.ts
│   ├── turno.model.ts
│   ├── segmento.model.ts
│   └── vigencia.model.ts
├── store/            # Arrays in-memory + seed data
│   └── index.ts
├── services/         # Lógica de negocio
│   └── turno.service.ts  ← Motor HU-01 (segmentación UTC-5)
├── routes/           # Express Router por entidad
│   ├── empleados.routes.ts
│   ├── turnos.routes.ts
│   ├── vigencias.routes.ts
│   └── liquidaciones.routes.ts
├── middleware/
│   ├── errorHandler.ts
│   └── notFound.ts
└── index.ts          # Entry point
```

---

## Lógica de negocio — HU-01

El endpoint `POST /api/v1/turnos` implementa la segmentación cronológica automática (HU-01):

1. Parsea las fechas como hora colombiana (UTC-5).
2. Corta el turno a las **00:00:00 UTC-5** si cruza medianoche.
3. Para cada segmento determina `tipoHora`:
   - `ORDINARIO` — días hábiles entre 06:00 y 19:00
   - `NOCTURNO` — entre las 19:00 y las 06:00 (Ley 2466)
   - `DOMINICAL` — domingo, horario diurno
   - `NOCTURNO_DOMINICAL` — domingo en horario nocturno
4. Consulta la `VigenciaNormativa` activa por fecha (lookup, sin hardcoding — patrón Strategy).
5. Calcula `valorTotal = valorHora × (1 + recargoAplicado) × horas`.

---

## Colección Postman

Archivo: [`nomara.postman_collection.json`](./nomara.postman_collection.json)

**Importar en Postman:**
1. Abrir Postman → Import → Upload Files
2. Seleccionar `nomara.postman_collection.json`
3. La variable `{{baseUrl}}` está configurada a `http://localhost:3000`

---

## Marco normativo

- **Ley 2466 de 2025:** recargo nocturno 35% desde las 19:00 h
- **Ley 2101 de 2021:** divisor 220 (2026) → 210 (desde 15 jul 2026)
- **Resolución 000013 DIAN:** estructura del XML de nómina electrónica (MVP futuro)
