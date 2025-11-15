import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AccionesSosteniblesScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [completedActions, setCompletedActions] = useState<number[]>([]);

  if (!fontsLoaded) return null;

  const actions = [
    {
      id: 1,
      category: 'home',
      title: 'Instala Paneles Solares',
      impact: 'ALTO',
      co2Saved: '1,500 kg CO₂/año',
      difficulty: 'Media',
      cost: '$$',
      icon: 'sunny',
      color: '#F39C12',
      description: 'Los paneles solares convierten luz solar en electricidad limpia, reduciendo dependencia de combustibles fósiles.',
      detailedInfo: 'Sistema solar residencial típico de 5kW genera 7,000-9,000 kWh anuales en Ecuador, cubriendo 80-100% consumo casa promedio. Energía solar más barata: $0.03-0.04/kWh vs $0.12-0.15/kWh red.',
      benefits: [
        'Ahorro 50-90% en factura eléctrica ($30-50/mes)',
        'Retorno inversión en 5-8 años',
        'Sistema dura 25+ años con mínimo mantenimiento',
        'Aumenta valor propiedad 3-4%',
        'Ecuador: 4-5 horas pico solar diario',
        'Incentivos: créditos verdes disponibles',
      ],
      howTo: [
        '1. Evalúa consumo: revisa facturas últimos 6 meses',
        '2. Análisis techo: orientación sur, mínimo 20m², sin sombra',
        '3. Cotiza 3+ empresas certificadas',
        '4. Tamaño: 1kW cubre ~125 kWh/mes',
        '5. Instalación: 2-3 días',
        '6. Conexión bidireccional con red',
        '7. Monitoreo app en tiempo real',
      ],
      stats: 'Ecuador: 1kW solar genera 1,400-1,800 kWh/año. Sistema 5kW = 9,000 kWh = ahorro $1,080/año. Inversión ~$4,500-6,000.',
    },
    {
      id: 2,
      category: 'home',
      title: 'Cambia a Bombillas LED',
      impact: 'MEDIO',
      co2Saved: '180 kg CO₂/año',
      difficulty: 'Muy Fácil',
      cost: '$',
      icon: 'bulb',
      color: '#F1C40F',
      description: 'LEDs usan 75% menos energía que incandescentes y duran 25 veces más.',
      detailedInfo: 'Bombilla incandescente 60W consume 525 kWh en vida útil. LED equivalente (9W) solo 78 kWh. Ahorro 447 kWh por bombilla.',
      benefits: [
        'Ahorro 75-80% en iluminación',
        'LED dura 25,000-50,000 horas vs 1,000',
        'Menos calor = menor uso AC',
        'Sin mercurio tóxico',
        'ROI inmediato: ahorra $100+ en vida útil',
        'Casa promedio: $180-250/año ahorrados',
      ],
      howTo: [
        '1. Cuenta bombillas actuales y potencia',
        '2. Compra LEDs equivalentes: 60W → 9W',
        '3. Busca etiqueta Energy Star',
        '4. Temperatura 2700-3000K para casa',
        '5. Cambia primero las de mayor uso',
        '6. Recicla fluorescentes correctamente',
        '7. Instala dimmers compatibles LED',
      ],
      stats: 'Cambiar 10 bombillas ahorra 450 kWh/año = $54. Si 1 millón hogares lo hace: 450 GWh = planta 50 MW.',
    },
    {
      id: 3,
      category: 'home',
      title: 'Aísla Térmicamente tu Casa',
      impact: 'ALTO',
      co2Saved: '1,200 kg CO₂/año',
      difficulty: 'Media',
      cost: '$$',
      icon: 'home',
      color: '#3498DB',
      description: 'Aislamiento reduce hasta 40% consumo de calefacción y refrigeración.',
      detailedInfo: 'En Sierra, 30-50% calor se pierde por paredes, techos, ventanas mal aisladas. Aislamiento crea barrera térmica manteniendo temperatura estable.',
      benefits: [
        'Reduce 20-40% consumo energético total',
        'Casa más confortable: 3-5°C diferencia',
        'Menor ruido exterior',
        'Protege de humedad y moho',
        'ROI 3-7 años',
        'Aumenta valor inmobiliario 5-8%',
      ],
      howTo: [
        '1. Auditoría térmica: identifica fugas',
        '2. Prioriza techo: 25-35% pérdidas',
        '3. Materiales: lana vidrio, poliestireno',
        '4. Techo: 15-25 cm aislante',
        '5. Paredes: 8-12 cm',
        '6. Ventanas: doble vidrio o film',
        '7. Sella con burletes',
        '8. Profesional: $15-25/m²',
      ],
      stats: 'Casa 100m² Quito: aislamiento $1,500-2,500, ahorra $400-600/año. Payback 4-6 años.',
    },
    {
      id: 4,
      category: 'home',
      title: 'Instala Sistema Captación Lluvia',
      impact: 'MEDIO',
      co2Saved: '250 kg CO₂/año',
      difficulty: 'Media',
      cost: '$-$$',
      icon: 'water',
      color: '#3498DB',
      description: 'Captura agua lluvia para riego, limpieza, WC. Ahorra hasta 50% consumo.',
      detailedInfo: 'Ecuador: 800-4,000mm precipitación anual. Casa 100m² techo capta 80,000-400,000 litros/año. Sistema básico $300-1,500.',
      benefits: [
        'Ahorra 30-50% agua potable ($15-30/mes)',
        'Agua lluvia libre cloro: mejor plantas',
        'Reduce presión acuíferos',
        'Previene inundaciones',
        'Autosuficiencia en racionamiento',
        'Sistema dura 20+ años',
      ],
      howTo: [
        '1. Calcula: área techo × lluvia × 0.8',
        '2. Componentes: canaletas, filtro, tanque',
        '3. Tanque: 1,000-5,000L',
        '4. Primer descarte: 5mm lluvia',
        '5. Filtración: malla, sedimentación',
        '6. Usos: WC, lavado, riego',
        '7. Tratamiento UV para ducha',
        '8. Limpia filtros trimestral',
      ],
      stats: 'Quito: techo 100m² = 96,000L/año. Familia 4: 720L/día = 133 días autosuficientes.',
    },
    {
      id: 5,
      category: 'transport',
      title: 'Cambia a Auto Eléctrico',
      impact: 'ALTO',
      co2Saved: '2,400 kg CO₂/año',
      difficulty: 'Media',
      cost: '$$$',
      icon: 'car-sport',
      color: '#2ECC71',
      description: 'Vehículos eléctricos reducen 70% emisiones vs gasolina y 60% menos costos operación.',
      detailedInfo: 'Ecuador subsidia eléctricos: 0% aranceles, IVA 0%. Auto gasolina emite 4-6 ton CO₂/año. Eléctrico: 0.3-0.8 ton con electricidad 93% renovable.',
      benefits: [
        'Ahorro 70% combustible: $0.12/kWh vs $2.80/gal',
        '20,000 km/año: gasolina $2,100 vs electricidad $420',
        'Cero mantenimiento motor',
        'Servicio cada 30,000 vs 5,000 km',
        'Aceleración superior',
        'Incentivos: placas libres, parqueo gratis',
      ],
      howTo: [
        '1. Analiza uso diario de kilómetros',
        '2. Modelos: BYD ($25k-45k), Renault ($27k)',
        '3. Autonomía: 250-400 km/carga',
        '4. Carga hogar: 220V (6-8h)',
        '5. Carga pública: red en Quito/Guayaquil',
        '6. Crédito verde: 5-7% tasa',
        '7. Seguro 20-30% más barato',
        '8. Batería: 8-10 años garantía',
      ],
      stats: 'Auto gasolina 15,000 km: $3,640 + mantención $800 = $4,440. Eléctrico: $360 + $200 = $560. Ahorro: $3,880/año.',
    },
    {
      id: 6,
      category: 'transport',
      title: 'Usa Bicicleta para Trayectos Cortos',
      impact: 'MEDIO',
      co2Saved: '600 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'bicycle',
      color: '#27AE60',
      description: '50% viajes urbanos son bajo 5km. Bicicleta 5x más rápida que auto en tráfico.',
      detailedInfo: 'Quito hora pico: autos 12 km/h vs bicicleta 15-20 km/h. 70% espacio urbano para autos que transportan solo 20% personas.',
      benefits: [
        'Ahorra $200+ mes transporte',
        'Ejercicio: previene obesidad, diabetes',
        'Reduce estrés, mejora salud mental',
        'Mantenimiento: $50/año',
        'Quito: 62 km ciclovías',
        'Evita tráfico: 5 km en 20-25 min',
        'Cero contaminación aire y ruido',
      ],
      howTo: [
        '1. Planifica ruta con Google Maps',
        '2. Bicicleta urbana: $250-600',
        '3. Equipamiento: casco, luces, candado',
        '4. Empieza 2-3 días/semana',
        '5. Lleva cambio ropa si necesario',
        '6. Usa ciclovías, respeta semáforos',
        '7. Estaciona en BiciQuito gratis',
        '8. Lluvia: impermeable o combina bus',
      ],
      stats: 'Reemplazar 10 km/día carro→bici: 600 kg CO₂/año, $1,200 ahorro, 12 kg peso perdido.',
    },
    {
      id: 7,
      category: 'transport',
      title: 'Practica Carpooling/Viajes Compartidos',
      impact: 'MEDIO',
      co2Saved: '800 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'people',
      color: '#9B59B6',
      description: 'Compartir auto reduce 50% emisiones por persona y ahorra $100+ mensuales.',
      detailedInfo: 'Ecuador: 75% autos van con 1 persona. Ocupancia promedio: 1.3. Aumentar a 2.5 reduciría emisiones transporte 40%.',
      benefits: [
        'Reduce costos 50-70%',
        'Ahorro típico: $80-150/mes',
        'Menos tráfico significativo',
        'Sociabilizar: conoce vecinos',
        'Menos estrés conducir',
        'Acceso vías HOV exclusivas',
      ],
      howTo: [
        '1. Apps: BlaBlaCar, Waze Carpool',
        '2. Encuentra vecinos misma ruta',
        '3. Acuerdo: rotación, dividir costos',
        '4. Cálculo: gasolina + peaje ÷ pasajeros',
        '5. Puntualidad importante',
        '6. Plan B si conductor falla',
        '7. Seguridad: verifica identidad',
        '8. Formaliza para viajes regulares',
      ],
      stats: 'Quito norte-sur: 800 km/mes. 50L × $2.80 = $140. Entre 3: $47/persona. Ahorro: $93/mes.',
    },
    {
      id: 8,
      category: 'transport',
      title: 'Optimiza Mantenimiento Vehicular',
      impact: 'BAJO',
      co2Saved: '300 kg CO₂/año',
      difficulty: 'Muy Fácil',
      cost: '$',
      icon: 'construct',
      color: '#E67E22',
      description: 'Auto bien mantenido reduce 10-15% consumo de combustible.',
      detailedInfo: 'Neumáticos desinflados 0.3 bar = +3% consumo. Filtro sucio: +10%. Aceite viejo: fricción innecesaria.',
      benefits: [
        'Reduce consumo 10-15%',
        'Ahorro $200-300/año',
        'Extiende vida motor 30-40%',
        'Menos reparaciones costosas',
        'Mayor valor reventa',
        'Conduce más seguro',
      ],
      howTo: [
        '1. Presión llantas: revisa mensual',
        '2. Cambio aceite: cada 5,000 km',
        '3. Filtros: aire 15,000 km',
        '4. Bujías: cada 30,000-50,000 km',
        '5. Alineación: cada 10,000 km',
        '6. Frenos: revisa pastillas',
        '7. Batería: limpia terminales',
        '8. Conduce suave: evita aceleraciones bruscas',
      ],
      stats: 'Auto 15,000 km/año consumo 10L/100km. Mantenimiento óptimo reduce a 8.8L = 180L ahorro = $504/año.',
    },
    {
      id: 9,
      category: 'food',
      title: 'Reduce Consumo de Carne Roja',
      impact: 'ALTO',
      co2Saved: '900 kg CO₂/año',
      difficulty: 'Media',
      cost: '$',
      icon: 'leaf',
      color: '#27AE60',
      description: 'Producción carne res emite 27kg CO₂/kg. Pollo 6.9kg. Legumbres 2kg.',
      detailedInfo: '1 kg carne res requiere 15,000L agua, 20m² tierra, emite 27 kg CO₂. Ganadería 14.5% emisiones globales. Lunes sin carne reduce huella 15%.',
      benefits: [
        'Reduce huella carbono 20-30%',
        'Ahorra 4,000L agua/semana',
        'Mejora salud cardiovascular',
        'Ahorro económico: legumbres 5x más baratas',
        'Frena deforestación amazónica',
        'Menos antibióticos en organismo',
      ],
      howTo: [
        '1. Empieza Lunes sin carne',
        '2. Reemplaza gradual: res→pollo→legumbres',
        '3. Proteínas: lentejas, garbanzos, quinoa',
        '4. Ecuador: chocho (23g proteína/100g)',
        '5. Recetas: seco lenteja, hamburguesas garbanzos',
        '6. Suplementa B12 si reduces mucho',
        '7. Compra carne de pastoreo',
        '8. Meta: 2-3 comidas sin carne/semana',
      ],
      stats: 'Familia 4: reducir 50% carne (4 kg/mes): 108 kg CO₂/mes = 1,296 kg/año + $80/mes ahorrados.',
    },
    {
      id: 10,
      category: 'food',
      title: 'Compra Alimentos Locales y Temporada',
      impact: 'MEDIO',
      co2Saved: '400 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'basket',
      color: '#F39C12',
      description: 'Alimentos viajan promedio 2,400 km. Locales reducen transporte 95%.',
      detailedInfo: 'Tomate Europa→Ecuador: 10,000 km = 5 kg CO₂/kg. Local: 50 km = 0.05 kg CO₂. Productos temporada más nutritivos y baratos.',
      benefits: [
        'Reduce emisiones transporte 85-95%',
        'Más fresco y nutritivo',
        '30-50% más barato sin intermediarios',
        'Apoya agricultores locales',
        'Menos empaques plásticos',
        'Sabor superior',
      ],
      howTo: [
        '1. Mercados locales: 30-50% más baratos',
        '2. Identifica temporada: enero→mangos',
        '3. Ferias orgánicas: sábados',
        '4. Apps: Canastas Comunitarias Ecuador',
        '5. Bolsas reutilizables',
        '6. Planifica menú según disponible',
        '7. Congela excedentes',
        '8. Pregunta origen en supermercados',
      ],
      stats: 'Familia 100 kg frutas/mes. 50% importado→local: 1 ton CO₂/año + $200 ahorrados.',
    },
    {
      id: 11,
      category: 'food',
      title: 'Reduce Desperdicio de Alimentos',
      impact: 'ALTO',
      co2Saved: '750 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'trash',
      color: '#E74C3C',
      description: 'Ecuador desperdicia 939,000 ton alimentos/año. Desperdiciar comida = desperdiciar recursos.',
      detailedInfo: '1/3 alimentos producidos se desperdicia: 1,300 millones ton/año = $1 billón. Familia ecuatoriana bota $300-400 comida/año.',
      benefits: [
        'Ahorra $25-40/mes familia',
        'Reduce emisiones metano',
        'Ahorra agua de producción',
        'Menos basura: 30% residuos es comida',
        'Mejor planificación compras',
        'Más espacio refrigerador',
      ],
      howTo: [
        '1. Planifica menú semanal',
        '2. Lista compras: evita impulsos',
        '3. FIFO: primero en entrar, primero salir',
        '4. Porciones correctas: 150-200g/persona',
        '5. Almacena bien según tipo',
        '6. Congela excedentes',
        '7. Entiende fechas caducidad',
        '8. Compostar restos vegetales',
        '9. Sobras → sopas, tortillas, batidos',
      ],
      stats: 'Familia bota 2 kg/semana. Reducir 70%: ahorra 73 kg/año = $300 + 365 kg CO₂.',
    },
    {
      id: 12,
      category: 'food',
      title: 'Haz Compostaje en Casa',
      impact: 'MEDIO',
      co2Saved: '300 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'flower',
      color: '#8E44AD',
      description: 'Compostar reduce 30% basura y produce abono natural gratis.',
      detailedInfo: 'Residuos orgánicos en relleno generan metano. Compostaje produce CO₂ (menos dañino) y abono rico. 1 kg compost = 1 kg fertilizante químico.',
      benefits: [
        'Reduce basura 30-40%',
        'Abono gratis: $0 vs $10-15/saco',
        'Mejora suelo y retención agua',
        'Plantas más sanas sin químicos',
        'Ahorra agua: tierra retiene 20% más',
        'Educación ambiental niños',
      ],
      howTo: [
        '1. Compostera: compra ($30-80) o DIY',
        '2. SÍ: frutas, verduras, café, cáscaras',
        '3. NO: carne, lácteos, aceites',
        '4. Balance: 2 partes verdes + 1 café',
        '5. Airea: mezcla 2x/semana',
        '6. Humedad: como esponja escurrida',
        '7. Listo en 2-4 meses',
        '8. Usa en huerto, macetas, jardín',
      ],
      stats: 'Familia 8 kg orgánicos/semana. Compostar: 416 kg/año → 150 kg abono → $120 + 300 kg CO₂ ahorrados.',
    },
    {
      id: 13,
      category: 'consume',
      title: 'Rechaza Plásticos de Un Solo Uso',
      impact: 'ALTO',
      co2Saved: '500 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'ban',
      color: '#E74C3C',
      description: 'Ecuatorianos usan 1,500 millones bolsas plástico/año. Solo 8% se recicla.',
      detailedInfo: 'Producción 1 kg plástico emite 6 kg CO₂. Ecuador genera 5,800 ton residuos plásticos diarios. Plástico tarda 100-500 años degradarse.',
      benefits: [
        'Reduce contaminación océanos',
        'Protege vida marina: 100,000 animales mueren',
        'Ahorra dinero: botella reutilizable vs 365/año',
        'Menos toxinas: BPA y ftalatos',
        'Galápagos libre plástico: ejemplo mundial',
        'Incentiva empresas cambiar empaques',
      ],
      howTo: [
        '1. Bolsas reutilizables: 5-10 siempre',
        '2. Botella acero inoxidable',
        '3. Rechaza sorbetes',
        '4. Tuppers vidrio para llevar',
        '5. Cubiertos reutilizables portátiles',
        '6. Compra a granel: envases propios',
        '7. Shampoo sólido: dura 3x más',
        '8. Tela encerada: reemplaza film',
        '9. Pide sin empaques',
      ],
      stats: 'Persona 300 bolsas/año. Eliminar: 3 kg = 18 kg CO₂ + 20 botellas/mes = 14.4 kg/año = 86 kg CO₂ total.',
    },
    {
      id: 14,
      category: 'consume',
      title: 'Compra Ropa Sostenible y Segunda Mano',
      impact: 'ALTO',
      co2Saved: '700 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '$',
      icon: 'shirt',
      color: '#9B59B6',
      description: 'Industria moda: 10% emisiones globales, 20% aguas residuales industriales.',
      detailedInfo: '1 jean requiere 7,500L agua, emite 33 kg CO₂. Fast fashion dura bajo 5 usos. 85% ropa va a basura. Segunda mano reduce impacto 82%.',
      benefits: [
        'Reduce emisiones 82% vs nueva',
        'Ahorra 10,000L agua por prenda',
        '70% más barata: $5-15 vs $20-60',
        'Piezas únicas: estilo personal',
        'Menos químicos en piel',
        'Apoya economía circular',
        'Mayor durabilidad',
      ],
      howTo: [
        '1. Tiendas segunda mano Quito',
        '2. Apps: Wallapop, Facebook Marketplace',
        '3. Swaps ropa con amigas',
        '4. Calidad sobre cantidad',
        '5. Materiales: algodón orgánico, lino',
        '6. Marcas sostenibles Ecuador',
        '7. Repara en vez de desechar',
        '8. Lava menos: ahorra agua',
        '9. Dona/vende lo que no usas',
      ],
      stats: 'Persona compra 35 prendas/año. Reducir 50% + segunda mano: 560 kg CO₂ + $500 ahorrados.',
    },
    {
      id: 15,
      category: 'consume',
      title: 'Repara en Vez de Reemplazar',
      impact: 'MEDIO',
      co2Saved: '450 kg CO₂/año',
      difficulty: 'Media',
      cost: '$',
      icon: 'hammer',
      color: '#F39C12',
      description: 'Reparar extiende vida útil 2-5 años, ahorrando recursos de fabricar nuevo.',
      detailedInfo: 'Fabricar smartphone emite 80 kg CO₂. Laptop: 350 kg. Reparar pantalla rota ($80-150) vs nuevo ($500-1,500) ahorra 90% emisiones.',
      benefits: [
        'Ahorra 70-90% vs comprar nuevo',
        'Reduce basura electrónica: 50 millones ton/año',
        'Recupera aparatos con valor sentimental',
        'Aprende habilidades útiles',
        'Apoya talleres locales',
        'Menos extracción minerales raros',
      ],
      howTo: [
        '1. Diagnóstico: YouTube tutoriales',
        '2. Herramientas básicas necesarias',
        '3. Repuestos: Mercado Libre, locales',
        '4. Talleres especializados',
        '5. Comunidades: Repair Cafés Quito',
        '6. Compra reparable: verifica iFixit',
        '7. Exige garantías legales',
        '8. Upgrade: RAM, SSD en vez de nueva',
      ],
      stats: 'Reparar laptop ($150) vs nueva ($800): $650 + 300 kg CO₂. Celular 2 años más: 80 kg CO₂.',
    },
    {
      id: 16,
      category: 'consume',
      title: 'Reduce, Reutiliza, Recicla - 5Rs',
      impact: 'MEDIO',
      co2Saved: '600 kg CO₂/año',
      difficulty: 'Media',
      cost: '$',
      icon: 'sync',
      color: '#16A085',
      description: 'Economía circular: 5Rs (Rechazar, Reducir, Reutilizar, Reparar, Reciclar) eliminan residuos.',
      detailedInfo: 'Ecuador genera 5.4 millones ton basura/año. Solo 15% se recicla. Economía circular eliminaría 45% emisiones industriales globales.',
      benefits: [
        'Reduce basura 60-80% hogar',
        'Ahorra $100-200/mes compras',
        'Menos contaminación vertederos',
        'Crea empleos verdes',
        'Conserva recursos naturales',
        'Aire y agua más limpios',
      ],
      howTo: [
        '1. RECHAZAR: bolsas, sorbetes, samples',
        '2. REDUCIR: compra solo necesario',
        '3. REUTILIZAR: frascos, bolsas, ropa',
        '4. REPARAR: arregla antes desechar',
        '5. RECICLAR: último recurso',
        '6. Separación: orgánicos, reciclables',
        '7. Limpios y secos para reciclar',
        '8. Recicladores base: entrega directa',
        '9. Puntos verdes en supermercados',
      ],
      stats: 'Familia 1.2 kg basura/día. Aplicar 5Rs reduce a 0.4 kg: 290 kg/año = 580 kg CO₂ + $1,200.',
    },
    {
      id: 17,
      category: 'community',
      title: 'Participa en Reforestación Local',
      impact: 'ALTO',
      co2Saved: '1,000 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '',
      icon: 'leaf',
      color: '#27AE60',
      description: '1 árbol captura 22 kg CO₂/año. Plantar 50 árboles compensa tu huella anual.',
      detailedInfo: 'Ecuador perdió 2 millones hectáreas bosques 2000-2020. Árbol nativo captura más CO₂, vive 50-200 años. Iniciativa Crea Bosques planta millones.',
      benefits: [
        'Captura CO₂: árbol maduro 22 kg/año',
        'Protege fuentes agua',
        'Previene deslaves y erosión',
        'Hábitat vida silvestre',
        'Regula temperatura: 2-8°C más fresco',
        'Conecta con naturaleza',
        'Legado generaciones',
      ],
      howTo: [
        '1. ONGs: Acción Ecológica, Crea Bosques',
        '2. Jornadas fines de semana',
        '3. Especies nativas según zona',
        '4. Época: temporada lluvias',
        '5. Técnica: hoyo profundo, riego',
        '6. Monitoreo primeros 2 años',
        '7. Organiza con escuelas',
        '8. Adopta árbol: $5-25 anual',
      ],
      stats: 'Jornada 50 personas plantan 500 árboles. Capturan 11 ton CO₂/año. En 20 años: 220 toneladas.',
    },
    {
      id: 18,
      category: 'community',
      title: 'Educación Climática en tu Entorno',
      impact: 'MEDIO',
      co2Saved: '200 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '',
      icon: 'school',
      color: '#3498DB',
      description: 'Educar multiplica impacto. 1 persona educa 10, esas 10 educan 100. Efecto exponencial.',
      detailedInfo: 'Solo 40% ecuatorianos conocen cambio climático. Personas informadas reducen 30% su huella. Jóvenes son agentes cambio potentes.',
      benefits: [
        'Multiplica impacto 10-100x',
        'Genera presión social',
        'Niños educan a padres',
        'Crea cultura sostenibilidad',
        'Impulsa políticas públicas',
        'Combate desinformación',
      ],
      howTo: [
        '1. Charlas: escuelas, barrios, trabajo',
        '2. Redes sociales: info verificada',
        '3. Talleres: reciclaje, huertos',
        '4. Documentales: familia ve juntos',
        '5. Juegos niños: eco-quiz',
        '6. Ejemplo: acciones hablan más',
        '7. Grupos WhatsApp: tips semanales',
        '8. Lidera: comité ambiental',
      ],
      stats: 'Educas 10 personas, reducen 20% huella 4 ton = 0.8 ton c/u = 8 ton totales = impacto 2x.',
    },
    {
      id: 19,
      category: 'community',
      title: 'Apoya Empresas Sostenibles',
      impact: 'MEDIO',
      co2Saved: '350 kg CO₂/año',
      difficulty: 'Fácil',
      cost: '',
      icon: 'business',
      color: '#16A085',
      description: 'Tu dinero es tu voto. Empresas B, carbono neutral y comercio justo priorizan planeta.',
      detailedInfo: '100 empresas causan 71% emisiones globales. Consumidores presionan con billetera. Ecuador tiene 15 empresas B certificadas.',
      benefits: [
        'Tu dinero presiona industrias',
        'Impulsa innovación verde',
        'Empleos dignos: paga 30% más',
        'Transparencia impacto ambiental',
        'Calidad superior: duran más',
        'Salud: menos químicos',
      ],
      howTo: [
        '1. Certificaciones: B Corp, Rainforest',
        '2. Apps: Good On You, HowGood',
        '3. Investiga: páginas sostenibilidad',
        '4. Prefiere local: menor huella',
        '5. Exige transparencia',
        '6. Boicot: mal historial ambiental',
        '7. Invierte verde: fondos ESG',
        '8. Reclama mejoras',
      ],
      stats: 'Si 10% consumidores cambian, empresas adaptan. Unilever aumentó línea sostenible 50%.',
    },
    {
      id: 20,
      category: 'community',
      title: 'Voluntariado en ONGs Ambientales',
      impact: 'ALTO',
      co2Saved: '500 kg CO₂/año',
      difficulty: 'Media',
      cost: '',
      icon: 'heart',
      color: '#E74C3C',
      description: 'ONGs protegen 30% áreas naturales Ecuador. Voluntarios son columna vertebral.',
      detailedInfo: 'Ecuador: 82 reservas privadas, cientos ONGs conservando. Voluntarios: monitoreo, educación, reforestación. 1 hora/semana = 50 horas/año.',
      benefits: [
        'Protege ecosistemas críticos',
        'Conoce naturaleza ecuatoriana',
        'Habilidades nuevas',
        'Networking: gente apasionada',
        'Currículum valorado',
        'Satisfacción personal',
      ],
      howTo: [
        '1. ONGs: Fundación Natura, Jocotoco',
        '2. Voluntariado: 4h/semana',
        '3. Áreas: monitoreo, educación',
        '4. Virtual: redes, diseño',
        '5. Turismo voluntario: 1-4 semanas',
        '6. Aporta tu profesión',
        '7. Donaciones: $20-50/mes',
        '8. Jóvenes: grupos scouts',
      ],
      stats: 'Voluntario 4h/semana limpieza: 200h/año × 10 kg basura = 2 ton removidas. Salva vida marina.',
    },
    {
      id: 21,
      category: 'community',
      title: 'Impulsa Políticas Públicas Verdes',
      impact: 'ALTO',
      co2Saved: '10,000+ kg CO₂/año',
      difficulty: 'Media',
      cost: '',
      icon: 'megaphone',
      color: '#9B59B6',
      description: 'Cambio sistémico mayor que acciones individuales. Políticas correctas transforman millones.',
      detailedInfo: 'Acciones individuales importantes pero insuficientes. Necesitamos leyes: subsidios renovables, impuestos carbono, protección bosques.',
      benefits: [
        'Impacto multiplicado millones',
        'Cambio duradero vs individual',
        'Justicia: obliga grandes emisores',
        'Economía verde: empleos',
        'Protege futuras generaciones',
        'Ecuador puede liderar región',
      ],
      howTo: [
        '1. Vota informado: revisa planes',
        '2. Peticiones: Change.org, Avaaz',
        '3. Marchas: protestas pacíficas',
        '4. Cabildos abiertos',
        '5. Cartas: alcaldes, asambleístas',
        '6. Redes: presión pública funciona',
        '7. Medios: cartas al editor',
        '8. Únete: Fridays for Future',
      ],
      stats: 'Petición 50,000 firmas logró prohibir plástico Santa Cruz. Tu firma = cambio sistémico real.',
    },
  ];

  const toggleComplete = (id: number) => {
    setCompletedActions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openActionModal = (action: any) => {
    setSelectedAction(action);
    setModalVisible(true);
  };

  const totalImpact = completedActions.reduce((sum, id) => {
    const action = actions.find(a => a.id === id);
    return sum + (action ? parseInt(action.co2Saved) : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27AE60" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.preTitle}>AndesAlert</Text>
            <Text style={styles.title}>Acciones Sostenibles</Text>
          </View>
          <View style={styles.impactBadge}>
            <Ionicons name="leaf" size={20} color="#fff" />
            <Text style={styles.impactText}>{completedActions.length}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalImpact.toLocaleString()}</Text>
            <Text style={styles.statLabel}>kg CO₂ ahorrados/año</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedActions.length}</Text>
            <Text style={styles.statLabel}>Acciones completadas</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {actions.length} acciones disponibles
        </Text>

        {actions.map(action => {
          const isCompleted = completedActions.includes(action.id);
          return (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, isCompleted && styles.completedCard]}
              onPress={() => openActionModal(action)}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={20} color={action.color} />
                </View>
              </View>

              <View style={styles.cardMiddle}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription} numberOfLines={2}>
                  {action.description}
                </Text>
                
                <View style={styles.badges}>
                  <View style={[styles.badge, styles.impactBadgeSmall, 
                    action.impact === 'ALTO' && { backgroundColor: '#E74C3C' },
                    action.impact === 'MEDIO' && { backgroundColor: '#F39C12' },
                    action.impact === 'BAJO' && { backgroundColor: '#95A5A6' }
                  ]}>
                    <Text style={styles.badgeText}>{action.impact}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Ionicons name="barbell-outline" size={12} color="#666" />
                    <Text style={styles.badgeTextSmall}>{action.difficulty}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTextSmall}>{action.cost}</Text>
                  </View>
                </View>

                <View style={styles.co2Badge}>
                  <Ionicons name="leaf-outline" size={14} color="#27AE60" />
                  <Text style={styles.co2Text}>{action.co2Saved}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleComplete(action.id);
                }}
              >
                <Ionicons 
                  name={isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={isCompleted ? "#27AE60" : "#CCC"} 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { backgroundColor: selectedAction?.color }]}>
              <View style={styles.modalIconBox}>
                <Ionicons name={selectedAction?.icon} size={32} color="#fff" />
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{selectedAction?.title}</Text>
              
              <View style={styles.modalBadges}>
                <View style={[styles.modalBadge, { backgroundColor: selectedAction?.color + '20' }]}>
                  <Ionicons name="leaf" size={16} color={selectedAction?.color} />
                  <Text style={[styles.modalBadgeText, { color: selectedAction?.color }]}>
                    {selectedAction?.co2Saved}
                  </Text>
                </View>
                <View style={styles.modalBadge}>
                  <Ionicons name="flash" size={16} color="#F39C12" />
                  <Text style={styles.modalBadgeText}>{selectedAction?.impact}</Text>
                </View>
                <View style={styles.modalBadge}>
                  <Ionicons name="barbell" size={16} color="#9B59B6" />
                  <Text style={styles.modalBadgeText}>{selectedAction?.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.modalDescription}>{selectedAction?.detailedInfo}</Text>

              <View style={styles.modalSection}>
                <View style={styles.sectionHeaderModal}>
                  <Ionicons name="checkmark-circle" size={22} color="#27AE60" />
                  <Text style={styles.sectionTitleModal}>Beneficios</Text>
                </View>
                {selectedAction?.benefits.map((benefit: string, i: number) => (
                  <Text key={i} style={styles.listItemModal}>• {benefit}</Text>
                ))}
              </View>

              <View style={styles.modalSection}>
                <View style={styles.sectionHeaderModal}>
                  <Ionicons name="list" size={22} color="#3498DB" />
                  <Text style={styles.sectionTitleModal}>Cómo Hacerlo</Text>
                </View>
                {selectedAction?.howTo.map((step: string, i: number) => (
                  <Text key={i} style={styles.listItemModal}>{step}</Text>
                ))}
              </View>

              <View style={[styles.statsBox, { borderLeftColor: selectedAction?.color }]}>
                <Ionicons name="stats-chart" size={20} color={selectedAction?.color} />
                <Text style={styles.statsText}>{selectedAction?.stats}</Text>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: selectedAction?.color }]}
              onPress={() => {
                if (selectedAction) toggleComplete(selectedAction.id);
                setModalVisible(false);
              }}
            >
              <Text style={styles.actionButtonText}>
                {completedActions.includes(selectedAction?.id) 
                  ? '✓ Completada' 
                  : '¡Voy a hacerlo!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8F5' },
  header: {
    backgroundColor: '#27AE60',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  preTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#D5F4E6',
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#fff',
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  impactText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#27AE60',
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1.5,
    borderColor: '#27AE60',
  },
  cardLeft: {
    marginRight: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMiddle: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 3,
  },
  actionDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  impactBadgeSmall: {
    backgroundColor: '#E74C3C',
  },
  badgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    color: '#fff',
  },
  badgeTextSmall: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 9,
    color: '#666',
  },
  co2Badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  co2Text: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#27AE60',
  },
  checkButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#2C3E50',
    marginBottom: 16,
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  modalBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#666',
  },
  modalDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionHeaderModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitleModal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#2C3E50',
  },
  listItemModal: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
  statsBox: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  statsText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 20,
    flex: 1,
  },
  actionButton: {
    margin: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});