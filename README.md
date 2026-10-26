# Conce Móvil

Demo de diseño de una app municipal de movilidad sostenible para el área urbana de
Concepción, Chile. El nombre oficial es **Conce Móvil**. No hay backend, autenticación
ni APIs reales; los datos son simulados. El alcance no incluye pagos ni compra de
pasajes.

## Ejecutar

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go o presiona `w` para abrir la versión web.

## Verificar cambios

```bash
npx tsc --noEmit
```

No hay lint configurado. `expo lint` falla porque el flujo de configuración de Expo
SDK 58 es incompatible con ESLint 9; resolver esa dependencia antes de usar lint como
control obligatorio.

## Pantallas y navegación

- **Planificar**: origen, destino y tarjetas de Bus + Biotren, Bicicleta pública y
  Caminata. Tocar una tarjeta abre el detalle correspondiente.
- **Detalle de ruta**: recorrido de la recomendación, línea de tiempo y aviso de
  desvío de Línea 20 (`+4 min`).
- **Alertas**: desvío de líneas 20 y 21, Biotren Línea 2 suspendido y demora de buses.
  Tocar el desvío abre la comparación de ruta afectada.
- **Mis viajes**: viajes sostenibles simulados y CO₂ evitado.
- **Bicicleta pública**: esquema del trayecto, ciclovía Los Carrera, estaciones,
  bicicletas/espacios disponibles, estado operativo y 30 minutos incluidos.
- **Ruta afectada por alerta**: ruta original atenuada y alternativa por calle Freire
  con diferencia de tiempo.
- **Detalle de Línea 20**: recorrido, próximos buses, frecuencia, estado y fuente del
  operador.
- **Panel municipal**: se abre desde “Panel” en el encabezado, fuera de la barra
  inferior móvil. Usa un layout de escritorio con métricas, rutas, incidencias,
  filtros visuales y tendencia.

La barra inferior conserva las tres pestañas móviles Planificar, Alertas y Mis viajes;
el detalle de ruta es la cuarta vista base secundaria del flujo existente.

## Convenciones visuales y de datos

- Texto en español de Chile y coma decimal en la interfaz (`8,4 km`, `1,01 kg`).
- Iconos exclusivamente con `lucide-react-native`, incluidos los de la barra inferior.
- Paleta principal: verde `#168A75`, azul oscuro `#102E3E`, texto `#102A38`, fondo
  `#F5F8F5`, tarjetas `#FFFFFF`, líneas `#DDE9E5` y secundario `#6B8189`.
- Se mantienen tarjetas blancas redondeadas, etiquetas pequeñas en mayúsculas y los
  espaciados existentes.
- Los datos y tipos simulados están centralizados en
  [`src/data/mock.ts`](src/data/mock.ts). La UI y navegación están actualmente en
  [`App.tsx`](App.tsx).

## Cobertura funcional

| Funcionalidad | Pantalla | Qué falta |
| --- | --- | --- |
| Planificación de rutas | Planificar y detalle de ruta | Motor/API real y rutas dinámicas. |
| Integración de información | Alertas, estaciones y Línea 20 | Datos del operador, tiempo real y mapa real. |
| Alertas | Alertas y ruta afectada | Push, actualización automática y georreferenciación. |
| Registro de viajes sostenibles | Mis viajes | Persistencia, cuenta y edición de viajes. |
| Panel municipal | Panel municipal | Backend, permisos, filtros funcionales y exportación. |

## Datos inventados por validar

Validar con la Municipalidad y operadores: desvío de Línea 20/21 por Los Carrera y
Freire, incremento de `+4 min`, llegada `08:48`, horarios `08:18`/`08:32`/`08:46`,
frecuencia de 14 minutos, suspensión de Biotren Línea 2, demora de 8 minutos,
disponibilidad de bicicletas y 30 minutos incluidos, factores de CO₂, cifras del panel
(12.480 usuarios, 1.860 consultas, 842,6 kg evitados), rutas más consultadas,
incidencias y nombre de la fuente del operador.

## Arquitectura y próximos pasos

El panel municipal es un estado interno de `App.tsx` para mantener intacta la navegación
móvil, ya que el proyecto aún no usa Expo Router. No se debe agregar a la barra inferior.
El siguiente refactor recomendado es separar navegación, pantallas, componentes y
tokens de estilo, y luego migrar el panel a una ruta `/panel` si se necesita navegación
profunda. Mantener `src/data/mock.ts` como única fuente de datos de ejemplo hasta
definir contratos reales.
