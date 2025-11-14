import React, { useState } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,StatusBar,Modal,Dimensions} from 'react-native';
import {useFonts,Poppins_700Bold,Poppins_600SemiBold,Poppins_500Medium,Poppins_400Regular,} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CambioClimaticoScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ 
    title: '', 
    preview: '',
    fullText: '',
    causes: [] as string[],
    consequences: [] as string[],
    solutions: [] as string[],
    actions: [] as string[],
    color: '', 
    stat: '' 
  });

  const openModal = (card: any) => {
    setModalContent({
      title: card.title,
      preview: card.text,
      fullText: card.fullText,
      causes: card.causes,
      consequences: card.consequences,
      solutions: card.solutions,
      actions: card.actions,
      color: card.color,
      stat: card.stat
    });
    setModalVisible(true);
  };

  if (!fontsLoaded) return null;

  const cards = [
    {
      title: "Crisis del CO₂",
      text: "En 2024, el CO₂ atmosférico alcanzó 421 ppm, un nivel no visto en 3 millones de años.",
      fullText: "El dióxido de carbono (CO₂) es el principal gas de efecto invernadero responsable del calentamiento global. Desde la Revolución Industrial, la concentración de CO₂ ha aumentado un 50%, pasando de 280 ppm a 421 ppm en 2024.\n\nEste gas atrapa el calor en la atmósfera, creando un 'efecto invernadero' que eleva las temperaturas globales. Cada año, la humanidad emite 37 mil millones de toneladas de CO₂, principalmente por la quema de combustibles fósiles.",
      causes: [
        "Quema de combustibles fósiles (petróleo, gas, carbón) para energía y transporte",
        "Deforestación masiva: perdemos 10 millones de hectáreas de bosques anuales",
        "Industria ganadera: representa el 14.5% de todas las emisiones globales",
        "Producción de cemento y procesos industriales",
        "Descomposición de residuos en vertederos sin tratamiento"
      ],
      consequences: [
        "Aumento de 1.1°C en temperatura global desde 1880",
        "Derretimiento acelerado de glaciares y capas de hielo polar",
        "Acidificación de océanos: pH ha disminuido 0.1 unidades (30% más ácido)",
        "Eventos climáticos extremos más frecuentes e intensos",
        "Alteración de ecosistemas y pérdida de biodiversidad",
        "Migraciones climáticas: 200 millones de personas desplazadas para 2050"
      ],
      solutions: [
        "Transición a energías 100% renovables (solar, eólica, hidroeléctrica)",
        "Electrificación del transporte: vehículos eléctricos reducen 70% emisiones",
        "Reforestación masiva: plantar 1 billón de árboles puede capturar 205 gigatoneladas de CO₂",
        "Agricultura regenerativa y reducción del consumo de carne",
        "Captura y almacenamiento de carbono (CCS) en industrias",
        "Economía circular: reducir, reutilizar, reciclar"
      ],
      actions: [
        "🚴 Usa bicicleta o transporte público: ahorra 1.5 toneladas de CO₂ al año",
        "💡 Cambia a energía renovable en tu hogar",
        "🌱 Reduce consumo de carne: un día sin carne a la semana ahorra 180 kg CO₂/año",
        "♻️ Recicla y compost: reduce 30% de tu huella de carbono",
        "🌳 Participa en jornadas de reforestación local",
        "📱 Apoya empresas con compromisos carbono-neutral"
      ],
      icon: "cloud-outline",
      color: "#FF6B6B",
      bgColor: "#FFE5E5",
      stat: "421 ppm",
      impact: "Crítico"
    },
    {
      title: "Eventos Extremos",
      text: "Los desastres climáticos han aumentado 500% desde 1970 causando pérdidas millonarias.",
      fullText: "El cambio climático está intensificando eventos meteorológicos extremos en todo el mundo. Huracanes más potentes, sequías prolongadas, inundaciones devastadoras y olas de calor mortales son cada vez más frecuentes.\n\nEn 2023 se registraron 398 desastres naturales que afectaron a 93 millones de personas. América Latina ha experimentado un aumento del 67% en eventos extremos en las últimas dos décadas.",
      causes: [
        "Calentamiento de océanos que alimenta huracanes más intensos",
        "Alteración de patrones de lluvias por cambio en circulación atmosférica",
        "Mayor evaporación que intensifica sequías e inundaciones",
        "Deshielo de glaciares que altera ciclos hidrológicos",
        "Deforestación que reduce capacidad de absorción de agua"
      ],
      consequences: [
        "Pérdidas económicas de $250 mil millones en 2023",
        "Ecuador: inundaciones en costa afectan a 500,000 personas anualmente",
        "Sequías prolongadas reducen producción agrícola hasta 40%",
        "Huracanes categoría 5 han aumentado 25% desde 1980",
        "Olas de calor: temperaturas 5°C sobre promedio causan miles de muertes",
        "Incendios forestales: 4 millones de hectáreas quemadas anualmente en Amazonía"
      ],
      solutions: [
        "Sistemas de alerta temprana: reducen muertes hasta 50%",
        "Infraestructura resiliente: diques, sistemas de drenaje mejorados",
        "Restauración de manglares: protegen costas de huracanes e inundaciones",
        "Gestión sostenible del agua y reservorios",
        "Planes de evacuación y refugios climáticos",
        "Seguros climáticos para agricultores y comunidades vulnerables"
      ],
      actions: [
        "🏠 Prepara kit de emergencia familiar con agua, alimentos no perecederos",
        "📲 Descarga apps de alerta temprana meteorológica",
        "🌊 Apoya proyectos de restauración de manglares",
        "🏘️ Participa en planes comunitarios de gestión de riesgos",
        "💧 Instala sistemas de captación de agua de lluvia",
        "📚 Educa a tu familia sobre protocolos de evacuación"
      ],
      icon: "thunderstorm-outline",
      color: "#9B59B6",
      bgColor: "#F3E5F5",
      stat: "+500%",
      impact: "Severo"
    },
    {
      title: "Colapso Glaciar",
      text: "Los Andes han perdido 30% de sus glaciares desde 1980, amenazando el suministro de agua.",
      fullText: "Los glaciares son reservas críticas de agua dulce que alimentan ríos y proveen agua a millones de personas. El calentamiento global está causando su derretimiento acelerado a un ritmo sin precedentes.\n\nEn Ecuador, glaciares como el Cotopaxi y Chimborazo han perdido más del 40% de su masa. Los Andes tropicales perderán todos sus glaciares pequeños para 2050, afectando el agua de 50 millones de personas.",
      causes: [
        "Aumento de 1.1°C en temperatura global acelera derretimiento",
        "Reducción de albedo: menos hielo refleja menos luz solar",
        "Contaminación de hollín oscurece hielo y absorbe más calor",
        "Cambios en patrones de precipitación: menos nieve, más lluvia",
        "Circulación oceánica alterada eleva temperaturas en polos"
      ],
      consequences: [
        "Antártida pierde 150 mil millones de toneladas de hielo anualmente",
        "Groenlandia: pérdida de 280 mil millones de toneladas/año",
        "Nivel del mar sube 3.3 mm/año, amenaza 600 millones de personas costeras",
        "Quito: 40% del agua proviene de glaciares en riesgo",
        "Escasez de agua en temporada seca afectará agricultura andina",
        "Desaparición de glaciares altera ecosistemas de alta montaña únicos"
      ],
      solutions: [
        "Reducción drástica de emisiones para limitar calentamiento a 1.5°C",
        "Protección de cuencas hidrográficas y páramos",
        "Tecnologías de geo-ingeniería: mantas reflectantes (experimental)",
        "Gestión eficiente del agua: reducir desperdicio y consumo",
        "Reservorios y represas para almacenar agua de deshielo",
        "Monitoreo satelital de glaciares para planificación hídrica"
      ],
      actions: [
        "💧 Reduce consumo de agua: duchas cortas ahorran 60 litros/día",
        "🚰 Repara fugas: una llave goteando desperdicia 30 litros/día",
        "🌾 Apoya agricultura eficiente con riego por goteo",
        "🏔️ Visita glaciares de forma responsable sin dejar huella",
        "📊 Exige a gobiernos políticas de protección de fuentes hídricas",
        "💰 Dona a organizaciones de conservación de glaciares andinos"
      ],
      icon: "snow-outline",
      color: "#3498DB",
      bgColor: "#E3F2FD",
      stat: "-30%",
      impact: "Alarmante"
    },
    {
      title: "Seguridad Alimentaria",
      text: "El cambio climático reduce hasta 30% la producción de cultivos básicos amenazando millones.",
      fullText: "La agricultura es extremadamente vulnerable al cambio climático. Sequías, inundaciones, plagas y cambios en patrones de temperatura están reduciendo rendimientos de cultivos esenciales.\n\nEn Ecuador, cultivos como café, cacao, banano y maíz enfrentan amenazas por sequías y nuevas plagas. Para 2050, 600 millones de personas podrían enfrentar hambruna si no actuamos.",
      causes: [
        "Sequías prolongadas que reducen disponibilidad de agua para riego",
        "Temperaturas extremas dañan polinización y desarrollo de cultivos",
        "Inundaciones y erosión destruyen suelos fértiles",
        "Plagas y enfermedades se expanden a nuevas zonas antes frías",
        "Pérdida de polinizadores: abejas reducidas 40% en algunas regiones",
        "Degradación de suelos por prácticas agrícolas insostenibles"
      ],
      consequences: [
        "Producción de maíz podría caer 24% para 2030",
        "Café arábica: 50% de áreas aptas desaparecerán para 2050",
        "Arroz: rendimiento cae 10% por cada 1°C de aumento temperatura",
        "Ecuador: producción de cacao en riesgo por sequías y moniliasis",
        "Precios de alimentos subirán 20-30% afectando a más pobres",
        "Malnutrición infantil: 12 millones más de niños desnutridos para 2050"
      ],
      solutions: [
        "Agricultura climáticamente inteligente: cultivos resistentes a sequía",
        "Diversificación de cultivos y agroforestería",
        "Riego eficiente por goteo: ahorra 50% de agua",
        "Agricultura regenerativa: recupera salud del suelo",
        "Bancos de semillas para preservar variedades nativas resilientes",
        "Tecnología: drones, sensores IoT para optimizar recursos",
        "Reducir desperdicio: 30% de alimentos se pierden globalmente"
      ],
      actions: [
        "🥗 Consume local y de temporada: reduce huella carbono 50%",
        "🌽 Apoya mercados de agricultores locales",
        "🍂 Haz compost casero: recicla residuos orgánicos",
        "🛒 Compra solo lo necesario: evita desperdicio de alimentos",
        "🌾 Cultiva huerto urbano: vegetales en casa",
        "💚 Elige productos orgánicos y de comercio justo"
      ],
      icon: "leaf-outline",
      color: "#F39C12",
      bgColor: "#FFF3E0",
      stat: "-30%",
      impact: "Urgente"
    },
    {
      title: "Salud en Peligro",
      text: "El calor extremo causa 489,000 muertes anuales y expande enfermedades tropicales.",
      fullText: "El cambio climático es una crisis de salud pública global. El calor extremo, la contaminación del aire, la expansión de enfermedades infecciosas y la inseguridad alimentaria están causando millones de muertes prematuras.\n\nLa OMS proyecta 250,000 muertes adicionales anuales entre 2030-2050 por malnutrición, malaria, diarrea y estrés por calor. Ecuador enfrenta aumento de dengue, malaria y enfermedades respiratorias.",
      causes: [
        "Olas de calor más frecuentes e intensas",
        "Contaminación del aire por quema de combustibles fósiles",
        "Mosquitos vectores se expanden a zonas antes frías",
        "Agua contaminada por inundaciones y escasez",
        "Desnutrición por inseguridad alimentaria",
        "Estrés psicológico por desastres climáticos y pérdida de hogar"
      ],
      consequences: [
        "489,000 muertes anuales por calor extremo",
        "7 millones de muertes por contaminación del aire",
        "Dengue: 100 millones de casos anuales, expansión a nuevas áreas",
        "Malaria: 228 millones de casos, avanza a zonas altas antes libres",
        "Ecuador: casos de dengue aumentaron 300% en última década",
        "Asma y alergias: polen y contaminación afectan 339 millones",
        "Ansiedad climática: 75% jóvenes experimentan estrés por clima"
      ],
      solutions: [
        "Planes de acción de calor: refugios frescos, alertas tempranas",
        "Sistemas de vigilancia epidemiológica mejorados",
        "Control de vectores: fumigación, eliminación de criaderos",
        "Infraestructura de salud resiliente al clima",
        "Acceso universal a agua potable y saneamiento",
        "Programas de salud mental para afectados por desastres",
        "Ciudades verdes: más árboles reducen temperatura 2-8°C"
      ],
      actions: [
        "🌡️ Mantente hidratado en días calurosos: 8-10 vasos agua",
        "🦟 Elimina agua estancada: previene dengue y zika",
        "😷 Usa mascarilla en días de alta contaminación",
        "🏃 Ejercítate temprano o tarde para evitar calor extremo",
        "🏥 Vacúnate contra enfermedades prevenibles",
        "🌳 Planta árboles: cada uno reduce temperatura local 2°C",
        "🧘 Cuida tu salud mental: busca apoyo si sientes eco-ansiedad"
      ],
      icon: "medkit-outline",
      color: "#E74C3C",
      bgColor: "#FFEBEE",
      stat: "489k muertes",
      impact: "Crítico"
    },
    {
      title: "Biodiversidad Amenazada",
      text: "1 millón de especies en riesgo de extinción por cambio climático y destrucción de hábitats.",
      fullText: "Estamos viviendo la sexta extinción masiva. El cambio climático, junto con destrucción de hábitats, está empujando especies a la extinción 1,000 veces más rápido que la tasa natural.\n\nEcuador, uno de los 17 países megadiversos, alberga 10% de especies de plantas del mundo. Sin embargo, 2,000 especies endémicas están amenazadas. La pérdida de biodiversidad afecta servicios ecosistémicos vitales como polinización, agua limpia y regulación climática.",
      causes: [
        "Cambio climático: especies no pueden migrar o adaptarse lo suficientemente rápido",
        "Deforestación: perdemos área del tamaño de Panamá anualmente",
        "Amazonía: cerca de punto de no retorno (20% deforestado)",
        "Contaminación: pesticidas, plásticos, químicos tóxicos",
        "Sobreexplotación: pesca excesiva, caza ilegal, tráfico de especies",
        "Especies invasoras alteran ecosistemas nativos"
      ],
      consequences: [
        "1 millón de 8 millones de especies en riesgo de extinción",
        "Arrecifes de coral: 50% perdido, 90% podría desaparecer para 2050",
        "Amazonía pierde 10,000 km² anuales, podría convertirse en sabana",
        "75% insectos han disminuido en áreas protegidas europeas",
        "Ecuador: 2,000 especies endémicas amenazadas (ranas, orquídeas, aves)",
        "Pérdida de servicios ecosistémicos valuados en $33 billones anuales",
        "Colapso de pesquerías: 90% de stocks pesqueros sobreexplotados"
      ],
      solutions: [
        "Expandir áreas protegidas: 30% de tierra y mar para 2030",
        "Corredores ecológicos conectan hábitats fragmentados",
        "Restauración de ecosistemas: reforestación, regeneración de corales",
        "Agricultura sostenible: reduce presión sobre bosques",
        "Combate al tráfico de especies: leyes más estrictas",
        "Turismo ecológico: genera ingresos para conservación",
        "Monitoreo con tecnología: drones, cámaras trampa, IA"
      ],
      actions: [
        "🐾 Apoya áreas protegidas: visitas, voluntariado, donaciones",
        "🌳 Adopta un árbol o hectárea de bosque",
        "🐝 Crea jardín amigable con polinizadores: flores nativas",
        "🐟 Consume pescado sostenible: verifica certificaciones",
        "🦜 Denuncia tráfico de especies a autoridades",
        "📷 Participa en ciencia ciudadana: registra biodiversidad en apps",
        "♻️ Rechaza productos con aceite de palma no certificado"
      ],
      icon: "fish-outline",
      color: "#16A085",
      bgColor: "#E0F2F1",
      stat: "1M especies",
      impact: "Crítico"
    },
    {
      title: "Economía Climática",
      text: "El cambio climático podría costar 23% del PIB global para 2050 pero la acción genera retornos.",
      fullText: "El cambio climático es la mayor amenaza económica del siglo XXI. Desastres naturales, pérdida de productividad, daños a infraestructura y migraciones forzadas están costando billones.\n\nEcuador pierde $500 millones anuales por eventos climáticos. Sin embargo, la transición a economía verde puede crear 24 millones de empleos globalmente y cada $1 invertido en adaptación genera $4 de retorno.",
      causes: [
        "Daños por desastres naturales: inundaciones, huracanes, sequías",
        "Pérdida de productividad laboral por calor extremo",
        "Degradación de infraestructura: carreteras, puentes, redes eléctricas",
        "Colapso de sectores dependientes del clima: agricultura, pesca, turismo",
        "Costos de salud por enfermedades relacionadas al clima",
        "Migraciones climáticas: 200 millones desplazados para 2050"
      ],
      consequences: [
        "PIB global podría caer 23% para 2050 sin acción climática",
        "Ecuador: pérdidas de $500 millones anuales por eventos extremos",
        "Sequías en África: pérdidas agrícolas de $14 mil millones anuales",
        "Huracanes en Caribe: daños promedio de $60 mil millones/año",
        "Desigualdad: países pobres sufren 80% de pérdidas con 20% de emisiones",
        "Sectores turísticos costeros perderán $1 billón por 2100",
        "Seguros climáticos: primas aumentarán 30-60%"
      ],
      solutions: [
        "Inversión verde: $5 billones anuales en renovables, eficiencia, adaptación",
        "Economía circular: reduce residuos, crea empleos, ahorra recursos",
        "Empleos verdes: 24 millones de nuevos puestos para 2030",
        "Bonos verdes: financian proyectos sostenibles",
        "Impuestos al carbono: incentivan reducción de emisiones",
        "Seguros paramétricos: pagos automáticos tras desastres",
        "Inversión en infraestructura resiliente: cada $1 ahorra $4 en daños"
      ],
      actions: [
        "💼 Busca empleos en sector verde: renovables, eficiencia energética",
        "💰 Invierte en fondos sostenibles o bonos verdes",
        "🏢 Impulsa prácticas sostenibles en tu empresa",
        "🛍️ Apoya negocios locales y economía circular",
        "📊 Exige transparencia climática a empresas",
        "🎓 Capacítate en habilidades verdes: energía solar, agricultura sostenible",
        "🗳️ Vota por políticas económicas climáticamente responsables"
      ],
      icon: "trending-down-outline",
      color: "#D35400",
      bgColor: "#FBE9E7",
      stat: "-23% PIB",
      impact: "Severo"
    },
    {
      title: "Energías Renovables",
      text: "Las renovables son ya la energía más barata y crecen 20% anual. Ecuador tiene 93% electricidad limpia.",
      fullText: "La revolución energética está en marcha. Las energías renovables son ahora más baratas que los combustibles fósiles y su crecimiento es exponencial. Solar y eólica son las fuentes de energía que más rápido crecen en la historia.\n\nEcuador es líder regional con 93% de electricidad proveniente de hidroeléctricas y renovables. La transición completa a renovables para 2040 evitaría 2.5°C de calentamiento global.",
      causes: [
        "Reducción dramática de costos: solar -89%, eólica -70% desde 2010",
        "Innovación tecnológica: baterías más eficientes y baratas",
        "Políticas de apoyo: subsidios, metas de renovables",
        "Presión social: ciudadanos demandan energía limpia",
        "Inversión privada: renovables atraen más capital que fósiles",
        "Urgencia climática: necesidad de descarbonizar rápidamente"
      ],
      consequences: [
        "Renovables generan 29% de electricidad global (2024)",
        "Solar y eólica crecen 20% anual",
        "Ecuador: 93% electricidad limpia (hidroeléctrica principalmente)",
        "Costos: solar $0.03-0.04/kWh vs carbón $0.05-0.15/kWh",
        "China instala más renovables que resto del mundo combinado",
        "Empleos: sector renovable emplea 12 millones globalmente",
        "100% renovables para 2040: evitaríamos 2.5°C calentamiento"
      ],
      solutions: [
        "Acelerar instalación de solar y eólica: necesitamos 10x más",
        "Modernizar redes eléctricas: smart grids, almacenamiento",
        "Baterías de gran escala: almacenan energía para días sin sol/viento",
        "Microrredes comunitarias: energía local y resiliente",
        "Eliminar subsidios a combustibles fósiles: $7 billones anuales",
        "Hidrógeno verde: combustible limpio para industria y transporte",
        "Geotermia y mareomotriz: aprovechar calor terrestre y mareas"
      ],
      actions: [
        "☀️ Instala paneles solares: ahorra 50-80% en electricidad",
        "💡 Cambia a compañía eléctrica 100% renovable",
        "🔋 Usa baterías recargables: elimina pilas desechables",
        "🏠 Mejora eficiencia: aislamiento, ventanas dobles, LED",
        "🌡️ Calentador solar de agua: ahorra 70% energía",
        "📱 Apoya políticas de transición energética",
        "💰 Invierte en cooperativas de energía comunitaria"
      ],
      icon: "sunny-outline",
      color: "#27AE60",
      bgColor: "#E8F5E9",
      stat: "+20% anual",
      impact: "Positivo"
    },
    {
      title: "Acciones que Funcionan",
      text: "Reforestar 900M hectáreas puede absorber 25% del CO₂. Ecuador puede ser carbono neutral para 2050.",
      fullText: "¡Hay esperanza! Sabemos qué hacer y tenemos las herramientas. Reforestación masiva, energía 100% renovable, agricultura regenerativa, economía circular y protección de océanos pueden revertir la crisis climática.\n\nEcuador tiene potencial único: vastos bosques, 93% energía limpia, biodiversidad extraordinaria. Con políticas correctas, puede ser carbono neutral para 2050 y modelo regional de desarrollo sostenible.",
      causes: [
        "Voluntad política creciente: más países comprometidos con carbono neutral",
        "Tecnologías probadas: renovables, captura de carbono, agricultura sostenible",
        "Conciencia ciudadana: 80% de personas preocupadas por clima",
        "Presión corporativa: inversores exigen acción climática",
        "Soluciones basadas en naturaleza: reforestación, restauración",
        "Innovación acelerada: tecnologías limpias más baratas cada año"
      ],
      consequences: [
        "Reforestar 900M hectáreas: absorbería 25% CO₂ atmosférico",
        "Vehículos eléctricos: reducen 70% emisiones vs gasolina",
        "Dieta plant-based: reduce huella personal 73%",
        "Economía circular: eliminaría 39% emisiones industriales",
        "Proteger océanos: capturan 30% CO₂ anual",
        "Ecuador carbono neutral 2050: eliminaría 80M toneladas CO₂/año",
        "Acción global: limitaríamos calentamiento a 1.5°C"
      ],
      solutions: [
        "Reforestación masiva: plantar 1 billón de árboles",
        "Transición energética total: 100% renovables para 2040",
        "Movilidad sostenible: transporte público, bicicletas, eléctricos",
        "Agricultura regenerativa: secuestra carbono en suelo",
        "Economía circular: cero residuos, 100% reutilización",
        "Protección de océanos: 30% áreas marinas protegidas",
        "Educación climática: formar ciudadanos climáticamente conscientes",
        "Finanzas verdes: desinvertir de fósiles, invertir en renovables"
      ],
      actions: [
        "🌳 Planta árboles: participa en jornadas de reforestación",
        "🚗 Cambia a movilidad eléctrica o compartida",
        "🥕 Adopta dieta más vegetal: lunes sin carne",
        "♻️ Practica 5R: rechazar, reducir, reutilizar, reparar, reciclar",
        "💚 Apoya organizaciones climáticas con donaciones o voluntariado",
        "🗳️ Vota por líderes con planes climáticos ambiciosos",
        "📢 Habla del clima: educa a familia, amigos, comunidad",
        "🎯 Calcula tu huella de carbono y compénsala"
      ],
      icon: "checkmark-circle-outline",
      color: "#0A5A32",
      bgColor: "#DFF7E8",
      stat: "2050",
      impact: "Esperanzador"
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5A32" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.preTitle}>AndesAlert</Text>
            <Text style={styles.title}>Cambio Climático</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={22} color="#0A5A32" />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="earth" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>El planeta necesita acción ahora</Text>
          <Text style={styles.heroSubtitle}>
            Datos científicos actualizados sobre la crisis climática y cómo podemos revertirla juntos.
          </Text>
          <View style={styles.heroBadge}>
            <Ionicons name="alert-circle" size={14} color="#FFD700" />
            <Text style={styles.heroBadgeText}>Actualizado 2024</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((c, i) => (
            <View key={i} style={[styles.card, { borderLeftColor: c.color, borderLeftWidth: 4 }]}>
              <View style={[styles.iconBox, { backgroundColor: c.bgColor }]}>
                <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={26} color={c.color} />
              </View>

              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <View style={[styles.impactBadge, { backgroundColor: c.bgColor }]}>
                  <Text style={[styles.impactText, { color: c.color }]}>{c.impact}</Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: c.color }]}>{c.stat}</Text>
              </View>

              <Text style={styles.cardText} numberOfLines={2}>{c.text}</Text>

              <TouchableOpacity
                style={[styles.learnBtn, { backgroundColor: c.bgColor }]}
                onPress={() => openModal(c)}
              >
                <Text style={[styles.learnText, { color: c.color }]}>Leer más</Text>
                <Ionicons name="chevron-forward" size={18} color={c.color} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconBox, { backgroundColor: modalContent.color + '20' }]}>
                <Text style={[styles.modalStat, { color: modalContent.color }]}>
                  {modalContent.stat}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#5A5A5A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{modalContent.title}</Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalIntro}>{modalContent.fullText}</Text>

              {modalContent.causes.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="alert-circle" size={20} color={modalContent.color} />
                    <Text style={[styles.sectionTitle, { color: modalContent.color }]}>
                      ¿Qué lo causa?
                    </Text>
                  </View>
                  {modalContent.causes.map((cause, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{cause}</Text>
                    </View>
                  ))}
                </View>
              )}

              {modalContent.consequences.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="warning" size={20} color="#E74C3C" />
                    <Text style={[styles.sectionTitle, { color: "#E74C3C" }]}>
                      Consecuencias
                    </Text>
                  </View>
                  {modalContent.consequences.map((cons, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{cons}</Text>
                    </View>
                  ))}
                </View>
              )}

              {modalContent.solutions.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="bulb" size={20} color="#F39C12" />
                    <Text style={[styles.sectionTitle, { color: "#F39C12" }]}>
                      Soluciones Globales
                    </Text>
                  </View>
                  {modalContent.solutions.map((sol, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{sol}</Text>
                    </View>
                  ))}
                </View>
              )}

              {modalContent.actions.length > 0 && (
                <View style={[styles.section, styles.actionsSection]}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="hand-right" size={20} color="#27AE60" />
                    <Text style={[styles.sectionTitle, { color: "#27AE60" }]}>
                      ¿Qué puedes hacer TÚ?
                    </Text>
                  </View>
                  {modalContent.actions.map((action, idx) => (
                    <View key={idx} style={styles.actionItem}>
                      <Text style={styles.actionText}>{action}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.modalFooter}>
                <Ionicons name="information-circle-outline" size={16} color="#0A5A32" />
                <Text style={styles.modalFooterText}>
                  Fuentes: ONU, IPCC, NASA, OMS, PNUMA, datos actualizados 2024
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: modalContent.color }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>¡Entendido! Voy a actuar</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FFF9" },
  scroll: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  preTitle: {
    fontFamily: "Poppins_500Medium",
    color: "#0A5A32",
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "#0A5A32",
    fontSize: 28,
  },
  headerBtn: {
    backgroundColor: "#DFF7E8",
    padding: 10,
    borderRadius: 12,
  },
  hero: {
    marginTop: 20,
    backgroundColor: "#0A5A32",
    padding: 20,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
  },
  heroIcon: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    fontSize: 22,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#CFF6E1",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,215,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  heroBadgeText: {
    color: "#FFD700",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    marginLeft: 4,
  },
  grid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#0A3B25",
    flex: 1,
    lineHeight: 18,
  },
  impactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  impactText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
    textTransform: "uppercase",
  },
  statBox: {
    marginBottom: 8,
  },
  statNumber: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    lineHeight: 24,
  },
  cardText: {
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#5A5A5A",
    lineHeight: 16,
  },
  learnBtn: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  learnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.90,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIconBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modalStat: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "Poppins_700Bold",
    color: "#0A5A32",
    fontSize: 24,
    marginBottom: 12,
    lineHeight: 32,
  },
  modalScroll: {
    maxHeight: height * 0.60,
  },
  modalIntro: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#2C2C2C",
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#0A5A32",
    marginRight: 8,
    marginTop: -2,
  },
  listText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#2C2C2C",
    lineHeight: 20,
    flex: 1,
  },
  actionsSection: {
    backgroundColor: "#F0FFF4",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  actionItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#27AE60",
  },
  actionText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#2C2C2C",
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#F0FFF4",
    borderRadius: 10,
  },
  modalFooterText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#0A5A32",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  modalBtn: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginRight: 8,
  },
});