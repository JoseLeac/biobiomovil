import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  alerts,
  CO2_FACTORS,
  routeOptions,
  routeSteps,
  searchDefaults,
  trips,
  TransportMode,
} from './src/data/mock';

type Tab = 'plan' | 'alerts' | 'trips';

const colors = {
  ink: '#102A38',
  muted: '#6B8189',
  paper: '#F5F8F5',
  white: '#FFFFFF',
  teal: '#168A75',
  mint: '#CFF5E8',
  navy: '#102E3E',
  line: '#DDE9E5',
  paleBlue: '#EAF2F8',
};

const modeIcon: Record<TransportMode, string> = { transit: '▣', bike: '♢', walk: '♧' };
const modeLabel: Record<TransportMode, string> = { transit: 'Transporte público', bike: 'Bicicleta', walk: 'Caminata' };

export default function App() {
  const [tab, setTab] = useState<Tab>('plan');
  const [showRoute, setShowRoute] = useState(false);
  const [origin, setOrigin] = useState(searchDefaults.origin);
  const [destination, setDestination] = useState(searchDefaults.destination);

  const totalCO2 = useMemo(() => trips.reduce((total, trip) => total + trip.co2, 0), []);

  const renderContent = () => {
    if (showRoute) {
      return <RouteDetail onBack={() => setShowRoute(false)} />;
    }
    if (tab === 'alerts') return <AlertsScreen />;
    if (tab === 'trips') return <TripsScreen totalCO2={totalCO2} />;
    return (
      <PlanScreen
        origin={origin}
        destination={destination}
        setOrigin={setOrigin}
        setDestination={setDestination}
        onRoute={() => setShowRoute(true)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.topBar}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
          <View>
            <Text style={styles.brand}>Conce <Text style={styles.brandAccent}>Móvil</Text></Text>
            <Text style={styles.eyebrow}>CONCEPCIÓN · MOVILIDAD CONSCIENTE</Text>
          </View>
          <View style={styles.signal}><View style={styles.signalDot} /><Text style={styles.signalText}>En vivo</Text></View>
        </View>
        <View style={styles.content}>{renderContent()}</View>
        <View style={styles.tabBar}>
          <TabButton icon="⌖" label="Planificar" active={tab === 'plan'} onPress={() => { setTab('plan'); setShowRoute(false); }} />
          <TabButton icon="!" label="Alertas" active={tab === 'alerts'} onPress={() => { setTab('alerts'); setShowRoute(false); }} badge={alerts.length} />
          <TabButton icon="↗" label="Mis viajes" active={tab === 'trips'} onPress={() => { setTab('trips'); setShowRoute(false); }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PlanScreen({ origin, destination, setOrigin, setDestination, onRoute }: {
  origin: string; destination: string; setOrigin: (value: string) => void; setDestination: (value: string) => void; onRoute: () => void;
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>HOLA, VIAJERO</Text>
          <Text style={styles.heroTitle}>Muévete mejor{'\n'}por Concepción.</Text>
          <Text style={styles.heroText}>Planifica un viaje que le haga bien a tu tiempo y a tu ciudad.</Text>
        </View>
        <View style={styles.heroOrb}><Text style={styles.heroOrbText}>↗</Text><Text style={styles.heroOrbCaption}>menos huella{'\n'}más ciudad</Text></View>
      </View>
      <View style={styles.searchCard}>
        <Text style={styles.sectionLabel}>¿A dónde vamos?</Text>
        <RouteInput label="ORIGEN" value={origin} onChangeText={setOrigin} color="#168A75" />
        <View style={styles.connector}><View style={styles.connectorLine} /><Text style={styles.connectorIcon}>↓</Text></View>
        <RouteInput label="DESTINO" value={destination} onChangeText={setDestination} color="#326B9C" />
        <Pressable style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]} onPress={onRoute} accessibilityRole="button">
          <Text style={styles.searchButtonText}>Buscar alternativas</Text><Text style={styles.searchArrow}>→</Text>
        </Pressable>
      </View>
      <View style={styles.resultsHeading}><View><Text style={styles.sectionLabel}>Opciones para ti</Text><Text style={styles.helper}>Salida estimada · 08:12</Text></View><Text style={styles.resultCount}>3 rutas</Text></View>
      {routeOptions.map((route, index) => <RouteCard key={route.id} route={route} featured={index === 0} onPress={onRoute} />)}
      <View style={styles.tip}><Text style={styles.tipIcon}>✦</Text><View style={{ flex: 1 }}><Text style={styles.tipTitle}>Cada elección cuenta</Text><Text style={styles.tipText}>Cambiar el auto por transporte activo evita en promedio 1,8 kg de CO₂.</Text></View></View>
    </ScrollView>
  );
}

function RouteInput({ label, value, onChangeText, color }: { label: string; value: string; onChangeText: (value: string) => void; color: string }) {
  return <View style={styles.inputRow}><View style={[styles.inputDot, { backgroundColor: color }]} /><View style={{ flex: 1 }}><Text style={styles.inputLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholderTextColor={colors.muted} accessibilityLabel={label} /></View><Text style={styles.pin}>⌖</Text></View>;
}

function RouteCard({ route, featured, onPress }: { route: typeof routeOptions[number]; featured: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.routeCard, featured && styles.featuredCard, pressed && styles.pressed]} accessibilityRole="button">
    <View style={styles.routeTop}><View style={[styles.modeIcon, { backgroundColor: `${route.accent}33` }]}><Text style={[styles.modeIconText, { color: route.accent }]}>{modeIcon[route.mode]}</Text></View><View style={{ flex: 1 }}><Text style={styles.routeTitle}>{route.title}</Text><Text style={styles.routeSubtitle}>{route.subtitle}</Text></View><Text style={styles.chevron}>›</Text></View>
    <View style={styles.routeStats}><Stat value={route.duration} label="duración" /><Stat value={route.distance} label="distancia" /><Stat value={route.cost} label="aporte" /></View>
    {route.impact && <View style={styles.impact}><Text style={styles.impactIcon}>✦</Text><Text style={styles.impactText}>{route.impact}</Text><Text style={styles.impactNote}>vs. auto</Text></View>}
  </Pressable>;
}

function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }

function RouteDetail({ onBack }: { onBack: () => void }) {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
    <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backArrow}>←</Text><Text style={styles.backText}>Volver a alternativas</Text></Pressable>
    <Text style={styles.kicker}>RUTA RECOMENDADA · MENOR IMPACTO</Text><Text style={styles.detailTitle}>Plaza Independencia{'\n'}→ Universidad de Concepción</Text>
    <View style={styles.summaryCard}><View><Text style={styles.summaryMain}>32 min</Text><Text style={styles.summarySub}>Llegada estimada 08:44</Text></View><View style={styles.summaryPill}><Text style={styles.summaryPillText}>1,01 kg CO₂ evitados</Text></View></View>
    <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Tu recorrido</Text>
    <View style={styles.timeline}>{routeSteps.map((step, index) => <View key={step.time} style={styles.step}><View style={styles.stepRail}>{index < routeSteps.length - 1 && <View style={styles.railLine} />}<View style={styles.stepDot}><Text style={styles.stepIcon}>{step.icon}</Text></View></View><View style={styles.stepContent}><Text style={styles.stepTime}>{step.time}</Text><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepDetail}>{step.detail}</Text></View></View>)}</View>
    <View style={styles.noteCard}><Text style={styles.noteIcon}>i</Text><Text style={styles.noteText}>Los horarios son referenciales para este demo. Confirma la salida antes de iniciar tu viaje.</Text></View>
  </ScrollView>;
}

function AlertsScreen() {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}><Text style={styles.kicker}>CENTRO DE INFORMACIÓN</Text><Text style={styles.pageTitle}>Alertas del día</Text><Text style={styles.pageIntro}>Lo que está pasando ahora en tus recorridos habituales.</Text><View style={styles.statusStrip}><View style={styles.statusLive} /><Text style={styles.statusText}>Actualizado hace 2 min</Text><Text style={styles.statusLink}>Ver mapa ›</Text></View>{alerts.map(alert => <View key={alert.id} style={styles.alertCard}><View style={styles.alertHeader}><View style={[styles.alertBadge, { backgroundColor: `${alert.accent}2B` }]}><Text style={[styles.alertBadgeText, { color: alert.accent }]}>{alert.type}</Text></View><Text style={styles.alertTime}>{alert.time}</Text></View><Text style={styles.alertTitle}>{alert.title}</Text><Text style={styles.alertDetail}>{alert.detail}</Text><View style={styles.alertFooter}><Text style={styles.alertService}>◉  {alert.service}</Text><Text style={styles.alertArrow}>→</Text></View></View>)}</ScrollView>;
}

function TripsScreen({ totalCO2 }: { totalCO2: number }) {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}><Text style={styles.kicker}>TU HUELLA POSITIVA</Text><Text style={styles.pageTitle}>Mis viajes</Text><Text style={styles.pageIntro}>Un pequeño registro de las decisiones que mueven tu ciudad.</Text><View style={styles.co2Card}><View style={styles.co2Ring}><Text style={styles.co2Value}>{totalCO2.toFixed(2)}</Text><Text style={styles.co2Unit}>kg CO₂</Text></View><View style={styles.co2Copy}><Text style={styles.co2Title}>evitados este mes</Text><Text style={styles.co2Text}>Eso equivale a plantar aproximadamente 1 árbol.</Text></View></View><View style={styles.tripHeader}><Text style={styles.sectionLabel}>Actividad reciente</Text><Text style={styles.resultCount}>{trips.length} viajes</Text></View>{trips.map(trip => <View key={trip.id} style={styles.tripCard}><View style={[styles.tripMode, { backgroundColor: trip.mode === 'bike' ? '#FFF3D8' : colors.paleBlue }]}><Text style={styles.tripModeIcon}>{modeIcon[trip.mode]}</Text></View><View style={{ flex: 1 }}><Text style={styles.tripRoute}>{trip.route}</Text><Text style={styles.tripMeta}>{trip.date} · {modeLabel[trip.mode]} · {trip.distance} km</Text></View><View style={styles.tripCO2}><Text style={styles.tripCO2Value}>-{trip.co2.toFixed(2)}</Text><Text style={styles.tripCO2Label}>kg CO₂</Text></View></View>)}<View style={styles.tip}><Text style={styles.tipIcon}>+</Text><View style={{ flex: 1 }}><Text style={styles.tipTitle}>Registrar un viaje</Text><Text style={styles.tipText}>Guarda tus viajes voluntariamente para seguir tu aporte.</Text></View><Text style={styles.chevron}>›</Text></View><Text style={styles.disclaimer}>Estimación referencial calculada con distancia × factor del modo. Factores editables en los datos de ejemplo.</Text></ScrollView>;
}

function TabButton({ icon, label, active, onPress, badge }: { icon: string; label: string; active: boolean; onPress: () => void; badge?: number }) {
  return <Pressable onPress={onPress} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: active }}><View style={[styles.tabIconWrap, active && styles.tabIconActive]}><Text style={[styles.tabIcon, active && styles.tabIconSelected]}>{icon}</Text>{badge && !active ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}</View><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  app: { flex: 1, maxWidth: 520, width: '100%', alignSelf: 'center' },
  topBar: { height: 78, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper },
  brandMark: { height: 38, width: 38, borderRadius: 13, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandMarkText: { color: colors.white, fontSize: 22, fontWeight: '800' },
  brand: { color: colors.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  brandAccent: { color: colors.teal },
  eyebrow: { color: colors.muted, fontSize: 8, letterSpacing: 1.1, marginTop: 2, fontWeight: '700' },
  signal: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 5 },
  signalDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: '#46C892' },
  signalText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  content: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  hero: { backgroundColor: colors.navy, borderRadius: 26, padding: 22, minHeight: 190, overflow: 'hidden', flexDirection: 'row', marginBottom: 16 },
  heroCopy: { flex: 1, zIndex: 1 },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  heroTitle: { color: colors.white, fontSize: 27, lineHeight: 30, fontWeight: '800', letterSpacing: -0.8 },
  heroText: { color: '#BAD0D2', fontSize: 12, lineHeight: 17, marginTop: 11, maxWidth: 220 },
  heroOrb: { height: 145, width: 145, borderRadius: 80, backgroundColor: '#1B5661', position: 'absolute', right: -30, top: 22, padding: 25, justifyContent: 'center' },
  heroOrbText: { color: '#A6FFE0', fontSize: 42, fontWeight: '200' },
  heroOrbCaption: { color: '#A6D3C8', fontSize: 9, lineHeight: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  searchCard: { backgroundColor: colors.white, borderRadius: 22, padding: 17, marginBottom: 25, borderWidth: 1, borderColor: colors.line },
  sectionLabel: { color: colors.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  inputDot: { width: 9, height: 9, borderRadius: 5, marginRight: 12 },
  inputLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  input: { color: colors.ink, fontSize: 15, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 0 },
  pin: { color: colors.muted, fontSize: 19 },
  connector: { height: 14, marginLeft: 4, flexDirection: 'row', alignItems: 'center' },
  connectorLine: { height: 14, width: 1, backgroundColor: colors.line },
  connectorIcon: { color: colors.muted, fontSize: 12, marginLeft: -5, backgroundColor: colors.white },
  searchButton: { height: 50, backgroundColor: colors.teal, borderRadius: 14, marginTop: 15, paddingHorizontal: 17, alignItems: 'center', flexDirection: 'row' },
  searchButtonText: { color: colors.white, fontSize: 14, fontWeight: '800', flex: 1 },
  searchArrow: { color: colors.white, fontSize: 24, fontWeight: '300' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
  resultsHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 11 },
  helper: { color: colors.muted, fontSize: 11, marginTop: 3 },
  resultCount: { color: colors.teal, fontSize: 11, fontWeight: '800' },
  routeCard: { backgroundColor: colors.white, borderRadius: 19, padding: 15, marginBottom: 11, borderWidth: 1, borderColor: colors.line },
  featuredCard: { borderColor: '#8BDCC3', borderWidth: 1.5 },
  routeTop: { flexDirection: 'row', alignItems: 'center' },
  modeIcon: { height: 40, width: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  modeIconText: { fontSize: 22, fontWeight: '800' },
  routeTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  routeSubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  chevron: { color: colors.muted, fontSize: 25, fontWeight: '300' },
  routeStats: { flexDirection: 'row', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EDF2F0' },
  stat: { flex: 1 },
  statValue: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 },
  impact: { backgroundColor: '#E9FBF4', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 9, marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  impactIcon: { color: colors.teal, fontSize: 12, marginRight: 5 },
  impactText: { color: colors.teal, fontSize: 10, fontWeight: '800' },
  impactNote: { color: '#75A89C', fontSize: 10, marginLeft: 'auto' },
  tip: { backgroundColor: '#EAF5F4', borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tipIcon: { color: colors.teal, fontSize: 22, marginRight: 11 },
  tipTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  tipText: { color: colors.muted, fontSize: 11, lineHeight: 15, marginTop: 3 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  backArrow: { color: colors.teal, fontSize: 23, marginRight: 8 },
  backText: { color: colors.teal, fontSize: 12, fontWeight: '800' },
  detailTitle: { color: colors.ink, fontSize: 27, lineHeight: 31, fontWeight: '800', letterSpacing: -0.8, marginBottom: 19 },
  summaryCard: { backgroundColor: colors.navy, borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },
  summaryMain: { color: colors.white, fontSize: 29, fontWeight: '800' },
  summarySub: { color: '#A8C4C8', fontSize: 11, marginTop: 3 },
  summaryPill: { marginLeft: 'auto', backgroundColor: '#1F5960', borderRadius: 10, padding: 9, maxWidth: 125 },
  summaryPillText: { color: '#A6FFE0', fontSize: 10, fontWeight: '800', lineHeight: 14 },
  timeline: { marginTop: 17 },
  step: { flexDirection: 'row', minHeight: 68 },
  stepRail: { width: 36, alignItems: 'center' },
  railLine: { position: 'absolute', width: 1, top: 26, bottom: -1, backgroundColor: '#B7DDD4' },
  stepDot: { height: 25, width: 25, borderRadius: 13, backgroundColor: '#E0F6EF', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  stepIcon: { color: colors.teal, fontSize: 12, fontWeight: '800' },
  stepContent: { paddingLeft: 13, paddingBottom: 17, flex: 1 },
  stepTime: { color: colors.teal, fontSize: 11, fontWeight: '800' },
  stepTitle: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 3 },
  stepDetail: { color: colors.muted, fontSize: 11, marginTop: 3 },
  noteCard: { flexDirection: 'row', backgroundColor: '#FFF8E7', borderRadius: 14, padding: 13, marginTop: 10 },
  noteIcon: { color: '#9C791D', borderWidth: 1, borderColor: '#D7B94F', borderRadius: 8, width: 18, height: 18, textAlign: 'center', fontSize: 12, marginRight: 9 },
  noteText: { color: '#78632B', fontSize: 11, lineHeight: 16, flex: 1 },
  pageTitle: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -1, marginTop: 2 },
  pageIntro: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 7, marginBottom: 17, maxWidth: 320 },
  statusStrip: { backgroundColor: '#E2F6EE', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statusLive: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal, marginRight: 7 },
  statusText: { color: colors.teal, fontSize: 10, fontWeight: '700', flex: 1 },
  statusLink: { color: colors.teal, fontSize: 10, fontWeight: '800' },
  alertCard: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 15, marginBottom: 11 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 11 },
  alertBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 },
  alertBadgeText: { fontSize: 10, fontWeight: '800' },
  alertTime: { color: colors.muted, fontSize: 10, marginLeft: 'auto' },
  alertTitle: { color: colors.ink, fontSize: 14, lineHeight: 19, fontWeight: '800' },
  alertDetail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  alertFooter: { borderTopWidth: 1, borderTopColor: '#EDF2F0', marginTop: 13, paddingTop: 11, flexDirection: 'row' },
  alertService: { color: colors.ink, fontSize: 10, fontWeight: '700', flex: 1 },
  alertArrow: { color: colors.teal, fontSize: 17 },
  co2Card: { backgroundColor: colors.navy, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', marginTop: 3, marginBottom: 27 },
  co2Ring: { borderWidth: 2, borderColor: '#5DE1B5', height: 100, width: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  co2Value: { color: colors.white, fontSize: 25, fontWeight: '800' },
  co2Unit: { color: '#A7C9CB', fontSize: 10, marginTop: 1 },
  co2Copy: { flex: 1, marginLeft: 17 },
  co2Title: { color: '#A6FFE0', fontSize: 15, fontWeight: '800' },
  co2Text: { color: '#BAD0D2', fontSize: 11, lineHeight: 16, marginTop: 6 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  tripCard: { backgroundColor: colors.white, borderRadius: 17, padding: 12, marginBottom: 9, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  tripMode: { height: 38, width: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  tripModeIcon: { color: colors.teal, fontSize: 19 },
  tripRoute: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  tripMeta: { color: colors.muted, fontSize: 10, marginTop: 4 },
  tripCO2: { alignItems: 'flex-end', marginLeft: 5 },
  tripCO2Value: { color: colors.teal, fontSize: 13, fontWeight: '800' },
  tripCO2Label: { color: colors.muted, fontSize: 9, marginTop: 2 },
  disclaimer: { textAlign: 'center', color: '#91A3A4', fontSize: 10, lineHeight: 14, marginTop: 17, paddingHorizontal: 10 },
  tabBar: { height: 76, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', paddingHorizontal: 12, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center' },
  tabIconWrap: { height: 28, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, position: 'relative' },
  tabIconActive: { backgroundColor: '#DDF5EC' },
  tabIcon: { color: colors.muted, fontSize: 20 },
  tabIconSelected: { color: colors.teal, fontWeight: '800' },
  tabLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', marginTop: 4 },
  tabLabelActive: { color: colors.teal },
  badge: { position: 'absolute', top: -2, right: 3, backgroundColor: '#F2776A', height: 15, minWidth: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  badgeText: { color: colors.white, fontSize: 8, fontWeight: '800' },
});
