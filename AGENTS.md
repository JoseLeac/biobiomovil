# Conce Móvil · guía para continuar el proyecto

## Propósito y alcance

**Conce Móvil** es un demo de diseño para movilidad sostenible en el área urbana de
Concepción, Chile. No tiene backend, autenticación ni APIs reales: todos los datos son
de ejemplo. No agregar pagos, compra de pasajes ni cobertura fuera de Concepción.
El nombre oficial es “Conce Móvil”; no usar “Bio-Bio Móvil”.

## Arquitectura y navegación actual

- `App.tsx` concentra la navegación por estado, las pantallas y los estilos compartidos.
- La barra inferior móvil tiene tres pestañas:
  - **Planificar**: buscador y opciones de ruta. Tocar una tarjeta abre el detalle de
    ruta; tocar “Bicicleta pública” abre su detalle.
  - **Alertas**: desvío de líneas 20 y 21, suspensión de Biotren Línea 2 y demora de
    buses. Tocar el desvío abre la ruta afectada.
  - **Mis viajes**: registro de viajes y CO₂ evitado.
- La cuarta superficie base es el **detalle de ruta**, accesible desde Planificar;
  desde el aviso de Línea 20 se puede abrir el detalle de la línea y sus horarios.
- El **panel municipal** se abre mediante “Panel” en el encabezado, no desde la barra
  inferior móvil. Es un estado interno (`screen === 'panel'`) con layout de escritorio.
- Pantallas secundarias: bicicleta pública, ruta afectada por alerta y detalle de Línea
  20. El botón de retorno conserva el contexto de la pantalla anterior.

## Convenciones de producto y código

- Todo el texto visible debe estar en español de Chile.
- Usar coma decimal en pantalla (`2,69 kg`, `-1,01 kg`, `8,4 km`). Los números
  internos pueden seguir siendo `number`.
- Los iconos deben venir de `lucide-react-native`; no reemplazarlos por glifos Unicode.
- Mantener la identidad existente:
  - verde principal `#168A75` (referencia de marca cercana a `#3F8A6E`);
  - azul oscuro `#102E3E`, texto `#102A38`;
  - fondo `#F5F8F5`, tarjetas `#FFFFFF`;
  - líneas `#DDE9E5`, texto secundario `#6B8189`;
  - acentos mint `#CFF5E8`, azul pálido `#EAF2F8`, ámbar `#F5C76A`,
    coral `#F2776A`.
- Preferir tarjetas blancas redondeadas, etiquetas pequeñas en mayúsculas y los
  espaciados/tokens ya definidos en `App.tsx`.
- Centralizar datos y tipos simulados en [`src/data/mock.ts`](src/data/mock.ts).

## Datos de ejemplo que requieren validación municipal

- Duración de la recomendación Bus + Biotren: `36 min`, llegada `08:48` y el aviso
  “Línea 20 con desvío · +4 min”.
- Desvío de líneas 20 y 21 por calle Freire debido a obras en Avenida Los Carrera.
- Horarios de Línea 20 (`08:18`, `08:32`, `08:46`), frecuencia de 14 minutos,
  parada Catedral y recorrido Collao–Centro–Plaza Independencia.
- Suspensión de Biotren Línea 2 entre Concepción y Lomas Coloradas.
- Demora de 8 minutos en buses del centro y congestión en el eje Pedro de Valdivia.
- Bicicleta pública: estaciones Plaza Independencia y Barrio Universitario,
  disponibilidad de 8 bicicletas, 12 espacios libres, 30 minutos incluidos y
  ciclovía Avenida Los Carrera.
- Cifras del panel: 12.480 usuarios activos, 1.860 consultas diarias, 842,6 kg de
  CO₂ evitado, 5 incidencias abiertas (3 en revisión y 2 resueltas), porcentajes de
  variación y rutas consultadas.
- Factores referenciales de CO₂ (`0,12` transporte público, `0,21` bicicleta y
  caminata), distancias y equivalencia aproximada de un árbol.
- Fuente mostrada para horarios: “Operador de Transporte Público del Gran
  Concepción”; confirmar nombre y disponibilidad de la fuente.

## Funcionalidades obligatorias

| Funcionalidad | Dónde se ve | Estado / falta |
| --- | --- | --- |
| Planificación de rutas | Planificar, tarjetas y detalle de ruta | Demo completa con origen/destino fijos editables; falta motor o API real. |
| Integración de información | Alertas, detalle de Línea 20 y estados de estaciones | Demo coherente entre pantallas; falta integración con operador y datos en tiempo real. |
| Alertas | Pestaña Alertas y ruta afectada | Incluye desvío, suspensión y demora; falta notificación push, mapa real y actualización automática. |
| Registro de viajes sostenibles | Pestaña Mis viajes | Registro simulado y CO₂ agregado; falta persistencia, alta/edición real y cuenta de usuario. |
| Panel municipal | Vista Panel | Indicadores, filtros visuales, ranking, incidencias y tendencia de ejemplo; faltan backend, permisos, exportación y filtros funcionales. |

## Ejecutar y verificar

```bash
npm install
npx expo start
npx tsc --noEmit
```

También se puede presionar `w` después de iniciar Expo para abrir la versión web.
Actualmente no hay lint configurado. `expo lint` intenta configurar ESLint, pero falla
por la incompatibilidad de Expo SDK 58 con ESLint 9; no asumir que un resultado de lint
es una validación disponible hasta resolver esa compatibilidad.

## Pendientes de arquitectura

- El panel es un estado interno para no romper la navegación móvil existente y porque
  el proyecto todavía no usa Expo Router. No convertirlo en una pestaña móvil.
- Separar `App.tsx` en componentes, pantallas, navegación y tokens de estilo cuando se
  amplíe el demo; conservar `src/data/mock.ts` como fuente única de mock data.
- Si se requiere navegación profunda, migrar cuidadosamente a Expo Router y crear una
  ruta `/panel`, verificando primero la versión de Expo (`~58.0.17`) y sus docs.
- Extraer un componente de tarjeta de estado, un formateador decimal y un sistema de
  iconos tipado para evitar que `App.tsx` siga creciendo.
- Antes de conectar backend, definir contratos municipales para rutas, alertas,
  horarios, disponibilidad de bicicletas, incidencias y métricas agregadas.
