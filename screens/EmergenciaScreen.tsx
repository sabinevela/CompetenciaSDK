import React, { useState } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,StatusBar,Dimensions,Animated} from 'react-native';
import {useFonts,Poppins_700Bold,Poppins_600SemiBold,Poppins_500Medium,Poppins_400Regular,} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PlanesEmergenciaScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [selectedPlan, setSelectedPlan] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('before');

  if (!fontsLoaded) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const emergencyPlans = [
    {
      title: "Terremotos",
      emoji: "🏚️",
      preview: "Zona sísmica alta",
      description: "Ecuador está en el Cinturón de Fuego del Pacífico. El terremoto de Pedernales (2016) de 7.8 grados dejó 673 fallecidos. La preparación puede salvar tu vida en 30 segundos.",
      beforeSteps: [
        "🏠 Identifica zonas seguras: bajo mesas fuertes, marcos de puertas",
        "🔧 Asegura muebles altos y objetos pesados a las paredes",
        "🚪 Identifica salidas de emergencia y rutas de evacuación",
        "👨‍👩‍👧 Establece punto de reunión familiar fuera de casa",
        "🎒 Prepara mochila de emergencia lista",
        "📱 Guarda números de emergencia (911, 171, 102)",
        "💡 Ten linternas y pilas en lugares accesibles",
        "🔥 Ubica llaves de gas y agua, aprende a cerrarlas",
        "📋 Practica simulacros cada 3 meses"
      ],
      duringSteps: [
        "⚠️ MANTÉN LA CALMA - El pánico causa más accidentes",
        "🏠 DENTRO: Agáchate, Cúbrete, Agárrate bajo mesa fuerte",
        "🚫 NO corras hacia salidas, NO uses elevadores",
        "🪟 Aléjate de ventanas, espejos, objetos que caen",
        "🏢 FUERA: Aléjate de edificios, cables, árboles",
        "🚗 VEHÍCULO: Detente lejos de puentes. Quédate dentro",
        "🏖️ COSTA: Tras sismo fuerte, evacúa a zonas altas (tsunami)",
        "⏱️ Los sismos duran 30-60 segundos. Mantén posición"
      ],
      afterSteps: [
        "✅ Verifica que familia esté bien. Atiende heridos",
        "🚪 Sal con calma usando escaleras (NUNCA elevador)",
        "👁️ Revisa daños: grietas grandes, muros inclinados",
        "🏚️ Si hay daños graves, NO reingreses",
        "🔥 Cierra gas y electricidad si sospechas fugas",
        "📻 Escucha radio oficial, evita rumores",
        "🌊 En costa, permanece en zona alta 24 horas",
        "🚨 Espera réplicas: pueden ocurrir días después",
        "📱 Usa teléfono solo para emergencias reales",
        "🤝 Ayuda a vecinos vulnerables"
      ],
      kit: [
        "💧 Agua: 3L/persona/día x 3 días",
        "🥫 Alimentos no perecederos",
        "🔦 Linterna LED + pilas",
        "📻 Radio portátil",
        "🩹 Botiquín completo",
        "🔋 Powerbank cargado",
        "💵 Dinero efectivo",
        "📄 Documentos en bolsa impermeable",
        "🧥 Ropa + frazada térmica",
        "🧻 Artículos higiene",
        "🔧 Herramientas básicas",
        "👶 Pañales/fórmula si hay bebés",
        "🐕 Comida para mascotas"
      ],
      numbers: [
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "Cruz Roja", number: "171", icon: "medkit" },
        { label: "Bomberos", number: "102", icon: "flame" },
        { label: "Policía", number: "101", icon: "shield" },
        { label: "Defensa Civil", number: "1800-111-112", icon: "people" }
      ],
      tips: [
        "⚠️ Ecuador: 4 zonas sísmicas (muy alta en costa)",
        "🌊 Costas tienen ALTO riesgo de tsunami",
        "🏗️ Edificios pre-2000: normas antisísmicas antiguas",
        "📱 App 'Alerta Sísmica Ecuador' para alertas"
      ],
      color: "#E67E22",
      gradient: ['#E67E22', '#D35400'],
      risk: "MUY ALTO"
    },
    {
      title: "Inundaciones",
      emoji: "🌊",
      preview: "Desastre más frecuente",
      description: "60% de desastres en Ecuador. Costa vulnerable diciembre-mayo. En 2017, inundaciones afectaron a 700,000 personas y $500 millones en pérdidas.",
      beforeSteps: [
        "🗺️ Identifica si vives en zona de riesgo: cerca de ríos, zonas bajas",
        "🏠 Eleva objetos valiosos y documentos a pisos superiores",
        "🔌 Instala válvulas antirretorno en desagües",
        "🚧 Construye barreras con sacos de arena si hay alerta",
        "📦 Kit de emergencia en lugar alto y accesible",
        "🚗 Identifica rutas de evacuación a zonas altas",
        "📱 Suscríbete a alertas de INAMHI",
        "💼 Seguros de hogar actualizados",
        "🌳 NO construyas cerca de ríos"
      ],
      duringSteps: [
        "📻 Sigue instrucciones de autoridades",
        "🏃 Si ordenan evacuación, HAZLO INMEDIATAMENTE",
        "⬆️ Ve a zonas altas. Nunca bajes a sótanos",
        "💡 Desconecta electricidad y cierra gas",
        "🚫 NUNCA camines por agua en movimiento (15cm te tumban)",
        "🚗 NO conduzcas por zonas inundadas (60cm arrastran auto)",
        "🌊 Aléjate de ríos crecidos, puentes, alcantarillas",
        "📱 Conserva batería del celular",
        "🏠 Si quedas atrapado, sube al techo y señaliza"
      ],
      afterSteps: [
        "🏠 NO regreses hasta confirmación oficial",
        "👀 Revisa daños estructurales antes de entrar",
        "💡 NO enciendas luz si hay agua (electrocución)",
        "🧼 Desinfecta todo con cloro",
        "💧 Hierve agua antes de beber",
        "🦟 Elimina agua estancada (dengue, zika)",
        "🍽️ Descarta alimentos que tocaron agua",
        "📸 Documenta daños para seguros",
        "🤢 Busca atención médica si hay heridas o fiebre",
        "🏚️ Usa mascarilla si hay moho"
      ],
      kit: [
        "💧 Agua embotellada 3L/día",
        "🥫 Alimentos + abrelatas",
        "🔦 Linterna impermeable",
        "📻 Radio a pilas",
        "🩹 Botiquín completo",
        "💊 Medicamentos 7 días",
        "🧴 Cloro/pastillas purificadoras",
        "📱 Powerbank",
        "💵 Efectivo",
        "📄 Documentos herméticos",
        "🧥 Ropa impermeable + botas",
        "🎣 Silbato",
        "🪢 Cuerda 10 metros",
        "🧤 Guantes trabajo"
      ],
      numbers: [
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "INAMHI Alertas", number: "02-3971-100", icon: "rainy" },
        { label: "Gestión Riesgos", number: "1800-222-200", icon: "shield-checkmark" },
        { label: "Cruz Roja", number: "171", icon: "medkit" },
        { label: "Defensa Civil", number: "1800-111-112", icon: "people" }
      ],
      tips: [
        "🌊 Costa: máximo riesgo diciembre-mayo",
        "🌀 El Niño intensifica lluvias cada 3-7 años",
        "🏙️ Guayaquil, Babahoyo, Portoviejo: alto riesgo",
        "🚗 30cm agua en movimiento arrastran auto"
      ],
      color: "#3498DB",
      gradient: ['#3498DB', '#2980B9'],
      risk: "ALTO"
    },
    {
      title: "Volcanes",
      emoji: "🌋",
      preview: "7 volcanes activos",
      description: "Ecuador tiene 84 volcanes, 7 activos. Cotopaxi es uno de los más peligrosos del mundo. Tungurahua (1999-2016) evacuó 25,000 personas.",
      beforeSteps: [
        "🗺️ Identifica tu zona: lahares, ceniza, flujos piroclásticos",
        "🎒 Mochila de evacuación lista",
        "😷 Ten mascarillas N95 o tela húmeda",
        "👓 Consigue gafas protectoras para ceniza",
        "🚪 Rutas perpendiculares a cauces de ríos (lahares)",
        "🏠 Refuerza techos: ceniza puede colapsar estructuras",
        "💧 Almacena agua: ceniza contamina fuentes",
        "📱 App IG-EPN para alertas",
        "📻 Radio a pilas para comunicación",
        "🐕 Planifica evacuación de mascotas"
      ],
      duringSteps: [
        "📻 Sigue Instituto Geofísico y autoridades",
        "🏃 Si ordenan evacuación, ve INMEDIATAMENTE",
        "🏠 Si no evacuaron: quédate EN CASA, cierra puertas/ventanas",
        "😷 USA mascarilla o pañuelo húmedo",
        "👓 Protege ojos con gafas",
        "🚗 NO conduzcas: ceniza daña motores",
        "💧 Guarda agua limpia antes que se contamine",
        "🌊 ALÉJATE de ríos: lahares bajan a 80 km/h",
        "🏔️ NO intentes ver erupción de cerca: MORTAL"
      ],
      afterSteps: [
        "🏠 NO regreses sin autorización oficial",
        "🧹 Limpia ceniza con pala, NO agua (endurece)",
        "😷 USA N95 durante limpieza: ceniza tóxica",
        "🏠 Limpia techos urgente: peso colapsa estructura",
        "🚗 NO enciendas auto con ceniza: daña motor",
        "💧 Hierve agua antes de beber",
        "🌾 Cultivos expuestos no son seguros",
        "🐄 Ganado: agua y alimento limpios",
        "👃 Atención médica si hay dificultad respirar",
        "📸 Documenta daños"
      ],
      kit: [
        "😷 Mascarillas N95 (varias)",
        "👓 Gafas protectoras selladas",
        "💧 Agua 5L/persona",
        "🥫 Alimentos 1 semana",
        "🔦 Linterna + pilas",
        "📻 Radio portátil",
        "🩹 Botiquín + inhaladores",
        "📱 Powerbank",
        "🧥 Ropa manga larga",
        "🧤 Guantes trabajo",
        "🥾 Botas cerradas",
        "🧹 Pala, escoba, bolsas",
        "💊 Medicamentos respiratorios",
        "📄 Documentos herméticos"
      ],
      numbers: [
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "Instituto Geofísico", number: "02-250-7144", icon: "analytics" },
        { label: "Gestión Riesgos", number: "1800-222-200", icon: "shield-checkmark" },
        { label: "Bomberos", number: "102", icon: "flame" },
        { label: "INAMHI", number: "02-3971-100", icon: "cloud" }
      ],
      tips: [
        "🌋 Activos: Cotopaxi, Sangay, Tungurahua, Reventador",
        "🌊 Lahares del Cotopaxi llegan a Quito en 60-90 min",
        "☠️ Flujos piroclásticos: 700°C y 400 km/h",
        "⚠️ Cotopaxi: 325,000 personas en zona de riesgo"
      ],
      color: "#E74C3C",
      gradient: ['#E74C3C', '#C0392B'],
      risk: "ALTO"
    },
    {
      title: "Deslizamientos",
      emoji: "⛰️",
      preview: "Sierra en riesgo",
      description: "Segunda causa de muertes por desastres en Ecuador. Topografía montañosa + lluvias + deforestación. En 2022, 16 personas murieron en Quito.",
      beforeSteps: [
        "🏔️ Señales: grietas en suelo, árboles inclinados",
        "🏠 NO construyas en laderas empinadas",
        "🌳 Planta vegetación nativa en laderas",
        "💧 Instala drenajes para agua de lluvia",
        "🚧 Construye muros de contención",
        "👀 Vigila clima: deslaves tras lluvias intensas",
        "📱 Rutas de evacuación alejadas de ladera",
        "🏘️ Contacta autoridades si ves inestabilidad",
        "📋 Plan familiar practicado"
      ],
      duringSteps: [
        "🎧 ESCUCHA: ruidos extraños indican deslave inminente",
        "🏃 EVACÚA hacia zonas altas y lejos de trayectoria",
        "↗️ Corre DIAGONAL HACIA ARRIBA, nunca cuesta abajo",
        "🚫 NO recuperes pertenencias",
        "🚗 Si ves deslave, abandona vehículo y corre",
        "🏠 Si atrapado: refugio tras rocas grandes, árboles gruesos",
        "📢 Grita, usa silbato o celular",
        "⏱️ Alerta: pueden ocurrir deslaves secundarios"
      ],
      afterSteps: [
        "🏚️ NO regreses hasta confirmación oficial",
        "👀 Busca atrapados pero NO te arriesgues",
        "🚨 Reporta a ECU 911 inmediatamente",
        "💧 Evita agua contaminada por lodo",
        "🏗️ Inspección estructural obligatoria",
        "🌧️ Alerta: más lluvias = más deslaves",
        "📸 Documenta daños",
        "🤝 Apoya vecinos",
        "🚧 Colabora en evaluación de riesgos"
      ],
      kit: [
        "🎒 Mochila ligera evacuación",
        "💧 Agua 2L/persona",
        "🍫 Snacks energéticos",
        "🔦 Linterna pequeña",
        "📱 Celular cargado",
        "🆔 Documentos impermeables",
        "💵 Efectivo",
        "🩹 Botiquín básico",
        "🧥 Chamarra impermeable",
        "🎣 Silbato emergencia",
        "🪢 Cuerda 10m",
        "🔪 Navaja multiuso",
        "📻 Radio portátil",
        "😷 Mascarillas polvo"
      ],
      numbers: [
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "Bomberos", number: "102", icon: "flame" },
        { label: "Gestión Riesgos", number: "1800-222-200", icon: "shield-checkmark" },
        { label: "Cruz Roja", number: "171", icon: "medkit" },
        { label: "Policía", number: "101", icon: "shield" }
      ],
      tips: [
        "⛰️ Alto riesgo: Alausí, Azuay, Pichincha, Cotopaxi",
        "🌧️ 80% deslaves en temporada lluviosa",
        "🏗️ Construcciones informales: riesgo 5x mayor",
        "⚠️ Señales: grietas, agua brotando, árboles inclinados"
      ],
      color: "#8B4513",
      gradient: ['#8B4513', '#654321'],
      risk: "ALTO"
    },
    {
      title: "Incendios",
      emoji: "🔥",
      preview: "Temporada seca crítica",
      description: "Temporada seca (junio-septiembre) aumenta incendios 400%. En 2023: 1,200 incendios quemaron 45,000 hectáreas. Amazonía y Galápagos vulnerables.",
      beforeSteps: [
        "🌳 Cortafuegos alrededor de propiedades (10-15m)",
        "🏠 Materiales resistentes al fuego",
        "🌿 Limpia vegetación seca cerca de viviendas",
        "💧 Tanques de agua + sistemas contra incendios",
        "🚫 NO quemes basura en temporada seca",
        "🔥 Extintores funcionales en casa y vehículo",
        "💧 Raciona agua, almacena reservas",
        "🌾 Agricultores: riego eficiente por goteo",
        "🗺️ Identifica refugios y rutas evacuación"
      ],
      duringSteps: [
        "🔥 Si ves incendio: Bomberos 102 INMEDIATO",
        "🏃 Evacúa perpendicular a dirección del fuego",
        "💨 Fuego avanza más rápido cuesta arriba, baja",
        "🏠 Si hay tiempo: cierra puertas, llena bañeras agua",
        "🚗 En auto: ventanas cerradas, luces, despacio",
        "😷 Tela húmeda en nariz y boca",
        "🏠 Si atrapado: zona sin vegetación (camino, arroyo)",
        "🚫 NO intentes apagar incendios grandes solo"
      ],
      afterSteps: [
        "👀 Verifica fuego completamente extinguido",
        "🌳 Cuidado árboles debilitados pueden caer",
        "💨 Evita cenizas, usa N95",
        "💧 Hierve agua contaminada por cenizas",
        "🏠 Inspecciona daños por calor",
        "🌱 Participa en reforestación",
        "🌾 Evalúa pérdidas agrícolas",
        "🐄 Ganado: agua y alimento suplementario",
        "📊 Reporta daños a autoridades"
      ],
      kit: [
        "💧 Agua abundante 5L/día",
        "🧴 Filtros purificadores",
        "😷 Mascarillas N95",
        "🔥 Extintor tipo ABC",
        "👓 Gafas protectoras",
        "🧥 Ropa algodón",
        "🔦 Linterna",
        "📻 Radio pilas",
        "🩹 Botiquín + quemaduras",
        "🗺️ Mapa rutas evacuación",
        "💊 Medicamentos respiratorios",
        "🧯 Manta ignífuga",
        "🪓 Hacha/machete",
        "🧤 Guantes gruesos",
        "📱 Powerbank"
      ],
      numbers: [
        { label: "Bomberos", number: "102", icon: "flame" },
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "Min. Ambiente", number: "1800-426-243", icon: "leaf" },
        { label: "Gestión Riesgos", number: "1800-222-200", icon: "shield-checkmark" },
        { label: "INAMHI", number: "02-3971-100", icon: "cloud" }
      ],
      tips: [
        "🔥 Crítico: junio-septiembre (estiaje)",
        "🌳 Galápagos y Amazonía más vulnerables",
        "⚠️ 70% incendios causados por humanos",
        "💨 Viento aumenta propagación a 20 km/h"
      ],
      color: "#FF4500",
      gradient: ['#FF4500', '#FF6347'],
      risk: "MODERADO-ALTO"
    },
    {
      title: "Tsunamis",
      emoji: "🌊",
      preview: "20 min para evacuar",
      description: "Costa ecuatoriana en riesgo crítico. Último tsunami 1979 (4m altura). Sismos submarinos generan olas gigantes. Esmeraldas, Manabí, Guayas deben evacuar en minutos.",
      beforeSteps: [
        "🗺️ Zona evacuación: 0-10m sobre nivel del mar",
        "⬆️ Localiza zonas altas (30+m) y rutas cercanas",
        "🏃 Practica: llegar a zona segura en 15 minutos",
        "🎒 Mochila evacuación lista y accesible",
        "👨‍👩‍👧 Punto de reunión familiar en zona alta",
        "📱 Alertas de tsunami en celular",
        "🏫 Señales naturales: sismo fuerte + mar retrocede = EVACÚA",
        "🏠 Plan evacuación nocturna con linternas",
        "🚗 Rutas vehiculares Y peatonales a zonas altas"
      ],
      duringSteps: [
        "🌊 SISMO FUERTE = EVACÚA INMEDIATO a zona alta",
        "🏃 NO esperes alerta oficial: 15-30 minutos",
        "⬆️ Ve a PIE si es más rápido",
        "🌊 Mar retrocede = CORRE a zona alta",
        "📱 NO pierdas tiempo con fotos",
        "🏠 Deja TODO, sube mínimo 30m",
        "🚗 Abandona vehículo si hay tráfico",
        "🌳 Arriba: aléjate de ríos (tsunami sube por cauces)",
        "⏱️ Permanece 24 horas (varias olas)",
        "📻 Escucha radio oficial"
      ],
      afterSteps: [
        "⏰ NO bajes hasta declaración oficial (24h mínimo)",
        "🌊 Pueden llegar olas separadas por horas",
        "👀 Verifica daños estructurales",
        "💧 Agua/alimentos contaminados con sal",
        "🏚️ NO entres a edificios dañados",
        "⚡ Evita cables caídos",
        "🦟 Elimina agua estancada",
        "🧼 Desinfecta con cloro",
        "🤢 Atención médica si heridas/diarrea",
        "📸 Documenta daños",
        "🤝 Apoya comunidad"
      ],
      kit: [
        "🎒 Mochila LIGERA para correr",
        "💧 Botella 1L",
        "🍫 Barras energéticas",
        "🔦 Linterna LED pequeña",
        "📱 Celular + powerbank",
        "🆔 Documentos impermeables",
        "💵 Efectivo",
        "🧥 Chamarra impermeable",
        "🩹 Botiquín mini",
        "🎣 Silbato",
        "📻 Radio portátil",
        "😷 Mascarillas",
        "🧤 Guantes",
        "🔑 Copia llaves",
        "📋 Contactos impresos"
      ],
      numbers: [
        { label: "Emergencias", number: "911", icon: "call" },
        { label: "INOCAR Tsunami", number: "04-248-1300", icon: "water" },
        { label: "Gestión Riesgos", number: "1800-222-200", icon: "shield-checkmark" },
        { label: "Armada Ecuador", number: "04-248-5000", icon: "boat" },
        { label: "Cruz Roja", number: "171", icon: "medkit" }
      ],
      tips: [
        "🌊 Alto riesgo: Esmeraldas, Manabí, Santa Elena, Guayas",
        "⏱️ Llegada: 15-30 min tras sismo local",
        "📏 Pueden alcanzar 10+ metros altura",
        "⚠️ Sismo 7+ en océano = RIESGO TSUNAMI"
      ],
      color: "#006994",
      gradient: ['#006994', '#004d6b'],
      risk: "ALTO (COSTA)"
    }
  ];

  const currentPlan = emergencyPlans[selectedPlan];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C0392B" />

      <View style={[styles.header, { backgroundColor: currentPlan.gradient[0] }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.preTitle}>AndesAlert</Text>
            <Text style={styles.title}>Planes de Emergencia</Text>
          </View>
          <TouchableOpacity style={styles.emergencyBtn}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.emergencyText}>911</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {emergencyPlans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                selectedPlan === index && { 
                  backgroundColor: '#fff',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 6,
                }
              ]}
              onPress={() => {
                setSelectedPlan(index);
                setExpandedSection('before');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.tabEmoji}>{plan.emoji}</Text>
              <Text style={[
                styles.tabText,
                selectedPlan === index && { color: plan.color, fontFamily: 'Poppins_700Bold' }
              ]}>
                {plan.title}
              </Text>
              {selectedPlan === index && (
                <View style={[styles.tabIndicator, { backgroundColor: plan.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { 
          borderLeftColor: currentPlan.color,
          borderLeftWidth: 6,
        }]}>
          <View style={styles.heroTop}>
            <Text style={styles.heroEmoji}>{currentPlan.emoji}</Text>
            <View style={[styles.riskBadge, { backgroundColor: currentPlan.color }]}>
              <Ionicons name="warning" size={14} color="#fff" />
              <Text style={styles.riskText}>{currentPlan.risk}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{currentPlan.title}</Text>
          <Text style={styles.heroDescription}>{currentPlan.description}</Text>
        </View>

        <TouchableOpacity
          style={[styles.accordionHeader, { backgroundColor: '#3498DB' }]}
          onPress={() => toggleSection('before')}
        >
          <Text style={styles.accordionTitle}>Antes</Text>
          <Ionicons
            name={expandedSection === 'before' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        {expandedSection === 'before' && (
          <View style={styles.accordionContent}>
            {currentPlan.beforeSteps.map((step, i) => (
              <Text key={i} style={styles.stepText}>• {step}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.accordionHeader, { backgroundColor: '#E67E22' }]}
          onPress={() => toggleSection('during')}
        >
          <Text style={styles.accordionTitle}>Durante</Text>
          <Ionicons
            name={expandedSection === 'during' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        {expandedSection === 'during' && (
          <View style={styles.accordionContent}>
            {currentPlan.duringSteps.map((step, i) => (
              <Text key={i} style={styles.stepText}>• {step}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.accordionHeader, { backgroundColor: '#27AE60' }]}
          onPress={() => toggleSection('after')}
        >
          <Text style={styles.accordionTitle}>Después</Text>
          <Ionicons
            name={expandedSection === 'after' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        {expandedSection === 'after' && (
          <View style={styles.accordionContent}>
            {currentPlan.afterSteps.map((step, i) => (
              <Text key={i} style={styles.stepText}>• {step}</Text>
            ))}
          </View>
        )}

        <Text style={styles.sectionHeader}>Kit recomendado</Text>
        <View style={styles.listBox}>
          {currentPlan.kit.map((item, i) => (
            <Text key={i} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Números de emergencia</Text>
        <View style={styles.listBox}>
          {currentPlan.numbers.map((item, i) => (
            <View key={i} style={styles.numberRow}>
              <Ionicons name={item.icon as any} size={20} color={currentPlan.color} />

              <Text style={styles.numberText}>{item.label}: {item.number}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Tips importantes</Text>
        <View style={styles.listBox}>
          {currentPlan.tips.map((tip, i) => (
            <Text key={i} style={styles.listItem}>• {tip}</Text>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preTitle: { color: '#fff', fontFamily: 'Poppins_500Medium', fontSize: 14 },
  title: { color: '#fff', fontFamily: 'Poppins_700Bold', fontSize: 22 },
  emergencyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#C0392B', padding: 8, borderRadius: 8 },
  emergencyText: { color: '#fff', marginLeft: 6, fontFamily: 'Poppins_600SemiBold' },
  tabsScroll: { marginTop: 16 },
  tabsContainer: { paddingHorizontal: 8 },
  tab: { alignItems: 'center', justifyContent: 'center', marginRight: 12, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  tabEmoji: { fontSize: 24 },
  tabText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: '#fff', marginTop: 4 },
  tabIndicator: { height: 4, width: '100%', borderRadius: 2, marginTop: 4 },
  content: { paddingHorizontal: 16, marginTop: 20 },
  heroCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEmoji: { fontSize: 40 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  riskText: { color: '#fff', marginLeft: 4, fontSize: 12, fontFamily: 'Poppins_600SemiBold' },
  heroTitle: { fontFamily: 'Poppins_700Bold', fontSize: 20, marginTop: 8 },
  heroDescription: { fontFamily: 'Poppins_400Regular', fontSize: 14, marginTop: 4 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginTop: 10 },
  accordionTitle: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  accordionContent: { padding: 12, backgroundColor: '#ecf0f1', borderRadius: 8, marginBottom: 8 },
  stepText: { fontFamily: 'Poppins_400Regular', fontSize: 14, marginBottom: 6 },
  sectionHeader: { fontFamily: 'Poppins_700Bold', fontSize: 16, marginTop: 16, marginBottom: 8 },
  listBox: { paddingLeft: 8 },
  listItem: { fontFamily: 'Poppins_400Regular', fontSize: 14, marginBottom: 4 },
  numberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  numberText: { fontFamily: 'Poppins_500Medium', fontSize: 14, marginLeft: 6 },
});
