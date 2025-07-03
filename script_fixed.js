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
    
    // Popup botánico mejorado (solo información cualitativa)
    const popupContent = `
      <div class="tree-popup-botanical">
        <div class="popup-header">
          <div class="popup-title">${Utils.getCommonName(props.species)}</div>
          <div class="popup-subtitle">${Utils.getScientificName(props.species)}</div>
        </div>
        
        <div class="popup-body">
          <div class="popup-field">
            <span class="field-icon">🏷️</span>
            <span class="field-label">ID del Árbol:</span>
            <span class="field-value">${props.id}</span>
          </div>
          <div class="popup-field">
            <span class="field-icon">🌱</span>
            <span class="field-label">Año de Plantación:</span>
            <span class="field-value">${props.planted_year || 'No disponible'}</span>
          </div>
          <div class="popup-field">
            <span class="field-icon">❤️</span>
            <span class="field-label">Estado de Salud:</span>
            <span class="field-value health-${(props.health || '').toLowerCase()}">${props.health || 'No disponible'}</span>
          </div>
        </div>
        
        <div class="popup-footer">
          <button onclick="UI.showTreeDetails('${props.id}')" class="btn-technical-data">
            📊 Ver Datos Técnicos
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
    document.querySelectorAll('.nav-item').forEach(item => {
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
      panelToggle.addEventListener('click', this.togglePanel);
    }
  },
  
  /**
   * Mostrar sección específica
   */
  showSection(sectionName) {
    console.log(`📱 Mostrando sección: ${sectionName}`);
    
    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionName);
    });
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.app-section').forEach(section => {
      section.classList.toggle('active', section.id === `${sectionName}-section`);
    });
    
    AppState.currentSection = sectionName;
    
    // Lógica específica por sección
    if (sectionName === 'explore') {
      this.populateTreesGrid();
    }
  },
  
  /**
   * Alternar panel lateral
   */
  togglePanel() {
    const sidebar = document.querySelector('.sidebar');
    const mapContainer = document.querySelector('.map-container');
    
    if (sidebar) {
      AppState.panelOpen = !AppState.panelOpen;
      sidebar.classList.toggle('collapsed', !AppState.panelOpen);
      
      if (mapContainer) {
        mapContainer.classList.toggle('panel-collapsed', !AppState.panelOpen);
      }
      
      // Invalidar tamaño del mapa después de la transición
      setTimeout(() => {
        if (AppState.map) {
          AppState.map.invalidateSize();
        }
      }, APP_CONFIG.animations.normal);
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
      imageUrls.push('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80');
      
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
    this.showSection('map');
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
