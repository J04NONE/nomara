# Nomara — Documentos del Proyecto

---

## 1. README.md

# nomara
Nomara es un proyecto para la materia construcción de un motor especializado de cumplimiento (Compliance Engine) diseñado para automatizar la liquidación de nómina electrónica en Pymes colombianas. El proyecto aborda la complejidad de la Reforma Laboral 2026 (Ley 2466) y la Ley 2101, automatizando la segmentación cronológica de turnos rotativos en operaciones 7x24.

---

## 2. Crear el proyecto (Crear_el_proyecto.docx)

- Crear el proyecto:

```
mkdir my-rest-api

cd my-rest-api

npm init -y
```

- Instalar TypeScript y Node.js tipos:

```
npm install typescript @types/node --save-dev
```

- Inicializar TypeScript:

```
npx tsc --init
```

- Instalar Express y sus tipos:

```
npm install express @types/express
```

- Instalar ts-node-dev (para desarrollo):

```
npm install ts-node-dev --save-dev
```

- Configurar package.json scripts:

```json
"scripts": {
  "start": "node dist/index.js",
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc"
},
```

- Implementa los servicios

- npm run dev

---

## 3. CS - Taller 3 (CS_-_Taller_3.pdf)

### TALLER 3: Inventario de Endpoints + API en Node/TypeScript (sin persistencia)

**Objetivo:** Definir y documentar los endpoints de un servicio REST y activar algunos de ellos en un servidor Node + TypeScript usando almacenamiento en memoria (RAM), sin base de datos.

### 1. Inventario de Endpoints

Antes de identificar funcionalidades, es fundamental precisar a quién se dirige el proyecto y qué necesidad busca atender. Para ello, responde de manera breve y concreta las siguientes preguntas.

Cree una tabla para los endpoints de su aplicación que incluya:

- **Método:** GET/POST/PUT/PATCH/DELETE
- **Ruta:** e.g., /api/v1/products/:id
- **Params:** path y query con tipos (e.g., id: string, page?: number)
- **Body (request):** campos y tipos (o JSON Schema breve)
- **Response (200/201/4xx/5xx):** estructura y ejemplo
- **Descripción:** propósito y reglas (validaciones, errores comunes)
- **Notas de seguridad:** Requiere token de autenticación (Sí / No)

### 2. Implementación

Implemente con TypeScript en Node lo siguiente:

- Al menos 5 endpoints del inventario (incluyendo 1 POST y 1 GET).
- Sin base de datos: datos en arrays en memoria (se reinician al reiniciar el servidor).
- Código en TypeScript, con tipado de DTOs y modelos.
- Manejo básico de validaciones y errores.

**NOTA:** Para este taller puede usar Firebase Studio, sin embargo, debido a sus limitaciones podrían tener bloqueos más adelante y el estudiante asume el riesgo.

### 3. Colección de pruebas

Agregar una colección de Postman con todos los requests.

### 4. README

Agregue un archivo README.md con lo siguiente:

- Los pasos para correr el proyecto, scripts npm, dependencias, ejemplos curl, etc.
- Aclarar qué endpoints quedaron implementados y cuáles solo documentados.

### Entregable

Crea un documento que contenga:

1. Inventario de endpoints
2. Enlace al código fuente (Firebase Studio o enlace a GitHub), no olviden incluir el README.md
3. Enlace a colección de Postman

**Fecha máxima de entrega:** 10 de mayo de 2026 a las 11:59 PM

**NOTA 1:** Entrega únicamente por Classroom (solo un integrante del equipo)

**NOTA 2:** Si es entregada después de la hora definida, se calificará sobre 4.

**NOTA 3:** Si se entrega con más de 6 horas de retraso. La calificación es 0.

---

## 4. Taller 2 — Diseño del Proyecto Nomara (Taller_2_Construccion_de_software___Nomara_v3.pdf)

# DISEÑO DEL PROYECTO

**Proyecto:** Nomara  
**Compliance engine para Nómina Electrónica**  
**Versión:** 2.0  
**Fecha:** abril 2026  
**Materia:** Construcción de Software  
**Universidad Antonio Nariño  **

**Elaborado por:**  
Joan Murillo  
David Alvarez  
Ivan Velasco  

**Con asistencia de:** Gemini IA

---

### Tabla de Contenido

1. Definición del contexto
   - 1.1 Nombre del proyecto
   - 1.2 Usuarios
   - 1.3 Problema
2. Requisitos Funcionales — Versión 2.0
   - Módulo 1: Configuración Normativa
   - Módulo 2: Gestión de Operación y Turnos
   - Módulo 3: Motor de Liquidación
   - Módulo 4: Cumplimiento Fiscal y Auditoría
   - Módulo 5: Centros de Costos y Dependencias
   - Módulo 6: Portal del Colaborador (Solo Lectura)
3. Historias de Usuario — Versión 2.0
   - HU-01 — Segmentación cronológica automática
   - HU-02 — Gestión de identidad y prevención de duplicados
   - HU-03 — Acceso ágil vía SSO
   - HU-04 — Parametrización de vigencias normativas
   - HU-05 — Generación de XML por segmento
   - HU-06 — Registro de ajustes con trazabilidad
   - HU-07 — Gestión de novedades de ausentismo
   - HU-08 — Trazabilidad de ajustes manuales
   - HU-09 — Registro de terminación de contrato
   - HU-10 — Gestión de nómina por Centros de Costos
   - HU-11 — Portal del Colaborador
4. Requisitos No Funcionales
5. Análisis y Priorización
   - 5A. Análisis de Requisitos
   - 5B. Priorización MoSCoW
6. Kanban — Backlog en Trello
   1. Modelo de Dominio
      - 1.1 Conceptos Clave
      - 1.2 Abstracción del Flujo Principal — HU-01
   2. Diagrama de Casos de Uso
      - 2.1 Actores Identificados
      - 2.2 Diagrama de Casos de Uso
   3. Diagrama de Clases
      - 3.1 Clases del Sistema
      - 3.2 Atributo rol en Empleado
      - 3.3 Patrón de Diseño: Strategy
   4. Diagrama de Secuencia
   5. Diagrama de Actividad
   - Distribución de Responsabilidades
   - Marco Normativo y Referencias

---

### PARTE I: MEJORANDO LA DEFINICIÓN DE REQUISITOS

#### 1. Definición del contexto

##### 1.1 Nombre del proyecto

Nomara — motor de cumplimiento para nómina electrónica con gestión operativa de turnos.

##### 1.2 Usuarios

El sistema tiene dos grupos con necesidades completamente distintas:

- **Usuarios administrativos:** jefes de nómina y gerentes de operaciones de Pymes colombianas de 5 a 200 empleados que operan 7x24. Ingresan turnos, liquidan recargos y generan el XML para la DIAN.
- **Colaboradores / Operarios:** los propios trabajadores. Necesitan ver su malla asignada, sus recargos acumulados en el periodo y el estado de sus novedades, sin poder modificar nada.

El segundo grupo no estaba en la v1.0 taller 1. Incluirlo no añade carga al motor de cálculo; solo requiere una vista de solo lectura filtrada por el ID del usuario logueado. Pero su impacto es concreto: en un hospital o empresa de vigilancia, el trabajador que no sabe a qué hora entra mañana llama al jefe de operaciones. Ese tráfico de consultas es evitable, y Nomara puede evitarlo.

##### 1.3 Problema

Dos leyes cambiaron las reglas al mismo tiempo. La Ley 2466 movió el inicio del recargo nocturno a las 19:00 h. La Ley 2101 reduce la jornada máxima a 42 horas semanales, lo que cambia el divisor de 230 a 220 (ya vigente) y a 210 desde julio de 2026. Juntas, estas variables convierten el cálculo en Excel en algo que casi garantiza errores: sanciones de la UGPP, o rechazo del XML por la DIAN por errores de redondeo.

La herramienta gratuita de la DIAN no calcula nada. Recibe el dato que el usuario ya calculó. Nomara cierra esa brecha: toma la programación de turnos y produce el XML listo, con cada centavo trazable.

**Oportunidades de mejora incorporadas en v2.0:**

1. Actores diferenciados: el usuario pasa de "Pyme genérica" a "jefe de nómina" + "jefe de operaciones", con permisos separados.
2. Nuevo actor Colaborador: portal de solo lectura para que el trabajador consulte su malla y sus recargos. Reduce consultas al área de operaciones y demuestra ante la UGPP que la empresa comunica formalmente las jornadas.
3. Escenarios T1–T8 como casos de prueba explícitos del motor de segmentación.
4. RF-01 precisado: la tabla de vigencias como mecanismo de lookup; sin hardcoding.
5. Módulo de Centros de Costos (RF-14–RF-17, HU-10): gestión por área, necesario en hospitales y empresas de seguridad.

---

#### 2. Requisitos Funcionales — Versión 2.0

Se mantienen los 12 RF del Taller 1, ajustados para T1–T8, más RF-14 a RF-20 de los nuevos módulos.

##### Módulo 1: Configuración normativa

**RF-01:** El sistema debe permitir al administrador parametrizar vigencias legales (divisor mensual y porcentajes de recargo) mediante tabla configurable, sin modificar código fuente.

**RF-02:** El sistema debe permitir gestionar el maestro de empleados (CRUD) capturando tipo de documento, número, nombre, tipo de contrato, sueldo base y fecha de ingreso. Índice único compuesto: tipo_doc + num_doc.

##### Módulo 2: Gestión de operación y turnos

**RF-03:** El sistema debe permitir registrar jornadas en UTC-5 con soporte para todos los escenarios de turno, incluyendo traspasos de medianoche (T3, T6, T7, T8).

**RF-04:** El sistema debe segmentar automáticamente cualquier turno en fracciones por día calendario a las 00:00:00 UTC-5.

##### Módulo 3: Motor de liquidación

**RF-05:** El sistema liquida recargos nocturnos con el 35% entre las 19:00 y las 06:00, según Ley 2466.

**RF-06:** El sistema calcula recargos dominicales y festivos con tasa progresiva: 80% hasta el 14/07/2026 y 90% desde el 15/07/2026, leyendo la tasa de la tabla de vigencias.

**RF-07:** El sistema calcula el valor de la hora ordinaria dividiendo el salario entre el divisor dinámico (230 / 220 / 210 según fase de Ley 2101).

##### Módulo 4: Cumplimiento fiscal y auditoría

**RF-08:** Genera el XML del Documento Soporte según Resolución 000013 de 2021. MVP: CUNE simulado con SHA-256 reproducible.

**RF-09:** Permite crear notas de ajuste tipo 'reemplazar' con referencia al documento corregido.

**RF-10:** Genera un log append-only en cada modificación de jornada: valores antes/después, ID usuario, timestamp UTC, justificación obligatoria (mín. 30 caracteres).

**RF-11:** Registra novedades de ausentismo (incapacidades y licencias), anula turnos del rango afectado y calcula el pago proporcional.

**RF-13:** Registra terminación de contrato, inhabilita al empleado para futuras mallas y reporta `<FechaRetiro>` en el XML.

##### Módulo 5: Centros de costos y dependencias

**RF-14:** Crear, editar y consultar Centros de Costos con código único (ej. CC-001) y estado activo/inactivo.

**RF-15:** Vincular cada empleado a un Centro de Costos, heredado automáticamente por sus turnos.

**RF-16:** Filtrar y gestionar la malla de turnos por área seleccionada.

**RF-17:** Generar reportes de nómina agrupados por Centro de Costos para análisis contable interno.

##### Módulo 6: Portal del colaborador (Solo lectura)

**RF-18:** El Colaborador autenticado puede visualizar su malla de turnos personal del periodo activo. El sistema filtra todos los resultados por empleadoId del usuario logueado.

**RF-19:** El Colaborador puede ver un resumen de sus horas nocturnas y dominicales acumuladas en el periodo. Estos datos los calcula el motor en el momento del registro del turno; no se recalculan.

**RF-20:** El Colaborador puede consultar el estado de sus novedades registradas (incapacidad, licencia). Sin opción de modificarlas.

---

#### 3. Historias de usuario — Versión 2.0

##### HU-01 — Segmentación cronológica automática

| Campo | Información |
|---|---|
| Número | HU-01 |
| Prioridad / Puntos | Must — 8 pts |
| Usuario | Jefe de Operaciones |
| Descripción | Como jefe de operaciones, quiero que el sistema divida los turnos que cruzan medianoche en segmentos por día calendario, para que los recargos se liquiden sobre la fecha real laborada (Ley 2466). |
| Criterios de aceptación | 1. Turno 22:00 Sáb → 06:00 Dom: Seg A (Sáb, 2h, nocturno 35%) y Seg B (Dom, 6h, nocturno 35% + dominical 80%). 2. Corte exacto a las 00:00:00 UTC-5. 3. Casos bordes: minuto exacto de medianoche. 4. Output: array JSON de segmentos compatible con el generador XML. |

##### HU-02 — Gestión de identidad y prevención de duplicados

| Campo | Información |
|---|---|
| Número | HU-02 |
| Prioridad / Puntos | Must — 3 pts |
| Usuario | Administrador de Nómina |
| Descripción | Como administrador de nómina, quiero validar la unicidad del tipo y número de documento, para evitar duplicados y garantizar identificación válida ante la DIAN. |
| Criterios de aceptación | 1. Desplegable con códigos DIAN (13=CC, 31=NIT). 2. Bloqueo en tiempo real si el par (tipo + número) ya existe. 3. Validación de longitud: CC < 6 dígitos o NIT != 9 dígitos + verificador. 4. Almacenamiento normalizado, solo alfanumérico. |

##### HU-03 — Acceso ágil vía SSO

| Campo | Información |
|---|---|
| Número | HU-03 |
| Prioridad / Puntos | Should — 8 pts |
| Usuario | Todos los usuarios (incluido Colaborador) |
| Descripción | Como usuario de Nomara, quiero iniciar sesión utilizando mi cuenta de Google o Microsoft, para acceder al sistema de forma segura sin gestionar credenciales locales, garantizando que solo veré las funciones permitidas para mi rol. |
| Criterios de aceptación | **Interfaz de login:** Existencia de botones de SSO claramente visibles que redirijan a los proveedores de identidad autorizados (Google/Microsoft). **Mapeo y registro:** Al retornar del SSO, el sistema debe mapear el correo electrónico con un empleado activo en el maestro de Nomara. Si el empleado existe pero no tiene perfil, se debe forzar el completado de datos de identidad (Tipo/Número de documento). **Seguridad del token (JWT):** El sistema debe emitir un token de sesión que expire tras 30 minutos de inactividad. Este token debe almacenarse obligatoriamente en una HttpOnly Cookie con banderas Secure y SameSite=Strict para mitigar ataques XSS y robo de sesión. **Validación de claims (anti-inyección):** El backend debe validar la firma del token en cada petición. El rol del usuario no se tomará del contenido del token enviado por el cliente, sino que se validará contra la base de datos local de Nomara para prevenir la escalación de privilegios manual. **Control de acceso (RBAC):** Si un Colaborador intenta acceder a un endpoint de "Generación de XML" o "Configuración Normativa", el sistema debe retornar un error 403 Forbidden independientemente de si la interfaz oculta o no el botón. **Trazabilidad de acceso:** Cada inicio de sesión exitoso o fallido debe registrarse en el log de auditoría con la IP de origen y el timestamp para cumplir con los estándares de auditoría legal. |

##### HU-04 — Parametrización de vigencias normativas

| Campo | Información |
|---|---|
| Número | HU-04 |
| Prioridad / Puntos | Must — 5 pts |
| Usuario | Administrador de Sistema |
| Descripción | Como administrador de sistema, quiero configurar las vigencias de reglas laborales, para que el motor se adapte a cambios de ley sin tocar el código. |
| Criterios de aceptación | 1. Tabla con: FechaInicio, PctDominical, PctNocturno, Divisor. 2. Prueba: marzo 2026 = divisor 220; julio 2026 = divisor 210. 3. Cambios impactan nuevas liquidaciones de inmediato, sin reiniciar el servidor. |

##### HU-05 — Generación de XML por segmento

| Campo | Información |
|---|---|
| Número | HU-05 |
| Prioridad / Puntos | Must — 8 pts |
| Usuario | Administrador de Nómina |
| Descripción | Como administrador de nómina, quiero generar el XML del Documento Soporte, para cumplir con el Anexo Técnico de la DIAN y deducir costos fiscales. |
| Criterios de aceptación | 1. Genera nodos `<RecargoDN>` y `<HRN>` basados en segmentos calculados. 2. Archivo .xml descargable válido contra el esquema DIAN. 3. Totales con precisión de $0.01 COP. 4. CUNE simulado con SHA-256 reproducible. |

##### HU-06 — Registro de ajustes con trazabilidad

| Campo | Información |
|---|---|
| Número | HU-06 |
| Prioridad / Puntos | Should — 5 pts |
| Usuario | Jefe de RRHH |
| Descripción | Como jefe de RRHH, quiero corregir errores de marcación en la jornada, para que el sistema recalcule y mantenga auditoría limpia ante la UGPP. |
| Criterios de aceptación | 1. Campos monetarios bloqueados (read-only). 2. Recálculo automático al modificar horas. 3. Botón 'Guardar' habilitado solo con justificación mayor a 30 caracteres. 4. Log registra estado antes y después. |

##### HU-07 — Gestión de novedades de ausentismo

| Campo | Información |
|---|---|
| Número | HU-07 |
| Prioridad / Puntos | Must — 5 pts |
| Usuario | Administrador de Nómina |
| Descripción | Como administrador de nómina, quiero registrar incapacidades o licencias, para que el sistema descuente las horas y genere los nodos correspondientes en el XML. |
| Criterios de aceptación | 1. Selección de tipo de novedad y rango de fechas. 2. Anulación automática de turnos en el rango. 3. Pago proporcional según tipo (66.67% enfermedad general). 4. XML incluye `<Incapacidad>` o `<Licencia>`. 5. El Colaborador ve el estado de su novedad en su portal (RF-20). |

##### HU-08 — Trazabilidad de ajustes manuales

| Campo | Información |
|---|---|
| Número | HU-08 |
| Prioridad / Puntos | Should — 5 pts |
| Usuario | Jefe de RRHH |
| Descripción | Como jefe de RRHH, quiero que el sistema genere un log inmutable, para tener respaldo legal ante auditorías de la UGPP. |
| Criterios de aceptación | 1. Registro automático de: ID usuario, timestamp, valor anterior, valor nuevo, motivo. 2. Log en cada uso de Ajuste Manual (HU-06). 3. Consultable solo por roles administrativos. 4. Sin opción de borrado para ningún usuario. |

##### HU-09 — Registro de terminación de contrato

| Campo | Información |
|---|---|
| Número | HU-09 |
| Prioridad / Puntos | Could — 3 pts |
| Usuario | Administrador de Nómina |
| Descripción | Como administrador de nómina, quiero registrar la fecha de retiro de un empleado, para que el sistema lo marque como inactivo y lo reporte en el XML. |
| Criterios de aceptación | 1. Bloquea asignación de turnos posterior a la fecha de retiro. 2. Empleado pasa a estado 'Inactivo'. 3. XML incluye `<FechaRetiro>` según Anexo Técnico DIAN. |

##### HU-10 — Gestión de nómina por Centros de Costos

| Campo | Información |
|---|---|
| Número | HU-10 |
| Prioridad / Puntos | Should — 5 pts |
| Usuario | Jefe de Operaciones / Gerente Administrativo |
| Descripción | Como jefe de operaciones, quiero clasificar empleados por áreas, para gestionar mallas de turnos independientes y analizar costos por departamento. |
| Criterios de aceptación | 1. Crear área con nombre y código único (ej. CC-001). 2. Al registrar un turno, el sistema hereda el Centro de Costos del empleado. 3. La malla de turnos incluye filtro por área. 4. El log de auditoría registra el área del registro al momento de cada modificación. |

##### HU-11 — Portal del Colaborador

| Campo | Información |
|---|---|
| Número | HU-11 |
| Prioridad / Puntos | Could — 3 pts |
| Usuario | Colaborador / Operario |
| Descripción | Como colaborador, quiero ver mis turnos asignados, mis recargos acumulados y el estado de mis novedades, para saber qué pasa con mi trabajo sin tener que preguntar al área de operaciones. |
| Observaciones | Solo lectura. El sistema filtra todo por el ID del usuario autenticado. No añade lógica al motor de cálculo; reutiliza datos ya calculados para los roles administrativos. |
| Criterios de aceptación | 1. El colaborador ve su calendario de turnos (T1–T8) del periodo activo. 2. Ve resumen de horas nocturnas y dominicales acumuladas (datos del motor, no recalculados). 3. Ve estado de sus novedades: registrada / en proceso / cerrada. 4. Ningún campo es editable. No hay botón de guardado ni modificación. |

---

#### 4. Requisitos No Funcionales

| ID | Categoría | Especificación | Justificación |
|---|---|---|---|
| RNF01 | Rendimiento | Motor procesa nómina de hasta 100 empleados en máximo 10 s. | Evita timeouts del servidor en cierre de mes. |
| RNF02 | Usabilidad | Resalta inconsistencias legales en rojo con mensaje normativo en < 1 s. | Reduce carga cognitiva del usuario. |
| RNF03 | Seguridad | AES-256 en reposo, HTTPS/TLS 1.3 en tránsito. Colaborador accede solo a sus propios datos (filtro por userId en RF-18 a RF-20). | Ley 1581 (Habeas Data). El Colaborador no puede ver datos de otros empleados. |
| RNF04 | Compatibilidad | 100% funcional en Chrome y Edge actuales (escritorio). | Navegadores estándar en áreas contables colombianas. |
| RNF05 | Exactitud | Precisión mínima 2 decimales; error < $0.01 COP por trabajador. | Reglas de redondeo del Anexo Técnico DIAN (Res. 000013). |

---

#### 5. Análisis y Priorización

##### 5A. Análisis de Requisitos

**Ambigüedad 1: tasa progresiva dominical en periodos de transición (RF-06)**

Pregunta: ¿Cómo maneja el sistema un periodo de nómina que abarca el 15 de julio de 2026, donde la primera parte aplica 80% y la segunda 90%?

Resolución: el sistema divide el periodo en subperiodos según la tabla de vigencias. Un mes con el 15 de julio se procesa en dos bloques: días 1–14 al 80% y días 15–31 al 90%. Los totales se suman antes de generar el XML.

**Ambigüedad 2: sin el Colaborador, el sistema era un buzón ciego**

En el taller 1, ningún trabajador podía saber a qué hora entraba mañana. Nomara era una herramienta de back-office puro: útil para quien liquida, invisible para quien trabaja. En sectores 7x24 eso genera un flujo constante de consultas operativas que el sistema podría evitar.

Resolución: se define el perfil Colaborador con permisos estrictamente de solo lectura. El trabajador se autentica (HU-03), ve su malla, sus recargos acumulados y sus novedades. No puede tocar ningún cálculo. Esto tiene peso legal también: demuestra ante la UGPP que la empresa comunica formalmente las jornadas asignadas.

**Factibilidad del módulo más complejo: HU-01 / RF-04**

El motor de segmentación es viable con librerías de fechas que dominan zonas horarias y cortes a medianoche. Se construye como función pura: mismo input, mismo output, testeable sin base de datos. El Golden Dataset de 10 casos (T1–T8 más dos casos bordes) se define antes de escribir código de producción.

El Portal del Colaborador (HU-11) no añade carga al motor. Reutiliza datos ya calculados para los roles administrativos. La única complejidad nueva es el filtro por userId en las consultas SQL, que David ya tiene previsto con el atributo rol en la clase Empleado.

**Coexistencia de requisitos**

Los 20 RF coexisten bajo una sola regla: los resultados monetarios son calculados por el motor y nunca editables directamente. El jefe de operaciones escribe la malla; el Colaborador la lee. Ambos acceden al mismo dato, desde roles completamente distintos.

##### 5B. Priorización MoSCoW

| Prioridad | Historias de Usuario | Justificación |
|---|---|---|
| Must | HU-01, HU-02, HU-04, HU-05, HU-07 | Sin segmentación, identidad, vigencias, XML y ausentismo, el sistema no cumple su propósito ante la DIAN. |
| Should | HU-03, HU-06, HU-08, HU-10 | Confiabilidad y organización. Los logs son el diferenciador ético de Nomara. Los centros de costos lo hacen viable en hospitales. El SSO aplica ahora también al Colaborador. |
| Could | HU-09, HU-11 | HU-09: mejora la completitud del XML. HU-11 (Portal Colaborador): aporta valor real en sectores 7x24, pero requiere que el motor ya funcione. No bloquea el MVP. |
| Won't | Envío automático a la DIAN | Requiere habilitación formal con firma digital real. Fuera del alcance académico. |

---

#### 6. Kanban — Backlog en Trello

HU-01 a HU-11 creadas como tarjetas con etiquetas MoSCoW y criterios de aceptación como checklists. HU-10 y HU-11 son nuevas en esta versión. HU-11 tiene etiqueta 'Could'. (Ivan verificar que todo coincida por favor)

https://trello.com/invite/b/699e4879afd7f2ad65e28160/ATTIf0b344cc2651773ce1fc26780ed3892670DFAA16/proyecto-construccion-de-software

---

### PARTE II: DISEÑO DEL PROYECTO

#### 1. Modelo de dominio

##### 1.1 Conceptos clave

| Concepto | Descripción |
|---|---|
| Empleado | Persona natural vinculada por contrato. Unidad base del cálculo. Identificada por tipo y número de documento DIAN. Pertenece a un CentroDeCostos. Tiene un Rol que determina qué partes del sistema puede usar. |
| CentroDeCostos | Unidad organizativa (UCI, Vigilancia, Almacén). Agrupa empleados y mallas de turno para segregar reportes y gestionar dependencias de forma independiente. |
| Turno | Intervalo temporal programado para un empleado, en UTC-5. Puede cruzar medianoche. Hereda el CentroDeCostos del empleado en el momento del registro. |
| Segmento | Fracción de un Turno resultante del corte a medianoche. Unidad mínima de cálculo. Tiene fecha, tipo de hora y horas decimales. |
| VigenciaNormativa | Reglas legales vigentes por periodo: divisor, porcentaje nocturno, porcentaje dominical. El motor hace un lookup a esta tabla en cada cálculo. |
| Liquidacion | Resultado del procesamiento de todos los segmentos de un empleado en un periodo. Estados: borrador → aprobada. |
| DocumentoXML | Artefacto fiscal generado desde la Liquidación. Cumple Res. 000013 DIAN. Contiene CUNE y puede reemplazarse con Nota de Ajuste. |
| LogAuditoria | Registro append-only de cada modificación. Incluye usuario, timestamp, valores antes/después y justificación. Sin DELETE ni UPDATE. |

##### 1.2 Abstracción del Flujo Principal — HU-01

1. El jefe de Operaciones registra un Turno para un Empleado en su CentroDeCostos (22:00 Sáb → 06:00 Dom).
2. El motor divide el Turno a las 00:00:00 UTC-5: Seg A (Sáb, 2h) y Seg B (Dom, 6h).
3. El motor consulta la VigenciaNormativa activa: divisor 220, nocturno 35%, dominical 80%.
4. Aplica recargos a cada Segmento y consolida los valores en la Liquidación mensual.
5. Con la Liquidación aprobada, genera el DocumentoXML con nodos `<RecargoDN>` y `<HRN>`, CUNE y totales con precisión de $0.01 COP.
6. El Colaborador puede ver en su portal cuántas horas nocturnas y dominicales acumuló, sin acceder a los datos del resto del equipo.

---

#### 2. Diagrama de casos de uso

##### 2.1 Actores identificados

| Actor | Rol | Descripción |
|---|---|---|
| Administrador de Nómina | Usuario principal | Gestiona empleados, registra jornadas y novedades, genera XML. |
| Jefe de Operaciones | Usuario operativo | Programa mallas de turnos por Centro de Costos y corrige marcaciones. |
| Administrador de Sistema | Usuario técnico | Parametriza vigencias normativas y gestiona roles de usuario. |
| Colaborador / Operario | Usuario de consulta | Visualiza su malla personal, sus recargos acumulados y el estado de sus novedades. Solo lectura; no puede modificar ningún dato. |
| Sistema DIAN | Actor externo | Receptor del XML. En el MVP el archivo se descarga manualmente. |

##### 2.2 Diagrama de casos de uso

Ver archivo adjunto: diagrama_casos_uso.xml (draw.io)

12 casos de uso dentro del límite del sistema:

- UC-01: Registrar / Actualizar Empleado
- UC-02: Registrar Jornada / Turno
- UC-03: Segmentar Turno Automáticamente (extend de UC-02)
- UC-04: Liquidar Recargos
- UC-05: Registrar Novedad de Ausentismo
- UC-06: Generar XML de Nómina
- UC-07: Corregir Marcación con Log de Auditoría
- UC-08: Parametrizar Vigencias Normativas
- UC-09: Gestionar Centros de Costos y Filtrar Malla por Área
- UC-10: Visualizar Malla Personal [Colaborador — solo lectura]
- UC-11: Consultar Resumen de Recargos Acumulados [Colaborador — solo lectura]
- UC-12: Consultar Estado de Novedades [Colaborador — solo lectura]

---

#### 3. Diagrama de Clases

Ver archivo adjunto: diagrama_clases.xml (draw.io)

##### 3.1 Clases del Sistema

| Clase | Atributos principales | Métodos principales | Relaciones UML |
|---|---|---|---|
| CentroDeCostos | -codigoCC: String -nombreArea: String -estado: EstadoEnum | +crear(): void +editar(): void +desactivar(): void | 1 CC → * Empleado (Asociación 1:N) |
| Empleado | -id: UUID -tipoDoc: String -numDoc: String -nombre: String -sueldoBase: Decimal -estado: EstadoEnum -centroCostosId: UUID -rol: RolEnum | +registrar(): void +actualizar(): void +desactivar(): void +validarDocumento(): Boolean | 1 Empleado → * Turno (Composición) 1 Empleado → * Liquidacion |
| Turno | -id: UUID -empleadoId: UUID -centroCostosId: UUID -horaEntrada: DateTime -horaSalida: DateTime -estado: TurnoEstadoEnum | +registrar(): void +segmentar(): Segmento[] +validarSolapamiento(): Boolean | * Turno → 1 Empleado 1 Turno → * Segmento (Composición) |
| Segmento | -id: UUID -turnoId: UUID -fecha: Date -tipoHora: TipoHoraEnum -horas: Decimal -recargoAplicado: Decimal | +calcularRecargo(v: VigenciaNormativa): Decimal +getTipoHora(f: Date): TipoHoraEnum | * Segmento → 1 Turno * Segmento usa 1 VigenciaNormativa |
| VigenciaNormativa | -id: UUID -fechaInicio: Date -divisor: Integer -pctNocturno: Decimal -pctDominical: Decimal | +getActiva(fecha: Date): VigenciaNormativa +calcularValorHora(salario: Decimal): Decimal | 1 VigenciaNormativa aplica a * Segmento |
| Liquidacion | -id: UUID -empleadoId: UUID -periodo: String -totalDevengado: Decimal -totalDeducciones: Decimal -estado: LiqEstadoEnum | +calcularTotales(): void +aprobar(): void +rechazar(): void | * Liquidacion → 1 Empleado 1 Liquidacion → 1 DocumentoXML |
| DocumentoXML | -id: UUID -liquidacionId: UUID -cune: String -xmlContent: Text -estadoDIAN: DIANEstadoEnum -fechaGen: DateTime | +generar(): String +descargar(): File +generarNotaAjuste(): DocumentoXML +validarEsquema(): Boolean | 1 DocumentoXML → 1 Liquidacion |
| LogAuditoria | -id: UUID -entidadTipo: String -entidadId: UUID -usuarioId: UUID -timestamp: DateTime -valorAntes: JSON -valorDespues: JSON -justificacion: String | +registrar(evento: AuditoriaEvent): void +consultar(filtros: FiltroDTO): Log[] | Append-only. Ninguna clase puede llamar update() o delete() sobre esta entidad. |

##### 3.2 Atributo rol en Empleado

La clase Empleado incluye `-rol: RolEnum` con valores ADMIN_NOMINA, JEFE_OPERACIONES, ADMIN_SISTEMA y COLABORADOR. El sistema lee este atributo en cada request para decidir qué endpoints son accesibles. El Colaborador solo puede llamar los endpoints de RF-18, RF-19 y RF-20, que filtran todos los resultados por empleadoId = usuarioAutenticado.id. No hay forma de que un Colaborador vea los datos de otro.

##### 3.3 Patrón de Diseño: Strategy

El patrón Strategy se aplica en el motor de liquidación. No fue una elección estética. Es la respuesta directa a un problema del dominio: el porcentaje de recargo dominical cambia de 80% a 90% el 15 de julio de 2026, y puede cambiar de nuevo si el Congreso lo decide.

Si ese número está escrito en el código, cada cambio legal requiere modificar el repositorio, correr pruebas y redesplegar. En un sistema de cumplimiento eso no es opción.

- **Clase contexto:** MotorLiquidacion. Ejecuta el cálculo pero no sabe qué tasas aplicar; recibe una VigenciaNormativa como parámetro.
- **Interfaz de estrategia:** VigenciaNormativa. Define el contrato: divisor, pctNocturno, pctDominical para un rango de fechas.
- **Estrategias concretas en BD:** `{FechaInicio: 2026-01-01, Divisor: 220, PctNocturno: 35, PctDominical: 80}` y `{FechaInicio: 2026-07-15, Divisor: 210, PctNocturno: 35, PctDominical: 90}`.
- **Selección en runtime:** VigenciaNormativa.getActiva(fecha) hace una consulta SQL (`WHERE fecha_inicio <= :fecha ORDER BY fecha_inicio DESC LIMIT 1`) y devuelve la fila correcta. No hay if-else en el código de producción.

Cuando salga una ley nueva, el administrador añade una fila a la tabla. El código no cambia. El patrón también simplifica las pruebas: para testear el motor con las tasas de julio 2026 basta pasar un objeto VigenciaNormativa con divisor=210 y pctDominical=90, sin necesitar base de datos.

La asociación '* Segmento usa 1 VigenciaNormativa' en el diagrama de clases es la representación UML de este patrón. El método `calcularRecargo(v: VigenciaNormativa)` recibe la estrategia por inyección de dependencia.

---

#### 4. Diagrama de Secuencia

Ver archivo adjunto: diagrama_secuencia.xml (draw.io)

**Caso:** UC-02 / HU-01 — Turno T8 (22:00 Sáb → 06:00 Dom).

| Paso | Origen | Destino | Mensaje / Acción |
|---|---|---|---|
| 1 | Jefe Operaciones | UI | ingresarTurno(empId, '2026-06-07 22:00', '2026-06-08 06:00') |
| 2 | UI | TurnoController | POST /api/turnos {empleadoId, horaEntrada, horaSalida} |
| 3 | TurnoController | Turno | new Turno(datos) — valida solapamiento |
| 4 | Turno | MotorSegmentacion | segmentar(horaEntrada, horaSalida) |
| 5 | MotorSegmentacion | VigenciaNormativa | getActiva(fecha: '2026-06-07') |
| 6 | VigenciaNormativa | MotorSegmentacion | return {divisor: 220, pctNocturno: 35, pctDominical: 80} |
| 7 | MotorSegmentacion | MotorSegmentacion | corteAMedianoche() → genera SegA y SegB |
| 8 | MotorSegmentacion | Segmento A | new Segmento(Sáb, 2h) + calcularRecargo() → nocturno 35% |
| 9 | MotorSegmentacion | Segmento B | new Segmento(Dom, 6h) + calcularRecargo() → nocturno 35% + dominical 80% |
| 10 | MotorSegmentacion | Turno | return [SegA, SegB] con valores calculados |
| 11 | TurnoController | LogAuditoria | registrar(CREATE, turnoId, userId, timestamp, 'Registro inicial') |
| 12 | TurnoController | UI | return 201 Created {id, segmentos: [SegA, SegB]} |
| 13 | UI | Jefe Operaciones | Muestra: 2h sábado + 6h domingo con recargos detallados |

---

#### 5. Diagrama de Actividad

Ver archivo adjunto: diagrama_actividad.xml (draw.io)

**Proceso:** liquidación mensual completa con corrección de marcación.

**Swimlanes:**
- Carril 1 — Coordinador de Área / Jefe de RRHH: ingresa y corrige turnos.
- Carril 2 — Sistema / Motor de Cálculo: segmenta, consulta vigencias, calcula recargos, genera XML.
- Carril 3 — Jefe de Nómina: revisa, aprueba y descarga el XML.

**Secuencia de actividades:**

- Inicio → [Coordinador] Ingresa turnos del periodo por Centro de Costos
- [Sistema] Valida solapamiento → [¿Válido?] → No: alerta → Fin parcial
- Sí: [Sistema] Segmenta cronológicamente → Consulta VigenciaNormativa
- [Sistema] Calcula recargos → [¿Hay error de marcación?]
- Sí: [Coordinador / RRHH] Corrige + justificación → [Sistema] Recalcula + registra en LogAuditoria → vuelve
- No: [Sistema] Consolida Liquidación → [Jefe Nómina] Revisa y aprueba
- [¿Aprobada?] → No: regresa → Sí: [Sistema] Genera XML → [Jefe Nómina] Descarga → Fin

---

#### Distribución de Responsabilidades

| Integrante | Responsabilidad | Entregables Taller 2 |
|---|---|---|
| Joan Michael Murillo (Líder) | Reglas de negocio, integración del actor Colaborador, redacción Parte I, ensamblado del documento. | Parte I, Modelo de Dominio, tabla de secuencia, documento Word final. |
| David Alvarez (Modelado Estructural) | UML estructural: 8 clases con CentroDeCostos y atributo rol en Empleado. | Diagrama de Clases (draw.io). Diagrama de Secuencia (draw.io). |
| Ivan Velasco (Gestión y Dinámica) | Flujos de proceso con 3 swimlanes. Casos de uso incluyendo UC-10, UC-11, UC-12. Trello con HU-11 etiqueta 'Could'. | Diagrama de Casos de Uso (draw.io). Diagrama de Actividad (draw.io). Trello actualizado. |

---

#### Marco Normativo y Referencias

- **Resolución 000013 de 2021 (DIAN):** reglamentación del soporte de pago de nómina electrónica.
- **Resolución 000004 de 2026 (DIAN):** actualizaciones en protocolos de transmisión.
- **Ley 2466 de 2025:** recargos nocturnos desde las 19:00 h.
- **Ley 2101 de 2021:** cálculo dinámico del divisor de jornada.
- **Anexo Técnico de Nómina Electrónica v1.1 (DIAN):** nodos XML y reglas de validación aritmética.
- **CS - Taller 2.pdf:** guía de entregables.

---

## 5. Taller 1 — Definición de Requisitos del Proyecto (Taller1_Construccion_de_software.pdf)

# DEFINICIÓN DE REQUISITOS DEL PROYECTO

**Proyecto:** Nomara  
**Versión:** 1.0  
**Fecha:** marzo 2026  

**Elaborado por:**  
Ivan Velasco  
David Alvarez  
Joan Michael Murillo  

**Construcción de software**  
**Universidad Antonio Nariño**

---

### 1. Definición del contexto: el quién y el porqué

#### 1.1 ¿Cuál es el nombre de tu proyecto?

- Nomara (Compliance engine para nómina electrónica).

#### 1.2 ¿Quién será el usuario principal?

- Pequeñas y medianas empresas (Pymes) colombianas de entre 5 y 200 empleados que operan con mallas de turnos rotativos (sectores de salud, seguridad, retail y servicios).

Las PYMES con turnos rotativos en Colombia dependen de hojas de Excel manuales que hoy son incapaces de procesar la complejidad de la Reforma Laboral 2026. El cálculo manual de recargos (ahora desde las 7:00 p.m.) y el cambio dinámico del divisor de jornada (Ley 2101) generan errores aritméticos constantes. La herramienta gratuita de la DIAN no soluciona esto, ya que solo actúa como un buzón: recibe el dato, pero no lo calcula.

**Problema:** Las Pymes enfrentan una "tormenta perfecta" en 2026: la complejidad de la Reforma laboral (ley 2466) y la reducción de la jornada (ley 2101) hacen que el cálculo manual en Excel sea matemáticamente inviable y propenso a errores costosos. La herramienta gratuita de la DIAN actúa solo como un buzón receptor; no realiza cálculos, dejando al empresario solo frente al riesgo de sanciones de la UGPP por pagos insuficientes o el rechazo de costos ante la DIAN por errores de redondeo.

**Necesidad:** El mercado requiere un motor de liquidación infalible que cierre la brecha entre la programación operativa (quién trabajó y cuándo) y el reporte legal (XML).

**Solución MVP** Nomara no busca ser un software de RRHH genérico, sino un motor especializado de cumplimiento. El MVP se centra en automatizar la segmentación inteligente de horas (especialmente turnos que cruzan medianoche y festivos) y la generación del XML con trazabilidad de auditoría. Su arquitectura modular permite que este "corazón de cálculo" sea preciso, auditable y escalable, eliminando la incertidumbre legal del empresario con un margen de error de cero pesos.

---

### 2. Requisitos funcionales (El "qué" hará nuestra aplicación)

Para mis compañeros desarrolladores recuerden que cada "permite al usuario" implica un endpoint o una función lógica en el backend. Hemos desglosado la complejidad del motor para que sea modular.

#### Módulo 1: Configuración normativa (el motor de reglas)

**RF-01:**  
El sistema debe permitir al administrador parametrizar las vigencias legales (horas semanales de jornada, divisor mensual y porcentajes de recargo), asegurando que el motor de cálculo sea dinámico ante cambios en la Ley 2101 o Ley 2466.

**RF-02:**  
El sistema debe permitir al usuario gestionar el maestro de empleados (CRUD), capturando datos críticos para la DIAN como tipo de contrato, sueldo base y fecha de ingreso.

#### Módulo 2: Gestión de operación y turnos

**RF-03:**  
El sistema debe permitir al usuario registrar jornadas laborales mediante hora de entrada y salida, con soporte explícito para turnos que crucen la medianoche.

**RF-04:**  
El sistema debe realizar automáticamente la segmentación cronológica de horas, dividiendo un turno en segmentos por día calendario para aplicar recargos diferenciados (ejemplo: sábado noche vs. domingo madrugada).

#### Módulo 3: Motor de liquidación (business logic)

**RF-05:**  
El sistema debe permitir al usuario liquidar recargos nocturnos aplicando automáticamente el 35% a partir de las 19:00 horas, según la vigencia de la Ley 2466 de 2025.

**RF-06:**  
El sistema debe permitir al usuario calcular recargos dominicales y festivos aplicando la tasa progresiva correspondiente (80% o 90%) basada en la fecha del segmento laboral.

**RF-07:**  
El sistema debe permitir al usuario determinar el valor de la hora ordinaria utilizando el divisor dinámico configurado, evitando errores de cálculo por la reducción de la jornada laboral.

#### Módulo 4: Cumplimiento Fiscal y Auditoría

**RF-08:**  
El sistema debe permitir al usuario generar el archivo XML de nómina electrónica cumpliendo con el estándar CUNE y los esquemas de validación del anexo técnico de la DIAN.

**RF-09:**  
El sistema debe permitir al usuario crear notas de ajuste de tipo "reemplazar", facilitando la corrección de errores en liquidaciones previas con plena validez fiscal.

**RF-10:**  
Auditoría de modificaciones operativas:

El sistema debe generar un log de auditoría inmutable cada vez que se modifique un registro de jornada (horas de entrada/salida) o se ingrese una novedad. El registro debe almacenar: los valores originales, los nuevos valores recalculados automáticamente, el ID del usuario, el timestamp y la justificación obligatoria. Este log garantiza la trazabilidad exigida por la UGPP y sustenta la integridad de las notas de ajuste ante la DIAN.

**RF-11:**  
El sistema debe permitir al usuario registrar novedades de ausentismo (incapacidades y licencias), descontando automáticamente las horas de la jornada programada y calculando el IBC proporcional.

**RF-13:**  
El sistema debe permitir al usuario registrar la terminación de contrato, inhabilitando al empleado para futuras mallas de turnos y reportando la fecha de retiro en el XML.

---

### 3. Historias de usuario

#### HU-01

| Campo | Información |
|---|---|
| Número (#) | HU-01 |
| Nombre | Segmentación cronológica automática (Must) |
| Usuario | Jefe de operaciones |
| Prioridad | Must (crítico) |
| Puntos estimados | 8 (Alta complejidad lógica) |
| Descripción | Como jefe de operaciones, quiero que el sistema divida automáticamente los turnos que cruzan la medianoche en segmentos por día calendario, para que los recargos nocturnos y dominicales se liquiden correctamente sobre la fecha real laborada (Ley 2466). |
| Observaciones | Esta funcionalidad constituye el núcleo del motor de cálculo del sistema. Por esta razón, los desarrolladores deberán implementar una lógica que permita dividir correctamente los intervalos de tiempo cuando un turno atraviesa diferentes días o condiciones laborales. De esta manera se evita que los recargos correspondientes a un día se arrastren o se asignen incorrectamente al día siguiente, garantizando así la precisión en los cálculos de nómina. |
| Criterios de aceptación | 1. Dado un turno 22:00 (Sáb) a 06:00 (Dom), el sistema genera dos segmentos: sábado (2h) y Domingo (6h). 2. El recargo dominical (80%) se aplica exclusivamente al segmento del domingo. 3. Manejo de casos borde: turnos de 1 minuto antes/después de medianoche. 4. Output: Estructura JSON/Objeto compatible con el generador de XML. |

#### HU-02

| Campo | Información |
|---|---|
| Número (#) | HU-02 |
| Nombre | Gestión de identidad y prevención de duplicados (Must) |
| Usuario | Administrador de nómina |
| Prioridad | Must (crítico) |
| Puntos estimados | 3 (Validación estándar) |
| Descripción | Como administrador de nómina, quiero validar la unicidad del tipo y número de documento durante el registro, para evitar duplicados y garantizar una identificación válida ante la DIAN (CUNE y reportes). |
| Observaciones | El índice único en la base de datos debe ser compuesto: tipo_doc + num_doc. Normalizar quitando puntos y guiones antes de persistir. |
| Criterios de aceptación | 1. Desplegable con códigos DIAN (13=CC, 31=NIT, etc.). 2. Bloqueo en tiempo real si el par (Tipo+Número) ya existe en la BD. 3. Validación de longitud: Alerta si CC < 6 dígitos o NIT != 9 dígitos + verif. 4. Almacenamiento normalizado (solo caracteres alfanuméricos). |

#### HU-03

| Campo | Información |
|---|---|
| Número (#) | HU-03 |
| Nombre | Acceso Ágil vía SSO (Should) |
| Usuario | Usuario Administrativo |
| Prioridad | Should (Debería) |
| Puntos estimados | 5 (Integración OAuth2) |
| Descripción | Como usuario administrativo, quiero iniciar sesión con mi cuenta de Google o Microsoft, para acceder rápidamente sin gestionar credenciales adicionales. |
| Observaciones | Requiere configuración de proveedores en la nube. Si el usuario es nuevo, el flujo debe forzar el "Completar Perfil" (ID de documento). |
| Criterios de aceptación | 1. Botones de SSO visibles en Login. 2. Mapeo automático de correo electrónico. 3. Redirección obligatoria a formulario de identidad si el documento no está registrado. 4. Expiración de token tras 30 minutos de inactividad. |

#### HU-04

| Campo | Información |
|---|---|
| Número (#) | HU-04 |
| Nombre | Parametrización de vigencias normativas (Must) |
| Usuario | Administrador de sistema |
| Prioridad | Must (crítico) |
| Puntos estimados | 5 (Diseño de base de datos) |
| Descripción | Como administrador de sistema, quiero configurar las vigencias de las reglas laborales (divisor jornada y porcentajes), para que el motor de cálculo se adapte automáticamente a los cambios de ley sin modificar el código. |
| Observaciones | ¡No hardcoding! El motor debe hacer un "lookup" a una tabla de vigencias filtrando por la fecha_de_proceso. |
| Criterios de aceptación | 1. Tabla configurable con: FechaInicio, PorcentajeRecargo, Divisor. 2. Prueba de cálculo: marzo 2026 aplica divisor 220; Julio 2026 aplica divisor 210. 3. Los cambios en la tabla impactan inmediatamente nuevas liquidaciones sin reiniciar el servidor. |

#### HU-05

| Campo | Información |
|---|---|
| Número (#) | HU-05 |
| Nombre | Generación de XML Básico por Segmento (Must) |
| Usuario | Administrador de Nómina |
| Prioridad | Must (Crítico) |
| Puntos estimados | 8 (Esquema XML estricto) |
| Descripción | Como administrador de nómina, quiero generar el archivo XML del Documento Soporte, para cumplir con el anexo técnico de la DIAN y permitir la deducción de costos fiscales. |
| Observaciones | Se usará un hash básico para simular el CUNE en el MVP. La estructura debe seguir fielmente la Resolución 000013. |
| Criterios de aceptación | 1. Generación de nodos `<RecargoDN>` y `<HRN>` basados en los segmentos calculados. 2. El archivo descargable debe ser un .xml válido. 3. Inclusión de totales calculados con precisión de $0.01 COP. |

#### HU-06

| Campo | Información |
|---|---|
| Número (#) | HU-06 |
| Nombre | Registro de ajustes con trazabilidad (Should) |
| Usuario | Jefe de RRHH |
| Prioridad | Should (Debería) |
| Puntos estimados | 5 (Lógica de auditoría y UI reactiva) |
| Descripción | Como jefe de RRHH, quiero corregir errores de marcación en la jornada laboral, para que el sistema recalcule automáticamente los valores legales y mantenga una auditoría ética ante la UGPP. |
| Observaciones | El sistema protege la integridad legal bloqueando la edición directa de los valores monetarios. La corrección se realiza sobre el "Dato Origen" (Horas), no sobre el "Resultado" (Pesos). |
| Criterios de aceptación | 1. Interfaz blindada: los campos de porcentaje y valor total de recargos deben aparecer sombreados (read-only). 2. Recálculo automático: al modificar la hora de entrada o salida, el sistema debe ejecutar el motor de segmentación (HU-01) y actualizar los valores en tiempo real. 3. Justificación obligatoria: el botón "Guardar" solo se habilitará tras ingresar una justificación mayor a 30 caracteres. 4. Persistencia del log: el sistema debe registrar en la tabla de auditoría el estado "Antes" y "Después" de la liquidación, vinculando el usuario que autorizó el cambio. |

#### HU-07

| Campo | Información |
|---|---|
| Número (#) | HU-07 |
| Nombre | Gestión de novedades de ausentismo (Must) |
| Usuario | Administrador de nómina |
| Prioridad | Must (Crítico) |
| Puntos estimados | 5 (Media complejidad) |
| Descripción | Como administrador de nómina, quiero registrar novedades de incapacidades o licencias, para que el sistema reste automáticamente las horas de la jornada y genere el nodo `<Incapacidad>` o `<Licencia>` en el XML. |
| Observaciones | Crucial para cumplir con la Resolución 000013. El motor de cálculo debe ignorar los turnos programados en los días de la novedad para no duplicar el pago. |
| Criterios de aceptación | 1. El usuario selecciona el tipo de novedad y el rango de fechas. 2. El sistema anula automáticamente los turnos programados en ese rango. 3. El sistema calcula el pago de la novedad (ejemplo: 66.67% para enfermedad general) conforme a ley. 4. El XML generado incluye los nodos correspondientes de novedades. |

#### HU-08

| Campo | Información |
|---|---|
| Número (#) | HU-08 |
| Nombre | Trazabilidad de ajustes manuales (Should) |
| Usuario | Jefe de RRHH |
| Prioridad | Should (Importante) |
| Puntos estimados | 5 (Implementación de Logs) |
| Descripción | Como jefe de RRHH, quiero que el sistema genere un log inmutable, para tener un respaldo ético y legal ante auditorías de la UGPP sobre cambios manuales en la nómina. |
| Observaciones | El log no debe ser borrable por ningún usuario. Es la esencia de (Nomara). |
| Criterios de aceptación | 1. Registro automático de: ID Usuario, Timestamp, Valor Anterior, Valor Nuevo y Motivo. 2. El log se genera cada vez que se usa la funcionalidad de "Ajuste Manual" (HU-06). 3. El reporte de auditoría es consultable solo por roles administrativos. |

#### HU-09

| Campo | Información |
|---|---|
| Número (#) | HU-09 |
| Nombre | Registro de terminación de contrato (Could) |
| Usuario | Administrador de nómina |
| Prioridad | Could (Deseable para MVP) |
| Puntos estimados | 3 (Versión simplificada) |
| Descripción | Como administrador de nómina, quiero registrar la fecha de retiro de un empleado, para que el sistema lo marque como inactivo y lo reporte correctamente en el XML de fin de mes. |
| Observaciones | Para el MVP, el cálculo de liquidación final de prestaciones será manual; el sistema solo se encarga del bloqueo operativo y reporte de fecha de retiro. |
| Criterios de aceptación | 1. Al ingresar fecha de retiro, el sistema bloquea la asignación de turnos posterior a esa fecha. 2. El empleado cambia a estado "Inactivo" en el maestro. 3. El XML generado incluye el campo `<FechaRetiro>` según el Anexo Técnico de la DIAN. |

---

### 4. Requisitos no funcionales (El "cómo" será Nomara)

Para garantizar la calidad, seguridad y exactitud de Nomara, se establecen los siguientes criterios técnicos:

| ID | Categoría | Especificación del Requisito | Justificación Técnica y Normativa |
|---|---|---|---|
| RNF-01 | Rendimiento | El motor de cálculo debe procesar la segmentación y liquidación de una nómina masiva (hasta 100 empleados) en un tiempo máximo de 10 segundos. | Optimización para entornos web evitando timeouts en el servidor durante el cierre de mes. |
| RNF-02 | Usabilidad | El sistema debe resaltar en color rojo inconsistencias legales y mostrar un mensaje normativo claro (ejemplo: "Excede 2 horas extras diarias – CST Art. 161") en menos de 1 segundo tras la entrada del dato. | Transforma el sistema en un asistente de cumplimiento (Compliance Assistant), reduciendo la carga cognitiva del usuario. |
| RNF-03 | Seguridad | Los datos sensibles (documentos y salarios) deben estar protegidos mediante cifrado AES-256 en reposo y protocolos HTTPS/TLS 1.3 en tránsito. | Garantiza la confidencialidad total de la información y cumple con la Ley 1581 (Habeas Data) en entornos SaaS. |
| RNF-04 | Compatibilidad | La aplicación debe ser 100% funcional y visualmente consistente en las versiones actuales de Google Chrome y Microsoft Edge para escritorio. | Asegura la operatividad en los navegadores estándar utilizados por las áreas contables y administrativas en Colombia. |
| RNF-05 | Exactitud | El sistema debe manejar una precisión de al menos dos decimales en campos monetarios, con un error absoluto inferior a $0.01 COP en el total devengado por trabajador. | Alineación crítica con las reglas de redondeo del Anexo técnico de la DIAN (Resolución 000013) para evitar rechazos del XML. |

---

### 5. Análisis y priorización

#### Parte A: Análisis de requisitos

##### 1. Ambigüedad (identificación y clarificación)

**Ambigüedad**

**Requisito seleccionado: HU-01** (Corte automático de turnos a medianoche).

La pregunta que nos hicimos: *"Si un empleado termina su turno justo a las 12:00 AM, ¿esas horas cuentan para el día que termina o para el que empieza? ¿Cómo evitamos que el sistema se confunda y cobre dos veces el mismo minuto?"*

**Definición mejorada:** El sistema hará un corte "quirúrgico" a las **12:00:00 AM**. Todo lo que pase de ese segundo pertenece al nuevo día. Para que no haya errores, el software siempre usará la hora legal de Colombia (UTC-5), así nos aseguramos de que el pago sea exacto y que no se pierda ni un segundo de trabajo en el cálculo.

**Factibilidad (El reto más difícil)**

**Requisito más complejo: HU-01 / RF-04** (El motor que divide y calcula los turnos).

**¿Es realista? (Honestidad):** Siendo sinceros, es un reto grande para nosotros y el corto tiempo que tenemos también porque la ley colombiana es enredada. Sin embargo, **es totalmente posible**. Nuestra ventaja es que no estamos empezando de cero vamos a usar librerías de programación ya probadas para manejar tiempos y nos apoyaremos en herramientas de **Inteligencia Artificial** para acelerar las partes más tediosas del código. Al diseñar el sistema por "piezas" (módulos), podemos probar el motor de cálculo solo, sin esperar a tener toda la página web lista.

**Factibilidad (Coexistencia)**

**¿Todos pueden convivir?** Sí, pero pusimos una regla de oro: **La ley manda sobre el usuario**. Detectamos que si dejábamos que el usuario cambiara los valores a su antojo, el sistema dejaría de ser confiable. Por eso, decidimos que los cálculos de dinero no se pueden editar a mano (están en gris): el usuario puede actualizar el salario base del empleado o corregir las horas trabajadas, pero Nomara siempre aplicará la matemática legal automáticamente. Así, la libertad del usuario y la rigurosidad de la ley conviven sin estrellarse.

#### Parte B: Priorización con MoSCoW

Para que **Nomara** sea un éxito en mayo, hemos clasificado nuestras tareas así:

| Prioridad | Historias de usuario | ¿Por qué es así? |
|---|---|---|
| Must (Obligatorio) | HU-01, HU-02, HU-04, HU-05, HU-07 | **Es la base.** Sin el cálculo de turnos, el sueldo real, las leyes vigentes y el archivo XML, el proyecto no le sirve al empresario ante la DIAN. |
| Should (Importante) | HU-03 (SSO), HU-06/08 (Ajustes y Logs) | **Dan orden.** Queremos que entrar al sistema sea fácil y que cada cambio deje una huella por si llega una auditoría, pero el cálculo central funciona sin esto. |
| Could (Si hay tiempo) | HU-09 (Fecha de Retiro) | **Es un extra.** Nos gustaría marcar cuándo se va un empleado, pero por ahora se puede manejar por fuera si el tiempo nos aprieta. |
| Won't (No por ahora) | Envío automático a la DIAN | **Fuera de alcance.** Hacer el trámite de firma digital real y la conexión directa con la DIAN es demasiado complejo para el tiempo contemplado. |

---

### 7. Anexos y marco de referencia

Este proyecto ha sido construido bajo un marco de "diseño basado en normativa", consultando fuentes oficiales y guías técnicas para asegurar que el motor de Nomara sea legalmente infalible.

#### 7.1 Marco normativo y legal (Fuentes de la verdad)

Son los documentos que dictan las reglas del juego para el cálculo y reporte:

- **Resolución 000013 de 2021 (DIAN):** Documento base que reglamenta el soporte de pago de nómina electrónica en Colombia.  
  https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000013%20de%2011-02-2021.pdf

- **Anexo técnico de nómina electrónica (v. 1.1):** Guía técnica para la estructuración de los nodos XML y reglas de validación aritmética.  
  https://www.dian.gov.co/impuestos/Paginas/Sistema-de-FacturaElectronica/Documento-Soporte-de-Pago-de-Nomina-Electronica.aspx

- **Resolución 000004 de 2026:** Documento de consulta para las actualizaciones vigentes en los protocolos de transmisión.  
  https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000004%20de%2030-01-2026.pdf

- **Ley 2466 de 2025 (Reforma laboral):** Fuente de inspiración para la automatización de recargos nocturnos desde las 19:00 horas.  
  https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=181933

- **Ley 2101:** Base normativa para el cálculo dinámico del divisor de la jornada laboral.  
  https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=166506

#### 7.2 Referencias metodológicas y de ingeniería

Documentación que guio la estructura de este documento de requisitos:

- Presentaciones de apoyo "3. Metodologías Ágiles" y "4. Análisis de Requisitos".
- **CS - Taller 1:** Documento guía para la definición de los entregables del proyecto.
- **SRS+SIA.pdf:** Estándar de referencia para la Especificación de Requisitos de Software utilizado en la industria.

#### 7.3 Contexto de negocio e inspiración operativa

Materiales utilizados para entender el "dolor" del usuario y diseñar la solución:

- **Caso real de turnos:** "Turnos Centro Diagnóstico Diciembre.xlsx", archivo utilizado para modelar la complejidad de los turnos rotativos y diseñar el Golden Dataset de pruebas.
- **Abecé de nómina electrónica (DIAN):** Manual de interpretación de conceptos para asegurar que Nomara hable el mismo lenguaje que la entidad fiscal.
