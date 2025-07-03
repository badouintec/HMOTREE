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
  
  // Colores por especie
  speciesColors: {
    'Madera Amarilla': '#A4C3B2',
    'Mezquite Dulce': '#8B5A3C', 
    'Tepeguaje': '#6B4E3D',
    'Guajillo': '#9CAF88',
    'Fresno de Arizona': '#4A7C59',
    'Palo Brea': '#F39C12',
    'Encino Negrito': '#2D5016',
    'Trinquete': '#9B59B6',
    'Jaguarcillo': '#6B9080',
    'Palo Verde': '#9CAF88',
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
  // Obtener color por especie
  getSpeciesColor(species) {
    const speciesName = species ? species.split('(')[0].trim() : 'default';
    return APP_CONFIG.speciesColors[speciesName] || APP_CONFIG.speciesColors.default;
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
      }
    };
    
    // Información por defecto si no se encuentra
    const defaultInfo = {
      family: 'No disponible',
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
        avgAge: 0,
        mostCommonSpecies: 'N/A'
      };
    }
    
    const speciesCount = {};
    let totalStormwater = 0;
    let totalEnergy = 0;
    let totalAirPollutants = 0;
    let totalBenefitsValue = 0;
    let totalAge = 0;
    let ageCount = 0;
    
    trees.forEach(tree => {
      const props = tree.properties;
      
      // Contar especies
      const speciesName = Utils.getCommonName(props.species);
      speciesCount[speciesName] = (speciesCount[speciesName] || 0) + 1;
      
      // Obtener dimensiones
      const diameter = props.diameter_cm || 25;
      const height = props.height_m || 6;
      const crownDiameter = props.crown_diameter || (diameter * 0.12);
      
      // Calcular beneficios
      const benefits = this.calculateTreeBenefits(diameter, height, crownDiameter);
      
      totalStormwater += benefits.stormwater.amount;
      totalEnergy += benefits.energy.amount;
      totalAirPollutants += benefits.airPollutants.amount;
      totalBenefitsValue += benefits.totalValue.amount;
      
      // Calcular edad promedio
      const age = Utils.calculateAge(props.planted_year);
      if (age > 0) {
        totalAge += age;
        ageCount++;
      }
    });
    
    const avgAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 8; // Estimado por defecto
    const mostCommonSpecies = Object.keys(speciesCount).reduce((a, b) => 
      speciesCount[a] > speciesCount[b] ? a : b, 'N/A'
    );
    
    return {
      totalTrees: trees.length,
      speciesCount,
      totalStormwater: Math.round(totalStormwater),
      totalEnergy: Math.round(totalEnergy),
      totalAirPollutants: parseFloat(totalAirPollutants.toFixed(1)),
      totalBenefitsValue: parseFloat(totalBenefitsValue.toFixed(2)),
      avgAge,
      mostCommonSpecies
    };
  }
};

// ============================================================================
// GESTOR DEL MAPA
// ============================================================================

const MapManager = {
  /**
   * Inicializar el mapa
   */
  init() {
    console.log('🗺️ Inicializando mapa...');
    
    try {
      // Crear mapa
      AppState.map = L.map('map', {
        center: APP_CONFIG.map.center,
        zoom: APP_CONFIG.map.zoom,
        maxZoom: APP_CONFIG.map.maxZoom,
        minZoom: APP_CONFIG.map.minZoom,
        zoomControl: false
      });
      
      // Añadir tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: APP_CONFIG.map.maxZoom
      }).addTo(AppState.map);
      
      // Controles personalizados
      L.control.zoom({ position: 'bottomright' }).addTo(AppState.map);
      
      // Event listeners
      AppState.map.on('click', this.onMapClick.bind(this));
      
      console.log('✅ Mapa inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando mapa:', error);
      throw error;
    }
  },
  
  /**
   * Cargar árboles en el mapa
   */
  async loadTrees() {
    try {
      console.log('🌳 Cargando datos de árboles...');
      
      const response = await fetch(APP_CONFIG.data.trees);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      
      const geojsonData = await response.json();
      
      if (!geojsonData?.features?.length) {
        throw new Error('No se encontraron datos de árboles válidos');
      }
      
      AppState.treesData = geojsonData.features;
      AppState.filteredTrees = [...AppState.treesData];
      
      this.renderTrees();
      
      // Actualizar estadísticas
      const stats = BenefitsCalculator.calculateAggregateStats(AppState.treesData);
      UI.updateOverviewStats(stats);
      
      console.log(`✅ ${AppState.treesData.length} árboles cargados`);
      
    } catch (error) {
      console.error('❌ Error cargando árboles:', error);
      UI.showError('Error cargando datos de árboles');
    }
  },
  
  /**
   * Renderizar árboles en el mapa
   */
  renderTrees() {
    // Remover capa anterior si existe
    if (AppState.treeLayer) {
      AppState.map.removeLayer(AppState.treeLayer);
    }
    
    // Crear nueva capa
    AppState.treeLayer = L.geoJSON(AppState.filteredTrees, {
      pointToLayer: this.createTreeMarker.bind(this),
      onEachFeature: this.bindTreePopup.bind(this)
    });
    
    AppState.treeLayer.addTo(AppState.map);
  },
  
  /**
   * Crear marcador para un árbol
   */
  createTreeMarker(feature, latlng) {
    const props = feature.properties;
    const diameter = props.diameter_cm || 25;
    const species = props.species || '';
    
    return L.circleMarker(latlng, {
      radius: Math.max(4, Math.min(diameter / 4, 12)),
      fillColor: Utils.getSpeciesColor(species),
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.8,
      className: 'tree-marker'
    });
  },
  
  /**
   * Vincular popup a árbol
   */
  bindTreePopup(feature, layer) {
    const props = feature.properties;
    
    // Calcular beneficios correctamente
    const diameter = props.diameter_cm || 25;
    const height = props.height_m || 6;
    const crownDiameter = props.crown_diameter || (diameter * 0.12);
    const benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crownDiameter);
    
    // Obtener información botánica enriquecida
    const speciesInfo = Utils.getEnrichedSpeciesInfo(props.species);
    const { commonName, scientificName, info } = speciesInfo;
    
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
      AppState.selectedTree = feature;
      console.log('🌳 Árbol seleccionado actualizado:', AppState.selectedTree);
      UI.showTreeDetails(props.id);
    });
  },
  
  /**
   * Manejar click en el mapa
   */
  onMapClick(e) {
    // Si no se hizo click en un árbol, mostrar overview
    if (!e.originalEvent.target.classList.contains('tree-marker')) {
      AppState.selectedTree = null;
      UI.showOverview();
    }
  },
  
  /**
   * Aplicar filtros al mapa
   */
  applyFilters() {
    const { species, size, health, search } = AppState.filters;
    
    AppState.filteredTrees = AppState.treesData.filter(tree => {
      const props = tree.properties;
      
      // Filtro por especie
      if (species && !Utils.getCommonName(props.species).toLowerCase().includes(species.toLowerCase())) {
        return false;
      }
      
      // Filtro por tamaño
      if (size !== 'all') {
        const height = props.height_m || 6;
        if (size === 'small' && height >= 5) return false;
        if (size === 'medium' && (height < 5 || height > 10)) return false;
        if (size === 'large' && height <= 10) return false;
      }
      
      // Filtro por salud
      if (health !== 'all') {
        const treeHealth = (props.health || '').toLowerCase();
        if (health === 'excellent' && !treeHealth.includes('excelente')) return false;
        if (health === 'good' && !treeHealth.includes('buena')) return false;
        if (health === 'fair' && !treeHealth.includes('regular')) return false;
      }
      
      // Filtro por búsqueda
      if (search) {
        const searchTerm = search.toLowerCase();
        const speciesName = Utils.getCommonName(props.species).toLowerCase();
        const scientificName = Utils.getScientificName(props.species).toLowerCase();
        if (!speciesName.includes(searchTerm) && !scientificName.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
    
    this.renderTrees();
    
    // Actualizar estadísticas con datos filtrados
    const stats = BenefitsCalculator.calculateAggregateStats(AppState.filteredTrees);
    UI.updateOverviewStats(stats);
  }
};

// ============================================================================
// GESTOR DE INTERFAZ DE USUARIO
// ============================================================================

const UI = {
  /**
   * Inicializar la interfaz
   */
  init() {
    console.log('🎨 Inicializando interfaz...');
    
    this.setupNavigation();
    this.setupMapControls();
    this.setupSearch();
    this.setupFilters();
    this.setupPanelControls();
    
    // Mostrar overview por defecto
    this.showOverview();
    
    console.log('✅ Interfaz inicializada');
  },
  
  /**
   * Configurar navegación principal
   */
  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        this.showSection(section);
        
        // Actualizar estado activo
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },
  
  /**
   * Configurar controles del mapa
   */
  setupMapControls() {
    // Botón de ubicación
    const locateBtn = document.querySelector('.locate-btn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              AppState.map.setView([latitude, longitude], 16);
            },
            error => {
              console.warn('Geolocalización no disponible:', error);
              this.showError('No se pudo obtener tu ubicación');
            }
          );
        }
      });
    }
    
    // Botón de pantalla completa
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
          document.exitFullscreen();
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
      });
    }
    
    // Toggle del panel
    const panelToggle = document.querySelector('.panel-toggle');
    if (panelToggle) {
      panelToggle.addEventListener('click', this.togglePanel.bind(this));
    }
  },
  
  /**
   * Configurar búsqueda global
   */
  setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('global-search');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        AppState.searchOpen = true;
        setTimeout(() => searchInput.focus(), 100);
      });
    }
    
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        AppState.searchOpen = false;
      });
    }
    
    // Búsqueda en tiempo real
    if (searchInput) {
      const performSearch = Utils.debounce((query) => {
        this.performGlobalSearch(query);
      }, 300);
      
      searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });
    }
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.searchOpen) {
        searchOverlay.classList.remove('active');
        AppState.searchOpen = false;
      }
    });
  },
  
  /**
   * Configurar filtros de exploración
   */
  setupFilters() {
    const speciesSearch = document.getElementById('species-search');
    const sizeFilter = document.getElementById('size-filter');
    const healthFilter = document.getElementById('health-filter');
    
    if (speciesSearch) {
      speciesSearch.addEventListener('input', Utils.debounce((e) => {
        AppState.filters.species = e.target.value;
        MapManager.applyFilters();
      }, 300));
    }
    
    if (sizeFilter) {
      sizeFilter.addEventListener('change', (e) => {
        AppState.filters.size = e.target.value;
        MapManager.applyFilters();
      });
    }
    
    if (healthFilter) {
      healthFilter.addEventListener('change', (e) => {
        AppState.filters.health = e.target.value;
        MapManager.applyFilters();
      });
    }
  },
  
  /**
   * Configurar controles del panel
   */
  setupPanelControls() {
    const panelClose = document.querySelector('.panel-close');
    if (panelClose) {
      panelClose.addEventListener('click', this.togglePanel.bind(this));
    }
  },
  
  /**
   * Mostrar sección específica
   */
  showSection(sectionName) {
    AppState.currentSection = sectionName;
    
    // Ocultar todas las secciones
    document.querySelectorAll('.app-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Mostrar sección solicitada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Lógica específica por sección
    switch (sectionName) {
      case 'map':
        setTimeout(() => {
          if (AppState.map) {
            AppState.map.invalidateSize();
          }
        }, 300);
        break;
        
      case 'explore':
        this.populateTreesGrid();
        break;
        
      case 'benefits':
        this.renderBenefitsCharts();
        break;
    }
  },
  
  /**
   * Toggle del panel lateral
   */
  togglePanel() {
    const panel = document.querySelector('.info-panel');
    AppState.panelOpen = !AppState.panelOpen;
    
    if (AppState.panelOpen) {
      panel.style.transform = 'translateX(0)';
    } else {
      panel.style.transform = 'translateX(-100%)';
    }
  },
  
  /**
   * Mostrar vista general (overview)
   */
  showOverview() {
    document.getElementById('panel-title').textContent = 'Estadísticas del Bosque Urbano';
    
    // Mostrar vista de overview
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
    this.updateElement('stormwater-total', `${Utils.formatNumber(stats.totalStormwater)} gallons`);
    this.updateElement('stormwater-value', Utils.formatCurrency(stats.totalStormwater * 0.01));
    
    this.updateElement('energy-total', `${Utils.formatNumber(stats.totalEnergy)} kWh`);
    this.updateElement('energy-value', Utils.formatCurrency(stats.totalEnergy * 0.126));
    
    this.updateElement('air-total', `${stats.totalAirPollutants} pounds`);
    this.updateElement('air-value', Utils.formatCurrency(stats.totalAirPollutants * 5.15));
    
    this.updateElement('total-annual-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    
    // Actualizar especies comunes
    this.updateCommonSpecies(stats.speciesCount);
  },
    this.updateElement('total-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    /
    // Beneficios específicos
    this.updateElement('stormwater-total', `${Utils.formatNumber(stats.totalStormwater)} gallons`);
    this.updateElement('stormwater-value', Utils.formatCurrency(stats.totalStormwater * 0.01));
    // Información básica
    this.updateElement('energy-total', `${Utils.formatNumber(stats.totalEnergy)} kWh`);
    this.updateElement('energy-value', Utils.formatCurrency(stats.totalEnergy * 0.126));
    this.updateElement('tree-scientific-name', Utils.getScientificName(props.species));
    this.updateElement('air-total', `${stats.totalAirPollutants} pounds`);
    this.updateElement('air-value', Utils.formatCurrency(stats.totalAirPollutants * 5.15));
    // Foto - usar primero la URL del árbol específico, luego la configuración por especie
    this.updateElement('total-annual-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    const speciesName = Utils.getCommonName(props.species);
    // Actualizar especies comunesetScientificName(props.species);
    this.updateCommonSpecies(stats.speciesCount);
  },if (treeImage) {
      // Crear array de URLs con fallbacks
  /** const imageUrls = [];
   * Actualizar contenido del árbol seleccionado
   */ // 1. URL específica del árbol
  updateTreeContent(tree) {& props.photo_url.trim() !== '') {
    const props = tree.properties;_url);
      }
    // Información básica
    this.updateElement('tree-id-badge', props.id);
    this.updateElement('tree-species-name', Utils.getCommonName(props.species));
    this.updateElement('tree-scientific-name', Utils.getScientificName(props.species));
    this.updateElement('tree-location', this.generateAddress());
      
    // Foto - usar primero la URL del árbol específico, luego la configuración por especie
    const treeImage = document.getElementById('tree-image');
    const speciesName = Utils.getCommonName(props.species);ame]);
    const scientificName = Utils.getScientificName(props.species);
      
    if (treeImage) {defecto
      // Crear array de URLs con fallbacksash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80');
      const imageUrls = [];
      // Usar el sistema mejorado de carga
      // 1. URL específica del árboleImage, imageUrls[0], imageUrls.slice(1));
      if (props.photo_url && props.photo_url.trim() !== '') {
        imageUrls.push(props.photo_url);
      }
       Detalles del árbol
      // 2. URL por nombre comúnmeter', props.diameter_cm ? `${props.diameter_cm} cm` : 'No disponible');
      if (APP_CONFIG.speciesPhotos[speciesName]) {_m ? `${props.height_m} m` : 'No disponible');
        imageUrls.push(APP_CONFIG.speciesPhotos[speciesName]);{props.crown_diameter} m` : 'No disponible');
      }s.updateElement('tree-year', props.planted_year || 'No disponible');
      is.updateElement('tree-health', props.health || 'No disponible');
      // 3. URL por nombre científico
      if (APP_CONFIG.speciesPhotos[scientificName]) {
        imageUrls.push(APP_CONFIG.speciesPhotos[scientificName]);
      }st height = props.height_m || 6;
      nst crownDiameter = props.crown_diameter || (diameter * 0.12);
      // 4. URL por defecto
      imageUrls.push('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80');
      nst benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crownDiameter);
      // Usar el sistema mejorado de cargabenefits);
      this.loadImageWithFallback(treeImage, imageUrls[0], imageUrls.slice(1));
      treeImage.alt = `Foto de ${speciesName}`;
    }
    *
    // Detalles del árbols individuales del árbol
    this.updateElement('tree-diameter', props.diameter_cm ? `${props.diameter_cm} cm` : 'No disponible');
    this.updateElement('tree-height', props.height_m ? `${props.height_m} m` : 'No disponible');
    this.updateElement('tree-crown', props.crown_diameter ? `${props.crown_diameter} m` : 'No disponible');
    this.updateElement('tree-year', props.planted_year || 'No disponible');
    this.updateElement('tree-health', props.health || 'No disponible');
    
    // Calcular y mostrar beneficios individuales
    const diameter = props.diameter_cm || 25;edor individual-benefits');
    const height = props.height_m || 6;
    const crownDiameter = props.crown_diameter || (diameter * 0.12);
    
    console.log('🧮 Calculando beneficios para:', { diameter, height, crownDiameter });
    const benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crownDiameter);
    console.log('📊 Beneficios calculados:', benefits);
          <i class="fas fa-tint"></i>
    // Usar setTimeout para asegurar que el DOM esté listo
    setTimeout(() => {nefit-details">
      this.updateIndividualBenefits(benefits);luvia interceptada</div>
    }, 50);div class="benefit-value">${benefits.stormwater.formatted}</div>
  },      <div class="benefit-value-usd">${Utils.formatCurrency(benefits.stormwater.value)}</div>
        </div>
  /** </div>
   * Actualizar beneficios individuales del árbol
   */   <div class="benefit-icon energy">
  updateIndividualBenefits(benefits) {
    console.log('🌳 updateIndividualBenefits llamada con:', benefits);
    const container = document.getElementById('individual-benefits');
    console.log('🔍 Container encontrado:', container);</div>
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
              <div class="tree-card-stat">
                <span class="tree-card-stat-value">${props.height_m || 'N/A'}</span>
                <span class="tree-card-stat-label">metros altura</span>
              </div>
              <div class="tree-card-stat">
                <span class="tree-card-stat-value">${props.diameter_cm || 'N/A'}</span>
                <span class="tree-card-stat-label">cm diámetro</span>
              </div>
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
    // Cambiar a sección mapa
    this.showSection('map');
    
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-section="map"]').classList.add('active');
    
    // Mostrar detalles del árbol
    setTimeout(() => {
      this.showTreeDetails(treeId);
    }, 300);
  },
  
  /**
   * Realizar búsqueda global
   */
  performGlobalSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer || !AppState.treesData) return;
    
    if (!query.trim()) {
      resultsContainer.innerHTML = '<p class="no-results">Escribe para buscar árboles...</p>';
      return;
    }
    
    const searchTerm = query.toLowerCase();
    const results = AppState.treesData.filter(tree => {
      const props = tree.properties;
      const speciesName = Utils.getCommonName(props.species).toLowerCase();
      const scientificName = Utils.getScientificName(props.species).toLowerCase();
      const id = (props.id || '').toLowerCase();
      
      return speciesName.includes(searchTerm) || 
             scientificName.includes(searchTerm) || 
             id.includes(searchTerm);
    }).slice(0, 10); // Limitar a 10 resultados
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
      return;
    }
    
    resultsContainer.innerHTML = results.map(tree => {
      const props = tree.properties;
      return `
        <div class="search-result-item" onclick="UI.selectSearchResult('${props.id}')">
          <div class="result-info">
            <h4>${Utils.getCommonName(props.species)}</h4>
            <p>${Utils.getScientificName(props.species)}</p>
            <span class="result-id">ID: ${props.id}</span>
          </div>
        </div>
      `;
    }).join('');
  },
  
  /**
   * Seleccionar resultado de búsqueda
   */
  selectSearchResult(treeId) {
    // Cerrar búsqueda
    document.getElementById('search-overlay').classList.remove('active');
    AppState.searchOpen = false;
    
    // Mostrar árbol
    this.showTreeFromExplore(treeId);
  },
  
  /**
   * Renderizar gráficos de beneficios
   */
  renderBenefitsCharts() {
    if (!AppState.treesData) return;
    
    const stats = BenefitsCalculator.calculateAggregateStats(AppState.treesData);
    
    // Gráfico de agua de lluvia
    this.createBenefitChart('stormwater-chart', {
      type: 'doughnut',
      data: {
        labels: ['Interceptada', 'Potencial'],
        datasets: [{
          data: [stats.totalStormwater, stats.totalStormwater * 0.3],
          backgroundColor: ['#3182ce', '#e2e8f0']
        }]
      }
    });
    
    // Gráfico de energía
    this.createBenefitChart('energy-chart', {
      type: 'doughnut',
      data: {
        labels: ['Conservada', 'Potencial'],
        datasets: [{
          data: [stats.totalEnergy, stats.totalEnergy * 0.4],
          backgroundColor: ['#ecc94b', '#e2e8f0']
        }]
      }
    });
    
    // Gráfico de calidad del aire
    this.createBenefitChart('air-quality-chart', {
      type: 'doughnut',
      data: {
        labels: ['Removidos', 'Potencial'],
        datasets: [{
          data: [stats.totalAirPollutants, stats.totalAirPollutants * 0.2],
          backgroundColor: ['#805ad5', '#e2e8f0']
        }]
      }
    });
  },
  
  /**
   * Crear gráfico de beneficio
   */
  createBenefitChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    new Chart(canvas, {
      ...config,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  },
  
  /**
   * Generar dirección falsa
   */
  generateAddress() {
    const streets = [
      'Av. Cultura', 'Calle Morelos', 'Blvd. Luis Encinas', 
      'Calle Rosales', 'Av. Universidad', 'Calle Sonora'
    ];
    const number = Math.floor(Math.random() * 500) + 100;
    const street = streets[Math.floor(Math.random() * streets.length)];
    return `${number} ${street}`;
  },
  
  /**
   * Actualizar elemento del DOM
   */
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  },
  
  /**
   * Mostrar error
   */
  showError(message) {
    console.error('🚨 Error:', message);
    // TODO: Implementar notificación de error visual
  }
};

// ============================================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================================

class HermosilloTreeMap {
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      console.log('🚀 Iniciando Hermosillo Tree Map...');
      
      // Verificar dependencias
      if (typeof L === 'undefined') {
        throw new Error('Leaflet no está disponible');
      }
      
      if (typeof Chart === 'undefined') {
        console.warn('Chart.js no disponible - gráficos deshabilitados');
      }
      
      // Inicializar componentes
      await this.initializeComponents();
      
      console.log('✅ Hermosillo Tree Map inicializada correctamente');
      
    } catch (error) {
      console.error('❌ Error crítico inicializando aplicación:', error);
      UI.showError('Error inicializando la aplicación');
    }
  }
  
  async initializeComponents() {
    // Inicializar UI primero
    UI.init();
    
    // Inicializar mapa
    MapManager.init();
    
    // Cargar datos de árboles
    await MapManager.loadTrees();
    
    // Configuración adicional
    this.setupGlobalHandlers();
  }
  
  setupGlobalHandlers() {
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', Utils.debounce(() => {
      if (AppState.map) {
        AppState.map.invalidateSize();
      }
    }, 250));
    
    // Manejar cambios de orientación en móviles
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (AppState.map) {
          AppState.map.invalidateSize();
        }
      }, 100);
    });
  }
}

// ============================================================================
// EXPONER FUNCIONES GLOBALES NECESARIAS
// ============================================================================

// Hacer UI accesible globalmente para eventos onclick
window.UI = UI;

// ============================================================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM cargado, inicializando aplicación...');
  new HermosilloTreeMap();
});

console.log('📝 Script Hermosillo Tree Map cargado');
