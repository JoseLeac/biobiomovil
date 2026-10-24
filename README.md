# Bio-Bio Móvil

Prototipo visual de una app móvil para planificar viajes sostenibles en el Gran Concepción. Es una demo local: no incluye backend, autenticación ni APIs reales.

## Ejecutar

```bash
npm install
npx expo start
```

Luego escanea el QR con Expo Go, o presiona `w` para abrir la versión web.

## Estructura

- `App.tsx`: navegación por pestañas y pantallas de la demo.
- `src/data/mock.ts`: datos simulados, tipos y factores editables de CO₂. Los componentes consumen este archivo para facilitar el reemplazo por una API.

La navegación permite buscar una ruta de ejemplo, abrir su detalle, consultar alertas simuladas y revisar el registro voluntario de viajes.
