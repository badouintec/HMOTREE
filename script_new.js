// ============================================================================
// HERMOSILLO TREE MAP - APLICACIÓN PROFESIONAL
// Inspirado en NYC Tree Map con funcionalidad moderna
// ============================================================================

console.log('🌳 Iniciando Hermosillo Tree Map Profesional...');

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

const APP_CONFIG = {
  // Configuración del mapa
  map: {
    center: [29.0791825, -110.947542],
    zoom: 17,
    maxZoom: 19,
    minZoom: 12
  },
  
  // URLs y rutas
  data: {
    trees: 'trees_hermosillo.geojson'
  },
  
  // Colores por especie (actualizados para especies nativas de Sonora)
  speciesColors: {
    // Mezquites (tonos marrones/ocres)
    'Mezquite dulce': '#8B4513',
    'Mezquite': '#A0522D', 
    'Mezquite de articulaciones': '#8B5A3C',
    
    // Palos verdes (tonos verdes/dorados)
    'Palo verde azul': '#2E8B57',
    'Palo brea': '#DAA520',
    'Palo verde amarillo': '#9ACD32',
    
    // Acacias (tonos amarillos/dorados)
    'Huizache': '#FFD700',
    'Cucharito': '#F4A460',
    'Acacia de Willard': '#DEB887',
    
    // Palo fierro y especies robustas (tonos oscuros)
    'Palo fierro': '#2F4F4F',
    
    // Ocotillos (tonos rojizos)
    'Ocotillo': '#DC143C',
    'Ocotillo de MacDougal': '#B22222',
    
    // Sauce del desierto (tonos violetas)
    'Sauce del desierto': '#9370DB',
    
    // Leguminosas diversas (tonos verdes)
    'Guaje': '#32CD32',
    'Madera amarilla': '#228B22',
    'Tepeguaje': '#6B8E23',
    
    // Frutales (tonos naranjas/rojos)
    'Ciruelo mexicano': '#FF6347',
    'Frangipani': '#FF69B4',
    
    // Palmas (tonos verdes tropicales)
    'Palma de Brandegee': '#008B8B',
    'Palma de Ures': '#20B2AA',
    'Palma mexicana': '#00CED1',
    
    // Árboles ornamentales (tonos vibrantes)
    'Jícaro': '#8A2BE2',
    'Primavera': '#FF1493',
    'Lapacho rosado': '#FF69B4',
    
    // Especies del desierto (tonos tierra)
    'Trompillo': '#D2691E',
    'Torote blanco': '#F5DEB3',
    'Torote prieto': '#8B4513',
    'Palo santo': '#CD853F',
    
    // Color por defecto
    'default': '#4CAF50'
  },
  
  // Fotos por especie (mejoradas con imágenes específicas de alta calidad)
  speciesPhotos: {
    // Por nombre común
    'Madera Amarilla': 'https://images.unsplash.com/photo-1574263867128-01fd5d7dffdb?w=400&h=300&fit=crop&q=80',
    'Mezquite Dulce': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400&h=300&fit=crop&q=80',
    'Tepeguaje': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&q=80',
    'Guajillo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
    'Fresno de Arizona': 'https://images.unsplash.com/photo-1564417976456-86f72ad3ad3a?w=400&h=300&fit=crop&q=80',
    'Palo Brea': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop&q=80',
    'Encino Negrito': 'https://images.unsplash.com/photo-1567473165131-45c5b3142ff8?w=400&h=300&fit=crop&q=80',
    'Trinquete': 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=300&fit=crop&q=80',
    'Jaguarcillo': 'https://images.unsplash.com/photo-1609686667015-c0ad91b81b3e?w=400&h=300&fit=crop&q=80',
    'Palo Verde': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=300&fit=crop&q=80',
    'Mezquite': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400&h=300&fit=crop&q=80',
    'Palo Fierro': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&q=80',
    'Ocotillo': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&q=80',
    'Ironwood': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&q=80',
    
    // Por nombre científico
    'Lysiloma divaricatum': 'https://images.unsplash.com/photo-1574263867128-01fd5d7dffdb?w=400&h=300&fit=crop&q=80',
    'Prosopis glandulosa': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400&h=300&fit=crop&q=80',
    'Leucaena leucocephala': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&q=80',
    'Acacia farnesiana': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
    'Fraxinus velutina': 'https://images.unsplash.com/photo-1564417976456-86f72ad3ad3a?w=400&h=300&fit=crop&q=80',
    'Parkinsonia florida': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=300&fit=crop&q=80',
    'Olneya tesota': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&q=80',
    'Prosopis velutina': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400&h=300&fit=crop&q=80',
    'Fouquieria splendens': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&q=80'
  },
  
  // Transiciones
  animations: {
    fast: 150,
    normal: 250,
    slow: 350
  }
};

// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================

const AppState = {
  // Componentes del mapa
  map: null,
  treeLayer: null,
  selectedTree: null,
  
  // Datos
  treesData: null,
  filteredTrees: null,
  
  // UI Estado
  currentSection: 'map',
  panelOpen: true,
  searchOpen: false,
  
  // Filtros
  filters: {
    species: '',
    size: 'all',
    health: 'all',
    search: ''
  }
};

// ============================================================================
// UTILIDADES
// ============================================================================

const Utils = {
  // Obtener color por especie con respaldo por familia
  getSpeciesColor(species) {
    const speciesName = species ? species.split('(')[0].trim() : 'default';
    
    // Buscar color específico por nombre común
    if (APP_CONFIG.speciesColors[speciesName]) {
      return APP_CONFIG.speciesColors[speciesName];
    }
    
    // Respaldo: asignar color por familia botánica basado en características
    const scientificName = species ? species.match(/\((.*?)\)/) : null;
    if (scientificName && scientificName[1]) {
      const genus = scientificName[1].split(' ')[0];
      
      // Colores por género/familia
      const genusColors = {
        'Prosopis': '#8B4513',      // Mezquites - marrón
        'Parkinsonia': '#DAA520',   // Palos verdes - dorado  
        'Acacia': '#FFD700',        // Acacias - amarillo
        'Olneya': '#2F4F4F',        // Palo fierro - gris oscuro
        'Fouquieria': '#DC143C',    // Ocotillos - rojo
        'Chilopsis': '#9370DB',     // Sauce del desierto - violeta
        'Leucaena': '#32CD32',      // Guaje - verde lima
        'Lysiloma': '#228B22',      // Madera amarilla - verde bosque
        'Spondias': '#FF6347',      // Ciruelo - tomate
        'Plumeria': '#FF69B4',      // Frangipani - rosa
        'Brahea': '#008B8B',        // Palmas - verde azulado
        'Washingtonia': '#00CED1',  // Palma mexicana - turquesa
        'Sabal': '#20B2AA',         // Palma de Ures - verde mar
        'Crescentia': '#8A2BE2',    // Jícaro - violeta azul
        'Tabebuia': '#FF1493',      // Primavera - rosa profundo
        'Cordia': '#D2691E',        // Trompillo - naranja oscuro
        'Bursera': '#CD853F',       // Torotes - marrón claro
        'Forchhammeria': '#DEB887'  // Palo santo - beige
      };
      
      if (genusColors[genus]) {
        return genusColors[genus];
      }
    }
    
    return APP_CONFIG.speciesColors.default;
  },
  
  // Obtener nombre científico
  getScientificName(species) {
    if (!species) return 'Nombre científico no disponible';
    const match = species.match(/\((.*?)\)/);
    return match ? match[1] : 'Nombre científico no disponible';
  },
  
  // Obtener nombre común
  getCommonName(species) {
    return species ? species.split('(')[0].trim() : 'Especie desconocida';
  },
  
  // Calcular edad del árbol
  calculateAge(plantedYear) {
    const currentYear = new Date().getFullYear();
    return plantedYear ? currentYear - plantedYear : 0;
  },
  
  // Formatear números
  formatNumber(num, decimals = 0) {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },
  
  // Formatear moneda
  formatCurrency(amount, currency = 'USD') {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '$0.00';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error, amount);
      return `$${parseFloat(amount || 0).toFixed(2)}`;
    }
  },
  
  // Debounce para búsquedas
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Sistema mejorado de carga de imágenes con fallbacks
   */
  loadImageWithFallback(imgElement, primaryUrl, fallbackUrls = []) {
    const urls = [primaryUrl, ...fallbackUrls];
    let currentIndex = 0;
    
    // Reset del estado de la imagen
    imgElement.classList.remove('loaded');
    imgElement.style.opacity = '0';
    
    const tryLoadImage = () => {
      if (currentIndex >= urls.length) {
        // Si todas las URLs fallan, mostrar placeholder SVG
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUZGIi8+CjxwYXRoIGQ9Ik0yMDAgMTAwVjIwMCIgc3Ryb2tlPSIjNENBRjUwIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTE1MCAyMDBMMjAwIDE1MEwyNTAgMjAwIiBzdHJva2U9IiM0Q0FGNTAII3N0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEzMCIgcj0iMjAiIGZpbGw9IiM0Q0FGNTAII+CjCl0ZXh0IHg9IjIwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2Njc5OEEiPsOBcmJvbCBVcmJhbm88L3RleHQ+Cjwvc3ZnPgo=';
        imgElement.classList.add('loaded');
        imgElement.style.opacity = '1';
        return;
      }
      
      const currentUrl = urls[currentIndex];
      const testImg = new Image();
      
      testImg.onload = () => {
        imgElement.src = currentUrl;
        imgElement.classList.add('loaded');
        imgElement.style.opacity = '1';
      };
      
      testImg.onerror = () => {
        currentIndex++;
        tryLoadImage();
      };
      
      testImg.src = currentUrl;
    };
    
    tryLoadImage();
  },

  /**
   * Obtener información botánica enriquecida por especie
   */
  getEnrichedSpeciesInfo(species) {
    const commonName = this.getCommonName(species);
    const scientificName = this.getScientificName(species);
    
    // Base de datos de información botánica
    const speciesDB = {
      'Madera Amarilla': {
        family: 'Fabaceae',
        distribution: 'Suroeste de EE.UU., noroeste de México',
        habitat: 'Bosques secos, zonas áridas',
        characteristics: {
          forma: 'Árbol mediano, copa densa',
          hoja: 'Compuesta, bipinnada',
          tronco: 'Corteza lisa, gris claro',
          mantenimiento: 'Bajo'
        },
        observations: [
          'Resistente a sequías prolongadas',
          'Crecimiento moderado en clima urbano',
          'Tolerante a suelos pobres'
        ],
        biodiversity: [
          'Refugio para aves urbanas',
          'Atrae polinizadores nativos',
          'Importante para ecosistema sonorense'
        ]
      },
      'Mezquite Dulce': {
        family: 'Fabaceae',
        distribution: 'Desierto Sonorense, sur de Arizona',
        habitat: 'Zonas áridas urbanas, suelos rocosos',
        characteristics: {
          forma: 'Árbol bajo, copa extendida',
          hoja: 'Bipinnada, verde claro',
          tronco: 'Corteza rugosa, café oscuro',
          mantenimiento: 'Muy bajo'
        },
        observations: [
          'Extremadamente resistente a sequía',
          'Raíces profundas (hasta 50m)',
          'Produce vainas comestibles'
        ],
        biodiversity: [
          'Alimento para fauna desértica',
          'Refugio para reptiles y aves',
          'Especie clave del ecosistema'
        ]
      },
      'Palo Verde': {
        family: 'Fabaceae',
        distribution: 'Desierto Sonorense',
        habitat: 'Lechos de arroyos, bajadas',
        characteristics: {
          forma: 'Árbol mediano, corteza verde',
          hoja: 'Pequeñas, caducas en sequía',
          tronco: 'Verde fotosintético',
          mantenimiento: 'Muy bajo'
        },
        observations: [
          'Fotosíntesis en corteza verde',
          'Pierde hojas en sequía extrema',
          'Floración amarilla espectacular'
        ],
        biodiversity: [
          'Árbol estatal de Arizona',
          'Néctar para abejas nativas',
          'Refugio para aves migratorias'
        ]
      },
      'Fresno de Arizona': {
        family: 'Oleaceae',
        distribution: 'Arizona, Nuevo México, Sonora',
        habitat: 'Cañadas húmedas, zonas riparias',
        characteristics: {
          forma: 'Árbol grande, copa redondeada',
          hoja: 'Compuesta, pinnada, caducifolia',
          tronco: 'Corteza rugosa, café grisáceo',
          mantenimiento: 'Moderado'
        },
        observations: [
          'Excelente sombra en verano',
          'Coloración otoñal amarilla',
          'Requiere riego regular'
        ],
        biodiversity: [
          'Refugio para múltiples especies',
          'Importante para aves migratorias',
          'Conectividad de hábitat urbano'
        ]
      },
      'Encino Negrito': {
        family: 'Fagaceae',
        distribution: 'Montañas del suroeste de EE.UU. y México',
        habitat: 'Bosques de encino, laderas rocosas',
        characteristics: {
          forma: 'Árbol mediano a grande, copa densa',
          hoja: 'Perenne, coriácea, espinosa',
          tronco: 'Corteza rugosa, café oscuro',
          mantenimiento: 'Bajo'
        },
        observations: [
          'Muy resistente a sequía',
          'Crecimiento lento pero longevo',
          'Produce bellotas comestibles'
        ],
        biodiversity: [
          'Ecosistema completo para fauna',
          'Alimento para mamíferos y aves',
          'Especie clave del bosque de encino'
        ]
      },
      'Palo Brea': {
        family: 'Fabaceae',
        distribution: 'Desierto Sonorense y Chihuahuense',
        habitat: 'Planicies áridas, suelos rocosos',
        characteristics: {
          forma: 'Árbol mediano, copa irregular',
          hoja: 'Bipinnada, espinas prominentes',
          tronco: 'Verde, corteza lisa',
          mantenimiento: 'Muy bajo'
        },
        observations: [
          'Floración amarilla vistosa',
          'Extremadamente resistente',
          'Tolerante a suelos pobres'
        ],
        biodiversity: [
          'Refugio para fauna desértica',
          'Néctar importante para polinizadores',
          'Especie pionera en restauración'
        ]
      }
    };
    
    // Información por defecto si no se encuentra
    const defaultInfo = {
      family: 'Fabaceae',
      distribution: 'Región sonorense',
      habitat: 'Zonas áridas urbanas',
      characteristics: {
        forma: 'Árbol urbano adaptado',
        hoja: 'Adaptada al clima árido',
        tronco: 'Resistente',
        mantenimiento: 'Moderado'
      },
      observations: [
        'Adaptado al clima de Hermosillo',
        'Tolerante a condiciones urbanas',
        'Contribuye al bosque urbano'
      ],
      biodiversity: [
        'Refugio para fauna urbana',
        'Mejora calidad del aire',
        'Parte del ecosistema urbano'
      ]
    };
    
    return {
      commonName,
      scientificName,
      info: speciesDB[commonName] || defaultInfo
    };
  }
};

// ============================================================================
// CÁLCULOS DE BENEFICIOS ECOLÓGICOS (U.S. Forest Service)
// ============================================================================

const BenefitsCalculator = {
  /**
   * Calcular beneficios ecológicos según metodología U.S. Forest Service
   * @param {number} diameter_cm - Diámetro en centímetros
   * @param {number} height_m - Altura en metros
   * @param {number} crown_diameter_m - Diámetro de copa en metros
   * @returns {object} Beneficios calculados
   */
  calculateTreeBenefits(diameter_cm, height_m, crown_diameter_m) {
    // Validar y asegurar valores mínimos
    diameter_cm = Math.max(parseFloat(diameter_cm) || 25, 10);
    height_m = Math.max(parseFloat(height_m) || 6, 2);
    crown_diameter_m = Math.max(parseFloat(crown_diameter_m) || (diameter_cm * 0.12), 1);
    
    console.log('Valores validados:', { diameter_cm, height_m, crown_diameter_m });
    
    // Convertir a unidades imperiales (fórmulas del U.S. Forest Service)
    const diameter_inches = diameter_cm * 0.393701;
    const height_feet = height_m * 3.28084;
    const crown_diameter_feet = crown_diameter_m * 3.28084;
    
    // Área de copa en pies cuadrados
    const crown_area_sqft = Math.PI * Math.pow(crown_diameter_feet / 2, 2);
    
    // 1. Stormwater intercepted (galones por año)
    const stormwater_gallons = crown_area_sqft * 0.623; // Factor promedio árboles urbanos
    const stormwater_value = stormwater_gallons * 0.01; // $0.01 por galón
    
    // 2. Energy conserved (kWh por año)  
    const energy_kwh = crown_area_sqft * 0.84 * (height_feet / 30); // Factor escala altura
    const energy_value = energy_kwh * 0.126; // $0.126 por kWh
    
    // 3. Air pollutants removed (libras por año)
    const air_pollutants_lbs = (crown_area_sqft * 0.027) + (diameter_inches * 0.1);
    const air_value = air_pollutants_lbs * 5.15; // $5.15 por libra
    
    // 4. Total Value of Annual Benefits
    const total_value = stormwater_value + energy_value + air_value;
    
    return {
      stormwater: {
        amount: Math.round(stormwater_gallons),
        value: parseFloat(stormwater_value.toFixed(2)),
        unit: 'gallons',
        formatted: `${Utils.formatNumber(stormwater_gallons)} galones`
      },
      energy: {
        amount: Math.round(energy_kwh),
        value: parseFloat(energy_value.toFixed(2)),
        unit: 'kWh',
        formatted: `${Utils.formatNumber(energy_kwh)} kWh`
      },
      airPollutants: {
        amount: parseFloat(air_pollutants_lbs.toFixed(1)),
        value: parseFloat(air_value.toFixed(2)),
        unit: 'pounds',
        formatted: `${air_pollutants_lbs.toFixed(1)} libras`
      },
      totalValue: {
        amount: parseFloat(total_value.toFixed(2)),
        formatted: Utils.formatCurrency(total_value)
      }
    };
  },
  
  /**
   * Calcular estadísticas agregadas del bosque urbano
   * @param {Array} trees - Array de árboles
   * @returns {object} Estadísticas agregadas
   */
  calculateAggregateStats(trees) {
    if (!trees || trees.length === 0) {
      return {
        totalTrees: 0,
        speciesCount: {},
        totalStormwater: 0,
        totalEnergy: 0,
        totalAirPollutants: 0,
        totalBenefitsValue: 0,
        avgTreeAge: 0,
        healthCounts: {}
      };
    }
    
    let totalStormwater = 0;
    let totalEnergy = 0;
    let totalAirPollutants = 0;
    let totalBenefitsValue = 0;
    let totalAge = 0;
    let ageCount = 0;
    
    const speciesCount = {};
    const healthCounts = {};
    
    trees.forEach(tree => {
      const props = tree.properties;
      const species = Utils.getCommonName(props.species);
      const health = props.health || 'No disponible';
      
      // Contar especies
      speciesCount[species] = (speciesCount[species] || 0) + 1;
      
      // Contar estado de salud
      healthCounts[health] = (healthCounts[health] || 0) + 1;
      
      // Calcular beneficios
      const diameter = props.diameter_cm || 25;
      const height = props.height_m || 6;
      const crownDiameter = props.crown_diameter || (diameter * 0.12);
      
      const benefits = this.calculateTreeBenefits(diameter, height, crownDiameter);
      
      totalStormwater += benefits.stormwater.amount;
      totalEnergy += benefits.energy.amount;
      totalAirPollutants += benefits.airPollutants.amount;
      totalBenefitsValue += benefits.totalValue.amount;
      
      // Calcular edad promedio
      if (props.planted_year) {
        totalAge += Utils.calculateAge(props.planted_year);
        ageCount++;
      }
    });
    
    return {
      totalTrees: trees.length,
      speciesCount,
      totalStormwater: Math.round(totalStormwater),
      totalEnergy: Math.round(totalEnergy),
      totalAirPollutants: parseFloat(totalAirPollutants.toFixed(1)),
      totalBenefitsValue: parseFloat(totalBenefitsValue.toFixed(2)),
      avgTreeAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
      healthCounts
    };
  }
};

// ============================================================================
// COMPONENTES PRINCIPALES
// ============================================================================

const Map = {
  /**
   * Inicializar el mapa
   */
  init() {
    console.log('🗺️ Inicializando mapa...');
    
    // Crear mapa base
    AppState.map = L.map('map').setView(APP_CONFIG.map.center, APP_CONFIG.map.zoom);
    
    // Configurar límites
    AppState.map.setMaxZoom(APP_CONFIG.map.maxZoom);
    AppState.map.setMinZoom(APP_CONFIG.map.minZoom);
    
    // Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: APP_CONFIG.map.maxZoom
    }).addTo(AppState.map);
    
    // Event listeners
    AppState.map.on('click', this.onMapClick);
    
    console.log('✅ Mapa inicializado correctamente');
  },
  
  /**
   * Cargar y mostrar árboles en el mapa
   */
  async loadTrees() {
    try {
      console.log('🌳 Cargando datos de árboles...');
      
      const response = await fetch(APP_CONFIG.data.trees);
      const data = await response.json();
      
      AppState.treesData = data.features;
      AppState.filteredTrees = AppState.treesData;
      
      this.renderTrees(AppState.treesData);
      
      // Calcular estadísticas iniciales
      const stats = BenefitsCalculator.calculateAggregateStats(AppState.treesData);
      UI.updateOverviewStats(stats);
      
      console.log(`✅ ${AppState.treesData.length} árboles cargados`);
      
    } catch (error) {
      console.error('❌ Error cargando árboles:', error);
    }
  },
  
  /**
   * Renderizar árboles en el mapa
   */
  renderTrees(trees) {
    // Limpiar capa existente
    if (AppState.treeLayer) {
      AppState.map.removeLayer(AppState.treeLayer);
    }
    
    // Crear nueva capa de árboles
    AppState.treeLayer = L.geoJSON(trees, {
      pointToLayer: (feature, latlng) => {
        return this.createTreeMarker(feature, latlng);
      },
      onEachFeature: this.onEachFeature
    }).addTo(AppState.map);
  },
  
  /**
   * Crear marcador para un árbol
   */
  createTreeMarker(feature, latlng) {
    const props = feature.properties;
    const species = Utils.getCommonName(props.species);
    const color = Utils.getSpeciesColor(props.species);
    
    // Calcular tamaño basado en diámetro (más realista)
    const baseSize = 8;
    const diameter = props.diameter_cm || 25;
    const size = Math.max(baseSize, Math.min(diameter * 0.3, 25));
    
    return L.circleMarker(latlng, {
      radius: size,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7,
      className: 'tree-marker'
    });
  },
  
  /**
   * Configurar eventos para cada árbol
   */
  onEachFeature(feature, layer) {
    const props = feature.properties;
    
    // Obtener información botánica enriquecida
    const speciesInfo = Utils.getEnrichedSpeciesInfo(props.species);
    const { commonName, scientificName, info } = speciesInfo;
    
    // Popup botánico profesional y súper chido
    const popupContent = `
      <div class="tree-popup-botanical">
        <!-- Header con logo institucional -->
        <div class="popup-header-botanical">
          <div class="institutional-logo">
            <i class="fas fa-leaf"></i>
          </div>
          <div class="tree-id-corner">#${props.id}</div>
        </div>
        
        <!-- Nombre científico principal -->
        <div class="species-title-section">
          <h1 class="scientific-name">${scientificName}</h1>
          <div class="common-names">
            <div class="name-row">
              <span class="name-label">Nombre común:</span>
              <span class="name-value">${commonName}</span>
            </div>
          </div>
        </div>
        
        <!-- Información taxonómica -->
        <div class="taxonomic-info">
          <div class="tax-row">
            <span class="tax-label">Familia:</span>
            <span class="tax-value">${info.family}</span>
          </div>
          <div class="tax-row">
            <span class="tax-label">Distribución:</span>
            <span class="tax-value">${info.distribution}</span>
          </div>
          <div class="tax-row">
            <span class="tax-label">Hábitat:</span>
            <span class="tax-value">${info.habitat}</span>
          </div>
        </div>
        
        <!-- Datos generales con iconografía -->
        <div class="general-data-section">
          <div class="section-header-orange">DATOS GENERALES</div>
          <div class="characteristics-grid">
            <div class="char-item">
              <div class="char-icon forma">
                <i class="fas fa-tree"></i>
              </div>
              <span class="char-label">FORMA</span>
            </div>
            <div class="char-item">
              <div class="char-icon hoja">
                <i class="fas fa-leaf"></i>
              </div>
              <span class="char-label">HOJA</span>
            </div>
            <div class="char-item">
              <div class="char-icon trunk">
                <i class="fas fa-grip-lines-vertical"></i>
              </div>
              <span class="char-label">TRONCO</span>
            </div>
            <div class="char-item">
              <div class="char-icon maintenance">
                <i class="fas fa-tools"></i>
              </div>
              <span class="char-label">MANTENIMIENTO</span>
            </div>
          </div>
        </div>
        
        <!-- Usos -->
        <div class="uses-section">
          <div class="uses-grid">
            <div class="use-category">
              <div class="use-header">PAISAJÍSTICOS</div>
              <div class="use-icons">
                <div class="use-line"></div>
                <div class="use-line"></div>
                <div class="use-line"></div>
              </div>
            </div>
            <div class="use-separator"></div>
            <div class="use-category">
              <div class="use-header">COMUNES</div>
              <div class="use-icons">
                <i class="fas fa-utensils"></i>
                <i class="fas fa-plus"></i>
                <i class="fas fa-industry"></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Observaciones y biodiversidad -->
        <div class="observations-section">
          <div class="obs-column">
            <h4>OBSERVACIONES</h4>
            <ul class="obs-list">
              ${info.observations.map(obs => `<li>${obs}</li>`).join('')}
            </ul>
          </div>
          <div class="bio-column">
            <h4>BIODIVERSIDAD</h4>
            <ul class="bio-list">
              ${info.biodiversity.map(bio => `<li>${bio}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <!-- Botón para ver datos técnicos -->
        <div class="popup-action-botanical">
          <button onclick="UI.showTreeDetails('${props.id}')" class="btn-technical-data">
            <i class="fas fa-chart-line"></i>
            Ver Datos Técnicos y Beneficios
          </button>
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 400,
      minWidth: 350,
      className: 'tree-popup-botanical-container',
      closeButton: true,
      autoClose: false,
      closeOnEscapeKey: true,
      autoPan: true,
      keepInView: true
    });
    
    // Click handler para mostrar en panel
    layer.on('click', () => {
      console.log('🖱️ Clic en árbol detectado:', props.id);
      
      // Si el panel está cerrado, abrirlo primero
      if (!AppState.panelOpen) {
        UI.togglePanel();
      }
      
      AppState.selectedTree = feature;
      console.log('🌳 Árbol seleccionado actualizado:', AppState.selectedTree);
      UI.showTreeDetails(props.id);
    });
  },
  
  /**
   * Manejar click en el mapa
   */
  onMapClick(e) {
    console.log('🖱️ Click en mapa detectado:', e);
    console.log('🔍 Panel estado:', AppState.panelOpen);
    
    // Si el panel está cerrado, reabrirlo con vista general
    if (!AppState.panelOpen) {
      console.log('📖 Reabriendo panel desde mapa...');
      UI.togglePanel();
      AppState.selectedTree = null;
      UI.showOverview();
      return;
    }
    
    // Si no se hizo click en un árbol, mostrar overview
    if (!e.originalEvent.target.classList.contains('tree-marker')) {
      console.log('🌐 Mostrando overview - no es árbol');
      AppState.selectedTree = null;
      UI.showOverview();
    }
  }
};

// ============================================================================
// INTERFAZ DE USUARIO
// ============================================================================

const UI = {
  /**
   * Inicializar la interfaz
   */
  init() {
    console.log('🎨 Inicializando interfaz...');
    
    this.setupNavigation();
    this.setupFilters();
    this.setupEventListeners();
    this.showOverview();
    
    console.log('✅ Interfaz inicializada');
  },
  
  /**
   * Configurar navegación
   */
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.showSection(section);
      });
    });
  },
  
  /**
   * Configurar filtros
   */
  setupFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.handleSearch(e.target.value);
      }, 300));
    }
    
    const speciesFilter = document.getElementById('species-filter');
    if (speciesFilter) {
      speciesFilter.addEventListener('change', (e) => {
        this.handleSpeciesFilter(e.target.value);
      });
    }
  },
  
  /**
   * Configurar event listeners adicionales
   */
  setupEventListeners() {
    // Toggle del panel
    const panelToggle = document.querySelector('.panel-toggle');
    if (panelToggle) {
      panelToggle.addEventListener('click', this.togglePanel.bind(this));
    }
    
    // Botón de búsqueda del header
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.showSection('explore');
        // Focus en el input de búsqueda si existe
        setTimeout(() => {
          const searchInput = document.getElementById('species-search');
          if (searchInput) searchInput.focus();
        }, 100);
      });
    }
    
    // Botón de filtro del header
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        this.showSection('explore');
      });
    }
    
    // Cerrar panel
    const panelClose = document.querySelector('.panel-close');
    if (panelClose) {
      panelClose.addEventListener('click', this.togglePanel.bind(this));
    }
  },
  
  /**
   * Mostrar sección específica
   */
  showSection(sectionName) {
    console.log(`📱 Mostrando sección: ${sectionName}`);
    
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionName);
    });
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.app-section').forEach(section => {
      const isTargetSection = section.id === `${sectionName}-section`;
      section.classList.toggle('active', isTargetSection);
      
      // Debug: mostrar qué secciones se están activando/desactivando
      if (isTargetSection) {
        console.log(`✅ Activando sección: ${section.id}`);
      }
    });
    
    AppState.currentSection = sectionName;
    
    // Lógica específica por sección
    if (sectionName === 'explore') {
      this.populateTreesGrid();
    }
    
    // Scroll to top de la nueva sección
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  /**
   * Alternar panel lateral
   */
  togglePanel() {
    const panel = document.querySelector('.info-panel');
    const mapContainer = document.querySelector('.map-container');
    
    if (panel) {
      AppState.panelOpen = !AppState.panelOpen;
      panel.classList.toggle('collapsed', !AppState.panelOpen);
      
      if (mapContainer) {
        mapContainer.classList.toggle('panel-collapsed', !AppState.panelOpen);
      }
      
      // Mostrar/ocultar indicador de reactivación
      this.toggleMapIndicator();
      
      // Invalidar tamaño del mapa después de la transición
      setTimeout(() => {
        if (AppState.map) {
          AppState.map.invalidateSize();
        }
      }, APP_CONFIG.animations.normal);
      
      console.log(AppState.panelOpen ? '📖 Panel abierto' : '📕 Panel cerrado');
    }
  },
  
  /**
   * Mostrar/ocultar indicador en el mapa
   */
  toggleMapIndicator() {
    let indicator = document.querySelector('.map-click-indicator');
    let reopenBtn = document.querySelector('.panel-reopen-btn');
    
    if (!AppState.panelOpen) {
      // Crear indicador si no existe
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'map-click-indicator';
        indicator.innerHTML = `
          <div class="indicator-content">
            <i class="fas fa-mouse-pointer"></i>
            <span>Haz clic en el mapa para reabrir el panel</span>
          </div>
        `;
        document.querySelector('.map-container').appendChild(indicator);
      }
      
      // Crear botón de reapertura si no existe
      if (!reopenBtn) {
        reopenBtn = document.createElement('button');
        reopenBtn.className = 'panel-reopen-btn';
        reopenBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        reopenBtn.title = 'Reabrir panel de información';
        reopenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.togglePanel();
          this.showOverview();
        });
        document.querySelector('.map-container').appendChild(reopenBtn);
      }
      
      // Mostrar con animación
      setTimeout(() => {
        if (indicator) {
          indicator.classList.add('show');
        }
        if (reopenBtn) {
          reopenBtn.classList.add('show');
        }
      }, 300);
      
      // Auto-ocultar indicador después de 3 segundos (pero dejar el botón)
      setTimeout(() => {
        if (indicator && !AppState.panelOpen) {
          indicator.classList.remove('show');
        }
      }, 3000);
    } else {
      // Ocultar indicador y botón
      if (indicator) {
        indicator.classList.remove('show');
        // Remover elemento después de la transición
        setTimeout(() => {
          if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 300);
      }
      if (reopenBtn) {
        reopenBtn.classList.remove('show');
        // Remover elemento después de la transición
        setTimeout(() => {
          if (reopenBtn && reopenBtn.parentNode) {
            reopenBtn.parentNode.removeChild(reopenBtn);
          }
        }, 300);
      }
    }
  },
  
  /**
   * Mostrar vista general
   */
  showOverview() {
    console.log('📊 Mostrando vista general...');
    
    // Actualizar título del panel
    document.getElementById('panel-title').textContent = 'Bosque Urbano de Hermosillo';
    
    // Mostrar vista general
    document.querySelectorAll('.panel-view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById('overview-content').classList.add('active');
    
    // Actualizar estadísticas si hay datos
    if (AppState.treesData) {
      const stats = BenefitsCalculator.calculateAggregateStats(AppState.filteredTrees || AppState.treesData);
      this.updateOverviewStats(stats);
    }
  },
  
  /**
   * Mostrar detalles de un árbol específico
   */
  showTreeDetails(treeId) {
    console.log('🌳 showTreeDetails llamado para:', treeId);
    const tree = AppState.treesData.find(t => t.properties.id === treeId);
    if (!tree) {
      console.error('❌ Árbol no encontrado:', treeId);
      return;
    }
    
    AppState.selectedTree = tree;
    const props = tree.properties;
    
    console.log('🎯 Cambiando a vista de árbol...');
    // Actualizar título del panel
    document.getElementById('panel-title').textContent = Utils.getCommonName(props.species);
    
    // Mostrar vista de árbol
    document.querySelectorAll('.panel-view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById('tree-content').classList.add('active');
    console.log('📋 Panel de árbol activado');
    
    // Actualizar contenido
    this.updateTreeContent(tree);
    
    // Centrar mapa en el árbol
    if (tree.geometry?.coordinates) {
      const [lng, lat] = tree.geometry.coordinates;
      AppState.map.setView([lat, lng], Math.max(AppState.map.getZoom(), 18));
    }
    
    // Verificar que el contenedor de beneficios existe después de actualizar
    setTimeout(() => {
      const benefitsContainer = document.getElementById('individual-benefits');
      console.log('🔍 Verificación post-actualización - Container de beneficios:', benefitsContainer);
      if (benefitsContainer) {
        console.log('✅ Container encontrado después de actualización');
      } else {
        console.error('❌ Container NO encontrado después de actualización');
      }
    }, 100);
  },
  
  /**
   * Actualizar estadísticas generales
   */
  updateOverviewStats(stats) {
    // Estadísticas principales
    this.updateElement('total-trees', Utils.formatNumber(stats.totalTrees));
    this.updateElement('total-species', Utils.formatNumber(Object.keys(stats.speciesCount).length));
    this.updateElement('total-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    
    // Beneficios específicos
    this.updateElement('stormwater-total', `${Utils.formatNumber(stats.totalStormwater)} galones`);
    this.updateElement('stormwater-value', Utils.formatCurrency(stats.totalStormwater * 0.01));
    
    this.updateElement('energy-total', `${Utils.formatNumber(stats.totalEnergy)} kWh`);
    this.updateElement('energy-value', Utils.formatCurrency(stats.totalEnergy * 0.126));
    
    this.updateElement('air-total', `${stats.totalAirPollutants} libras`);
    this.updateElement('air-value', Utils.formatCurrency(stats.totalAirPollutants * 5.15));
    
    this.updateElement('total-annual-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    
    // Actualizar especies comunes
    this.updateCommonSpecies(stats.speciesCount);
  },
  
  /**
   * Actualizar contenido del árbol seleccionado
   */
  updateTreeContent(tree) {
    const props = tree.properties;
    
    // Información básica
    this.updateElement('tree-id-badge', props.id);
    this.updateElement('tree-species-name', Utils.getCommonName(props.species));
    this.updateElement('tree-scientific-name', Utils.getScientificName(props.species));
    this.updateElement('tree-location', this.generateAddress());
    
    // Foto - usar primero la URL del árbol específico, luego la configuración por especie
    const treeImage = document.getElementById('tree-image');
    const speciesName = Utils.getCommonName(props.species);
    const scientificName = Utils.getScientificName(props.species);
    
    if (treeImage) {
      // Crear array de URLs con fallbacks
      const imageUrls = [];
      
      // 1. URL específica del árbol
      if (props.photo_url && props.photo_url.trim() !== '') {
        imageUrls.push(props.photo_url);
      }
      
      // 2. URL por nombre común
      if (APP_CONFIG.speciesPhotos[speciesName]) {
        imageUrls.push(APP_CONFIG.speciesPhotos[speciesName]);
      }
      
      // 3. URL por nombre científico
      if (APP_CONFIG.speciesPhotos[scientificName]) {
        imageUrls.push(APP_CONFIG.speciesPhotos[scientificName]);
      }
      
      // 4. URL por defecto
      imageUrls.push('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop');
      
      // Usar el sistema mejorado de carga
      Utils.loadImageWithFallback(treeImage, imageUrls[0], imageUrls.slice(1));
      treeImage.alt = `Foto de ${speciesName}`;
    }
    
    // Detalles del árbol
    this.updateElement('tree-diameter', props.diameter_cm ? `${props.diameter_cm} cm` : 'No disponible');
    this.updateElement('tree-height', props.height_m ? `${props.height_m} m` : 'No disponible');
    this.updateElement('tree-crown', props.crown_diameter ? `${props.crown_diameter} m` : 'No disponible');
    this.updateElement('tree-year', props.planted_year || 'No disponible');
    this.updateElement('tree-health', props.health || 'No disponible');
    
    // Calcular y mostrar beneficios individuales
    const diameter = props.diameter_cm || 25;
    const height = props.height_m || 6;
    const crownDiameter = props.crown_diameter || (diameter * 0.12);
    
    console.log('🧮 Calculando beneficios para:', { diameter, height, crownDiameter });
    const benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crownDiameter);
    console.log('📊 Beneficios calculados:', benefits);
    
    // Usar setTimeout para asegurar que el DOM esté listo
    setTimeout(() => {
      this.updateIndividualBenefits(benefits);
    }, 50);
  },
  
  /**
   * Actualizar beneficios individuales del árbol
   */
  updateIndividualBenefits(benefits) {
    console.log('🌳 updateIndividualBenefits llamada con:', benefits);
    const container = document.getElementById('individual-benefits');
    console.log('🔍 Container encontrado:', container);
    
    if (!container) {
      console.error('❌ No se encontró el contenedor individual-benefits');
      return;
    }
    
    container.innerHTML = `
      <div class="tree-benefit-item">
        <div class="benefit-icon water">
          <i class="fas fa-tint"></i>
        </div>
        <div class="benefit-details">
          <div class="benefit-label">Agua de lluvia interceptada</div>
          <div class="benefit-value">${benefits.stormwater.formatted}</div>
          <div class="benefit-value-usd">${Utils.formatCurrency(benefits.stormwater.value)}</div>
        </div>
      </div>
      <div class="tree-benefit-item">
        <div class="benefit-icon energy">
          <i class="fas fa-bolt"></i>
        </div>
        <div class="benefit-details">
          <div class="benefit-label">Energía conservada</div>
          <div class="benefit-value">${benefits.energy.formatted}</div>
          <div class="benefit-value-usd">${Utils.formatCurrency(benefits.energy.value)}</div>
        </div>
      </div>
      <div class="tree-benefit-item">
        <div class="benefit-icon air">
          <i class="fas fa-wind"></i>
        </div>
        <div class="benefit-details">
          <div class="benefit-label">Contaminantes del aire removidos</div>
          <div class="benefit-value">${benefits.airPollutants.formatted}</div>
          <div class="benefit-value-usd">${Utils.formatCurrency(benefits.airPollutants.value)}</div>
        </div>
      </div>
      <div class="tree-benefit-item total">
        <div class="total-label"><strong>Valor Total Anual</strong></div>
        <div class="total-value"><strong>${benefits.totalValue.formatted}</strong></div>
      </div>
    `;
    
    console.log('✅ HTML de beneficios actualizado en el contenedor');
  },
  
  /**
   * Actualizar lista de especies comunes
   */
  updateCommonSpecies(speciesCount) {
    const container = document.getElementById('common-species-list');
    if (!container) return;
    
    // Ordenar especies por cantidad
    const sortedSpecies = Object.entries(speciesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5
    
    container.innerHTML = sortedSpecies.map(([species, count]) => `
      <div class="species-item">
        <span class="species-name">${species}</span>
        <span class="species-count">${count}</span>
      </div>
    `).join('');
    
    // Actualizar leyenda de colores después de especies comunes
    this.updateColorLegend(speciesCount);
  },
  
  /**
   * Actualizar leyenda de colores por especies
   */
  updateColorLegend(speciesCount) {
    const container = document.getElementById('species-color-legend');
    if (!container) return;
    
    // Ordenar especies por cantidad y tomar las más relevantes
    const sortedSpecies = Object.entries(speciesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12); // Top 12 para la leyenda
    
    container.innerHTML = sortedSpecies.map(([species, count]) => {
      const color = Utils.getSpeciesColor(species);
      return `
        <div class="legend-item" data-species="${species}">
          <div class="legend-color" style="background-color: ${color}"></div>
          <div class="legend-text">
            <div class="legend-species">${species}</div>
            <div class="legend-count">${count} ejemplar${count !== 1 ? 'es' : ''}</div>
          </div>
        </div>
      `;
    }).join('');
    
    // Agregar eventos de hover para resaltar en el mapa
    container.querySelectorAll('.legend-item').forEach(item => {
      const species = item.dataset.species;
      
      item.addEventListener('mouseenter', () => {
        this.highlightSpeciesOnMap(species);
      });
      
      item.addEventListener('mouseleave', () => {
        this.removeHighlightFromMap();
      });
      
      item.addEventListener('click', () => {
        this.filterBySpecies(species);
      });
    });
  },
  
  /**
   * Resaltar especie en el mapa
   */
  highlightSpeciesOnMap(species) {
    if (!AppState.treeLayer) return;
    
    AppState.treeLayer.eachLayer(layer => {
      const treeSpecies = Utils.getCommonName(layer.feature.properties.species);
      if (treeSpecies === species) {
        layer.setStyle({
          radius: layer.options.radius * 1.3,
          weight: 4,
          opacity: 1,
          fillOpacity: 0.9
        });
      } else {
        layer.setStyle({
          radius: layer.options.radius * 0.8,
          weight: 1,
          opacity: 0.4,
          fillOpacity: 0.3
        });
      }
    });
  },
  
  /**
   * Remover resaltado del mapa
   */
  removeHighlightFromMap() {
    if (!AppState.treeLayer) return;
    
    AppState.treeLayer.eachLayer(layer => {
      // Restaurar estilos originales
      const props = layer.feature.properties;
      const color = Utils.getSpeciesColor(props.species);
      const diameter = props.diameter_cm || 25;
      const size = Math.max(8, Math.min(diameter * 0.3, 25));
      
      layer.setStyle({
        radius: size,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.7
      });
    });
  },
  
  /**
   * Filtrar por especie desde la leyenda
   */
  filterBySpecies(species) {
    AppState.filters.species = species;
    MapController.filterTrees();
    
    // Actualizar selector si existe
    const speciesSelect = document.getElementById('species-filter');
    if (speciesSelect) {
      speciesSelect.value = species;
    }
  },
  
  /**
   * Actualizar elemento del DOM de forma segura
   */
  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  },
  
  /**
   * Generar dirección ficticia para el árbol
   */
  generateAddress() {
    const streets = [
      'Blvd. Luis Encinas Johnson',
      'Calle Rosales',
      'Av. Solidaridad',
      'Calle Serdán',
      'Blvd. Navarrete'
    ];
    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    return `${randomStreet} ${randomNumber}, Hermosillo, Sonora`;
  },
  
  /**
   * Manejar búsqueda
   */
  handleSearch(query) {
    AppState.filters.search = query.toLowerCase();
    this.applyFilters();
  },
  
  /**
   * Manejar filtro de especies
   */
  handleSpeciesFilter(species) {
    AppState.filters.species = species;
    this.applyFilters();
  },
  
  /**
   * Aplicar filtros activos
   */
  applyFilters() {
    if (!AppState.treesData) return;
    
    let filtered = AppState.treesData;
    
    // Filtro de búsqueda
    if (AppState.filters.search) {
      filtered = filtered.filter(tree => {
        const species = tree.properties.species?.toLowerCase() || '';
        const id = tree.properties.id?.toLowerCase() || '';
        return species.includes(AppState.filters.search) || 
               id.includes(AppState.filters.search);
      });
    }
    
    // Filtro de especies
    if (AppState.filters.species && AppState.filters.species !== 'all') {
      filtered = filtered.filter(tree => {
        const commonName = Utils.getCommonName(tree.properties.species);
        return commonName === AppState.filters.species;
      });
    }
    
    AppState.filteredTrees = filtered;
    
    // Actualizar mapa y estadísticas
    Map.renderTrees(filtered);
    const stats = BenefitsCalculator.calculateAggregateStats(filtered);
    this.updateOverviewStats(stats);
  },
  
  /**
   * Poblar grid de árboles para sección explorar
   */
  populateTreesGrid() {
    const grid = document.getElementById('trees-grid');
    if (!grid || !AppState.treesData) return;
    
    const trees = AppState.filteredTrees || AppState.treesData;
    
    grid.innerHTML = trees.slice(0, 50).map(tree => {
      const props = tree.properties;
      const speciesName = Utils.getCommonName(props.species);
      const photoUrl = APP_CONFIG.speciesPhotos[speciesName] || 
                       'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
      
      return `
        <div class="tree-card" onclick="UI.showTreeFromExplore('${props.id}')">
          <img src="${photoUrl}" alt="${speciesName}" class="tree-card-image">
          <div class="tree-card-content">
            <h3 class="tree-card-title">${speciesName}</h3>
            <p class="tree-card-subtitle">${Utils.getScientificName(props.species)}</p>
            <div class="tree-card-stats">
              <span class="stat">
                <i class="fas fa-ruler"></i>
                ${props.diameter_cm || '--'} cm
              </span>
              <span class="stat">
                <i class="fas fa-arrows-alt-v"></i>
                ${props.height_m || '--'} m
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },
  
  /**
   * Mostrar árbol desde sección explorar
   */
  showTreeFromExplore(treeId) {
    // Asegurar que el panel esté abierto
    if (!AppState.panelOpen) {
      this.togglePanel();
    }
    
    // Cambiar a la sección del mapa
    this.showSection('map');
    
    // Mostrar detalles del árbol después de un pequeño delay
    setTimeout(() => {
      this.showTreeDetails(treeId);
    }, 100);
  }
};

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando aplicación HMOTREE...');
  
  try {
    // Inicializar componentes principales
    Map.init();
    UI.init();
    
    // Cargar datos
    await Map.loadTrees();
    
    console.log('✅ Aplicación HMOTREE iniciada correctamente');
    
  } catch (error) {
    console.error('❌ Error iniciando aplicación:', error);
  }
});

// Exponer funciones globales necesarias
window.UI = UI;
window.Utils = Utils;
window.BenefitsCalculator = BenefitsCalculator;
window.AppState = AppState;
