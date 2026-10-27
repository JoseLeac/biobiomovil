export type TransportMode = 'transit' | 'bike' | 'walk';

export type RouteOption = {
  id: string;
  mode: TransportMode;
  title: string;
  subtitle: string;
  duration: string;
  distance: string;
  cost: string;
  impact?: string;
  notice?: string;
  accent: string;
};

export type AlertItem = {
  id: string;
  type: 'Desvío' | 'Interrupción' | 'Retraso';
  title: string;
  detail: string;
  time: string;
  service: string;
  accent: string;
};

export type Trip = {
  id: string;
  date: string;
  route: string;
  mode: TransportMode;
  distance: number;
  co2: number;
};

export const places = [
  'Plaza Independencia',
  'UdeC',
  'Collao',
  'Barrio Universitario',
  'Centro de Concepción',
] as const;

export const searchDefaults = {
  origin: 'Plaza Independencia',
  destination: 'UdeC',
};

export const routeOptions: RouteOption[] = [
  {
    id: 'biotren',
    mode: 'transit',
    title: 'Bus + Biotren',
    subtitle: 'Biobus hacia Estación Concepción',
    duration: '36 min',
    distance: '8,4 km',
    cost: '$680',
    impact: 'Recomendada',
    notice: 'Línea 20 con desvío · +4 min',
    accent: '#5DE1B5',
  },
  {
    id: 'bike',
    mode: 'bike',
    title: 'Bicicleta pública',
    subtitle: 'Ciclovía Avenida Los Carrera',
    duration: '24 min',
    distance: '6,1 km',
    cost: '$0 · 30 min incluidos',
    impact: 'Menor impacto',
    accent: '#F5C76A',
  },
  {
    id: 'walk',
    mode: 'walk',
    title: 'Caminata',
    subtitle: 'Por Parque Ecuador',
    duration: '1 h 18 min',
    distance: '5,6 km',
    cost: 'Gratis',
    accent: '#8CB8FF',
  },
];

export const routeSteps = [
  { time: '08:12', title: 'Camina hasta Plaza Independencia', detail: '350 m · 4 min' },
  { time: '08:18', title: 'Toma el bus hacia Concepción', detail: 'Línea 20 · Parada Catedral' },
  { time: '08:31', title: 'Baja en Estación Concepción', detail: '8 min · espera 4 min para conexión' },
  { time: '08:35', title: 'Aborda Biotren hacia Chiguayante', detail: 'Andén 2 · 1 parada' },
  { time: '08:48', title: 'Llegas a Universidad de Concepción', detail: 'Camina 350 m · 4 min' },
];

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    type: 'Desvío',
    title: 'Desvío temporal en Avenida Los Carrera',
    detail: 'Las líneas 20 y 21 circulan por calle Freire debido a obras.',
    time: 'Actualizado 07:42',
    service: 'Bus · Líneas 20, 21',
    accent: '#F5C76A',
  },
  {
    id: 'a2',
    type: 'Interrupción',
    title: 'Servicio suspendido entre Concepción y Lomas Coloradas',
    detail: 'Revisa alternativas de conexión en Estación Concepción.',
    time: 'Desde 06:15',
    service: 'Biotren · Línea 2',
    accent: '#FF8D7E',
  },
  {
    id: 'a3',
    type: 'Retraso',
    title: 'Demora de 8 minutos en buses al centro',
    detail: 'Congestión moderada en el eje Pedro de Valdivia.',
    time: 'Actualizado 08:03',
    service: 'Bus · Concepción centro',
    accent: '#8CB8FF',
  },
];

// Estimación referencial: kg de CO2 evitados por km vs. auto particular.
export const CO2_FACTORS: Record<TransportMode, number> = {
  transit: 0.12,
  bike: 0.21,
  walk: 0.21,
};

export const trips: Trip[] = [
  { id: 't1', date: 'Hoy, 08:12', route: 'Plaza Independencia → UdeC', mode: 'transit', distance: 8.4, co2: 1.01 },
  { id: 't2', date: 'Ayer, 18:05', route: 'Barrio Universitario → Pedro de Valdivia', mode: 'bike', distance: 4.2, co2: 0.88 },
  { id: 't3', date: 'Lun, 07:48', route: 'Collao → Centro de Concepción', mode: 'transit', distance: 6.7, co2: 0.8 },
];
