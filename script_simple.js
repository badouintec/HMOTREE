// 🌳 HERMOSILLO TREE MAP - Script Principal
console.log('🚀 Iniciando Hermosillo Tree Map...');

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

let map = null;
let treeLayer = null;
let selectedTreeData = null;
let globalSpeciesChart = null;
let globalBenefitsChart = null;
let treeHealthChart = null;
let treeBenefitsChart = null;

// ============================================================================
// CONFIGURACIÓN DE ESPECIES
// ============================================================================

const speciesColors = {
  'Tepeguaje': '#8B5A3C',
  'Guajillo': '#9CAF88', 
  'Fresno de Arizona': '#4A7C59',
  'Palo Brea': '#F39C12',
  'Encino Negrito': '#2D5016',
  'Trinquete': '#9B59B6',
  'Madera Amarilla': '#A4C3B2',
  'Jaguarcillo': '#6B9080',
  'Mezquite': '#8B5A3C',
  'Palo Verde': '#9CAF88'
};

const speciesPhotos = {
  'Tepeguaje': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=500&h=400&fit=crop',
  'Guajillo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
  'Fresno de Arizona': 'https://images.unsplash.com/photo-1564417976456-86f72ad3ad3a?w=500&h=400&fit=crop',
  'Palo Brea': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=400&fit=crop',
  'Encino Negrito': 'https://images.unsplash.com/photo-1567473165131-45c5b3142ff8?w=500&h=400&fit=crop',
  'Trinquete': 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=500&h=400&fit=crop',
  'Madera Amarilla': 'https://images.unsplash.com/photo-1574263867128-01fd5d7dffdb?w=500&h=400&fit=crop',
  'Jaguarcillo': 'https://images.unsplash.com/photo-1609686667015-c0ad91b81b3e?w=500&h=400&fit=crop',
  'Mezquite': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=500&h=400&fit=crop',
  'Palo Verde': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=500&h=400&fit=crop'
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function getSpeciesColor(species) {
  const speciesName = species ? species.split('(')[0].trim() : 'default';
  return speciesColors[speciesName] || '#4CAF50';
}

function getScientificName(species) {
  if (!species) return 'Nombre científico no disponible';
  const match = species.match(/\((.*?)\)/);
  return match ? match[1] : 'Nombre científico no disponible';
}

function generateAddress() {
  const streets = ['Av. Cultura', 'Calle Morelos', 'Blvd. Luis Encinas', 'Calle Rosales', 'Av. Universidad'];
  const numbers = Math.floor(Math.random() * 500) + 100;
  return `${numbers} ${streets[Math.floor(Math.random() * streets.length)]}`;
}

function calculateAge(plantedYear) {
  const currentYear = new Date().getFullYear();
  return plantedYear ? currentYear - plantedYear : 0;
}

// ============================================================================
// INICIALIZACIÓN DEL MAPA
// ============================================================================

function initializeMap() {
  console.log('🗺️ Inicializando mapa...');
  
  try {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      throw new Error('Elemento #map no encontrado');
    }
    
    // Crear mapa
    map = L.map('map').setView([29.0791825, -110.947542], 18);
    
    // Añadir tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    console.log('✅ Mapa inicializado');
    
    // Ocultar indicador de carga
    const mapLoading = document.getElementById('map-loading');
    if (mapLoading) mapLoading.style.display = 'none';

    // Event listener para clicks en el mapa
    map.on('click', function(e) {
      if (!e.originalEvent.target.classList.contains('tree-marker')) {
        showWelcomePanel();
      }
    });
    
  } catch (error) {
    console.error('❌ Error inicializando mapa:', error);
    showErrorMessage(error);
  }
}

// ============================================================================
// CARGA DE ÁRBOLES
// ============================================================================

function pointToLayer(feature, latlng) {
  const d = feature.properties.diameter_cm || 8;
  const species = feature.properties.species || '';
  return L.circleMarker(latlng, {
    radius: Math.max(6, d / 3),
    fillColor: getSpeciesColor(species),
    color: '#fff',
    weight: 2,
    fillOpacity: 0.8,
    className: 'tree-marker'
  });
}

async function loadTrees() {
  try {
    console.log('🌳 Cargando árboles...');
    showLoadingIndicator();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('trees_hermosillo.geojson', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }
    
    const geojsonData = await response.json();
    
    if (!geojsonData || !geojsonData.features || !Array.isArray(geojsonData.features)) {
      throw new Error('Estructura de datos GeoJSON inválida');
    }
    
    console.log('✅ Datos cargados:', geojsonData.features.length, 'árboles');
    
    // Remover capa anterior si existe
    if (treeLayer) {
      map.removeLayer(treeLayer);
    }

    // Crear capa de árboles
    treeLayer = L.geoJSON(geojsonData, {
      pointToLayer: pointToLayer,
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        layer.bindPopup(`
          <h3>${props.species || 'Especie desconocida'}</h3>
          <p><strong>ID:</strong> ${props.id}</p>
          <p><strong>Diámetro:</strong> ${props.diameter_cm} cm</p>
          <p><strong>Altura:</strong> ${props.height_m} m</p>
        `);
        layer.on('click', function() {
          updateTreeDetails(feature);
        });
      }
    });

    treeLayer.addTo(map);
    console.log('✅ Árboles añadidos al mapa');
    
    // Calcular estadísticas
    const stats = calculateTreeStatistics(geojsonData);
    updateWelcomePanelStats(stats);
    
    hideLoadingIndicator();
    
  } catch (error) {
    console.error('❌ Error cargando árboles:', error);
    hideLoadingIndicator();
    showErrorMessage(error);
  }
}

// ============================================================================
// CÁLCULO DE ESTADÍSTICAS
// ============================================================================

function calculateTreeStatistics(geojsonData) {
  console.log('📊 Calculando estadísticas...');
  
  const features = geojsonData.features;
  const totalTrees = features.length;
  const speciesCount = {};
  let totalCO2 = 0;
  let totalBenefits = 0;
  
  features.forEach(feature => {
    const props = feature.properties;
    
    // Contar especies
    const speciesName = props.species ? props.species.split('(')[0].trim() : 'Desconocida';
    speciesCount[speciesName] = (speciesCount[speciesName] || 0) + 1;
    
    // Calcular beneficios básicos
    const diameter = props.diameter_cm || 20;
    const height = props.height_m || 5;
    const baseBenefit = Math.pow(diameter / 10, 1.5) * height * 0.8;
    
    totalCO2 += baseBenefit * 12;
    totalBenefits += baseBenefit * 50; // Valor estimado en MXN
  });
  
  return {
    totalTrees,
    speciesCount,
    totalCO2: Math.round(totalCO2),
    totalBenefits: Math.round(totalBenefits),
    avgAge: 8, // Estimado
    mostCommonSpecies: Object.keys(speciesCount).reduce((a, b) => 
      speciesCount[a] > speciesCount[b] ? a : b
    )
  };
}

function updateWelcomePanelStats(stats) {
  document.getElementById('total-trees').textContent = stats.totalTrees;
  document.getElementById('total-species').textContent = Object.keys(stats.speciesCount).length;
  document.getElementById('total-benefits').textContent = `$${stats.totalBenefits.toLocaleString()} MXN`;
  document.getElementById('avg-age').textContent = `${stats.avgAge} años`;
  document.getElementById('total-co2').textContent = `${stats.totalCO2} kg`;
  document.getElementById('most-common-species').textContent = stats.mostCommonSpecies;
  document.getElementById('most-common-details').textContent = 
    `${stats.speciesCount[stats.mostCommonSpecies]} árboles encontrados`;
}

// ============================================================================
// DETALLES DE ÁRBOL
// ============================================================================

function updateTreeDetails(feature) {
  console.log('🌳 Mostrando detalles del árbol');
  
  const props = feature.properties;
  selectedTreeData = feature;
  
  // Mostrar panel de detalles
  document.getElementById('welcome-panel').style.display = 'none';
  document.getElementById('tree-details').style.display = 'block';
  
  // Actualizar información básica
  document.getElementById('tree-species').textContent = 
    props.species ? props.species.split('(')[0].trim() : 'Especie desconocida';
  document.getElementById('tree-scientific').textContent = getScientificName(props.species);
  
  // Actualizar datos
  document.getElementById('tree-data').style.display = 'block';
  updateElement('tree-address', generateAddress());
  updateElement('tree-id', props.id || 'No disponible');
  updateElement('tree-diameter', props.diameter_cm ? `${props.diameter_cm} cm` : 'No disponible');
  updateElement('tree-height', props.height_m ? `${props.height_m} m` : 'No disponible');
  updateElement('tree-crown', props.crown_diameter ? `${props.crown_diameter} m` : 'No disponible');
  updateElement('tree-year', props.planted_year || 'No disponible');
  updateElement('tree-health', props.health || 'No disponible');
  updateElement('tree-condition', props.condition || 'No disponible');
  
  // Estadísticas calculadas
  const age = calculateAge(props.planted_year);
  const crownArea = props.crown_diameter ? Math.PI * Math.pow(props.crown_diameter / 2, 2) : 0;
  const co2Annual = (props.diameter_cm || 20) * (props.height_m || 5) * 0.5;
  
  updateElement('tree-age', age > 0 ? age : 'Desconocido');
  updateElement('tree-area', crownArea > 0 ? Math.round(crownArea) : 'No disponible');
  updateElement('tree-co2', Math.round(co2Annual));
  updateElement('tree-score', `${Math.min(Math.round(co2Annual), 100)}/100`);
  
  // Mostrar foto si existe
  const photoSection = document.getElementById('tree-photo-section');
  const treePhoto = document.getElementById('tree-photo');
  const speciesName = props.species ? props.species.split('(')[0].trim() : '';
  const defaultPhoto = speciesPhotos[speciesName];
  
  if (defaultPhoto) {
    treePhoto.src = defaultPhoto;
    treePhoto.alt = `Foto de referencia de ${speciesName}`;
    photoSection.style.display = 'block';
  } else {
    photoSection.style.display = 'none';
  }
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showWelcomePanel() {
  document.getElementById('welcome-panel').style.display = 'block';
  document.getElementById('tree-details').style.display = 'none';
  selectedTreeData = null;
}

// ============================================================================
// SIDEBAR TOGGLE
// ============================================================================

function setupSidebarToggle() {
  console.log('📱 Configurando toggle del sidebar...');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarToggle.innerHTML = sidebar.classList.contains('active') ? '❌ Cerrar' : '📋 Info';
      
      if (selectedTreeData) {
        showWelcomePanel();
      }
    });
    console.log('✅ Toggle del sidebar configurado');
  }
}

// ============================================================================
// NAVEGACIÓN
// ============================================================================

function setupNavigation() {
  console.log('🧭 Configurando navegación...');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remover clase active de todos los links
      navLinks.forEach(l => l.classList.remove('active'));
      // Añadir clase active al link clickeado
      this.classList.add('active');
    });
  });
  
  console.log('✅ Navegación configurada');
}

// ============================================================================
// INDICADORES DE CARGA Y ERRORES
// ============================================================================

function showLoadingIndicator() {
  let loadingEl = document.getElementById('loading-indicator');
  if (!loadingEl) {
    loadingEl = document.createElement('div');
    loadingEl.id = 'loading-indicator';
    loadingEl.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(45, 80, 22, 0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; color: #FEFCF3; font-family: 'Inter', sans-serif;">
        <div style="text-align: center;">
          <div style="width: 40px; height: 40px; border: 4px solid rgba(164, 195, 178, 0.3); border-top: 4px solid #A4C3B2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <p>Cargando árboles de Hermosillo...</p>
        </div>
      </div>
    `;
    
    // Añadir animación de spinner
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    document.body.appendChild(loadingEl);
  }
  loadingEl.style.display = 'flex';
}

function hideLoadingIndicator() {
  const loadingEl = document.getElementById('loading-indicator');
  if (loadingEl) loadingEl.style.display = 'none';
}

function showErrorMessage(error) {
  const errorMessage = error.name === 'AbortError' 
    ? 'La carga de datos tomó demasiado tiempo. Verifica tu conexión.'
    : `Error: ${error.message}`;
    
  let errorEl = document.getElementById('error-message');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'error-message';
    errorEl.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; 
      padding: 15px 20px; border-radius: 8px; max-width: 300px; z-index: 10000; 
      font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(errorEl);
  }
  
  errorEl.innerHTML = `
    <strong>⚠️ Error</strong><br>${errorMessage}<br><br>
    <button onclick="this.parentElement.style.display='none'" 
            style="background: white; color: #e74c3c; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
      Cerrar
    </button>
  `;
  errorEl.style.display = 'block';
  
  setTimeout(() => {
    if (errorEl) errorEl.style.display = 'none';
  }, 10000);
}

// ============================================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM listo, inicializando aplicación...');
  
  try {
    // Verificar dependencias
    console.log('🔍 Verificando dependencias:');
    console.log('  - Leaflet:', typeof L !== 'undefined' ? '✅' : '❌');
    console.log('  - Chart.js:', typeof Chart !== 'undefined' ? '✅' : '❌');
    
    if (typeof L === 'undefined') {
      throw new Error('Leaflet.js no está cargado');
    }
    
    // Inicializar componentes
    initializeMap();
    setupSidebarToggle();
    setupNavigation();
    
    // Cargar árboles después de que el mapa esté listo
    setTimeout(() => {
      loadTrees();
    }, 500);
    
    console.log('✅ Hermosillo Tree Map inicializada');
    
  } catch (error) {
    console.error('❌ Error inicializando la aplicación:', error);
    showErrorMessage(error);
  }
});

console.log('📝 Script Hermosillo Tree Map cargado');
