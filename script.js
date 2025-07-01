// inicializa mapa centrado en Parque Madero (coordenadas exactas)
const map = L.map('map').setView([29.0791825, -110.947542], 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// control "Tree Species/Sizes"
L.Control.Species = L.Control.extend({
  onAdd: () => {
    const btn = L.DomUtil.create('button', 'leaflet-control-species');
    btn.innerText = 'Tree Species/Sizes';
    return btn;
  }
});
new L.Control.Species({ position: 'topright' }).addTo(map);

// Colores modernos por especie (actualizados)
const speciesColors = {
  'Mezquite': '#8B5A3C',
  'Palo Verde': '#9CAF88',
  'Jacaranda': '#9B59B6',
  'Encino': '#2D5016',
  'Ficus': '#4A7C59',
  'Willow del Desierto': '#A4C3B2',
  'Ironwood': '#6B9080',
  'Tabachín': '#F39C12',
  'Olmo Chino': '#6B9080',
  'Pirul': '#A4C3B2',
  'Eucalipto': '#4A7C59',
  'Fresno': '#6B9080',
  'Bugambilia': '#9B59B6',
  'Nogal': '#8B5A3C',
  'Acebuche': '#9CAF88',
  'Sauce Llorón': '#A4C3B2',
  'Palma Datilera': '#F39C12',
  'Casuarina': '#6B9080',
  'Ciprés': '#2D5016',
  'Laurel': '#4A7C59',
  'Pino': '#4A7C59'
};

// layers de árboles
let treeLayer = null;
let selectedTreeData = null;

function getSpeciesColor(species) {
  const speciesName = species ? species.split('(')[0].trim() : 'default';
  return speciesColors[speciesName] || '#4CAF50';
}

function pointToLayer(feature, latlng) {
  const d = feature.properties.diameter_cm || 8;
  const species = feature.properties.species || '';
  return L.circleMarker(latlng, {
    radius: Math.max(4, d / 4),
    fillColor: getSpeciesColor(species),
    color: '#fff',
    weight: 2,
    fillOpacity: 0.8,
    className: 'tree-marker'
  });
}

function calculateEcologicalBenefits(diameter, height, crownDiameter) {
  // Fórmulas mejoradas basadas en investigación forestal
  const dbh = diameter; // diameter at breast height
  const treeHeight = height;
  const actualCrownArea = crownDiameter ? Math.PI * Math.pow(crownDiameter / 2, 2) : Math.PI * Math.pow(dbh * 0.3, 2);
  
  // Agua pluvial interceptada (litros/año)
  const stormwater = actualCrownArea * 650; // aprox 650 L/m² de copa para clima semiárido
  const stormwaterValue = stormwater * 0.003; // $0.003 MXN por litro
  
  // Energía conservada (kWh/año) - más importante en Sonora
  const energy = actualCrownArea * 180 * (treeHeight / 10); // factor de altura
  const energyValue = energy * 4.2; // $4.2 MXN por kWh en Sonora
  
  // Contaminantes removidos (kg/año)
  const airPollution = actualCrownArea * 0.08; // mayor capacidad en zona urbana
  const airValue = airPollution * 35; // $35 MXN por kg
  
  // Oxígeno producido (kg/año)
  const oxygenProduced = actualCrownArea * 120; // kg O2/m²
  const oxygenValue = oxygenProduced * 0.15; // valor estimado
  
  // Carbono secuestrado anualmente (kg/año)
  const carbonSequestered = (dbh * treeHeight * 0.8) / 10; // fórmula simplificada
  const carbonValue = carbonSequestered * 0.5; // precio carbono MXN/kg
  
  // Reducción de temperatura (°C)
  const temperatureReduction = Math.min(actualCrownArea * 0.1, 3); // máximo 3°C
  
  const totalValue = stormwaterValue + energyValue + airValue + oxygenValue + carbonValue;
  
  return {
    stormwater: Math.round(stormwater),
    stormwaterValue: stormwaterValue.toFixed(2),
    energy: Math.round(energy),
    energyValue: energyValue.toFixed(2),
    airPollution: airPollution.toFixed(1),
    airValue: airValue.toFixed(2),
    oxygenProduced: Math.round(oxygenProduced),
    oxygenValue: oxygenValue.toFixed(2),
    carbonSequestered: carbonSequestered.toFixed(1),
    carbonValue: carbonValue.toFixed(2),
    temperatureReduction: temperatureReduction.toFixed(1),
    totalValue: totalValue.toFixed(2),
    crownArea: actualCrownArea.toFixed(1)
  };
}

// Variables globales para las gráficas
let speciesChart = null;
let benefitsChart = null;
let treeHealthChart = null;
let treeGrowthChart = null;

function updateTreeDetails(feature) {
  const props = feature.properties;
  selectedTreeData = props;
  
  // Ocultar panel de bienvenida y mostrar detalles del árbol
  document.getElementById('welcome-panel').style.display = 'none';
  document.getElementById('tree-data').style.display = 'block';
  
  // Actualizar información básica
  document.getElementById('tree-species').textContent = props.species || 'Especie desconocida';
  document.getElementById('tree-scientific').textContent = getScientificName(props.species);
  document.getElementById('tree-address').textContent = generateAddress();
  document.getElementById('tree-id').textContent = props.id || '—';
  document.getElementById('tree-diameter').textContent = props.diameter_cm ? `${props.diameter_cm} cm` : '—';
  document.getElementById('tree-height').textContent = props.height_m ? `${props.height_m} m` : '—';
  document.getElementById('tree-crown').textContent = props.crown_diameter ? `${props.crown_diameter} m` : '—';
  document.getElementById('tree-year').textContent = props.planted_year || '—';
  document.getElementById('tree-health').textContent = props.health || '—';
  document.getElementById('tree-condition').textContent = props.condition || '—';
  
  // Calcular estadísticas adicionales
  const currentYear = new Date().getFullYear();
  const age = props.planted_year ? currentYear - props.planted_year : 0;
  const crownArea = props.crown_diameter ? Math.PI * Math.pow(props.crown_diameter / 2, 2) : 0;
  const co2Absorption = calculateCO2Absorption(props.diameter_cm, props.height_m);
  const overallScore = calculateOverallScore(props);
  
  document.getElementById('tree-age').textContent = age > 0 ? `${age} años` : '—';
  document.getElementById('tree-area').textContent = crownArea > 0 ? `${Math.round(crownArea)} m²` : '—';
  document.getElementById('tree-co2').textContent = co2Absorption > 0 ? `${Math.round(co2Absorption)} kg` : '—';
  document.getElementById('tree-score').textContent = overallScore > 0 ? `${overallScore}/100` : '—';
  
  // Calcular y mostrar beneficios ecológicos mejorados
  if (props.diameter_cm && props.height_m) {
    const benefits = calculateEcologicalBenefits(props.diameter_cm, props.height_m, props.crown_diameter);
    
    document.getElementById('water-amount').textContent = benefits.stormwater.toLocaleString();
    document.getElementById('water-value').textContent = `$${benefits.stormwaterValue} MXN`;
    
    document.getElementById('energy-amount').textContent = benefits.energy.toLocaleString();
    document.getElementById('energy-value').textContent = `$${benefits.energyValue} MXN`;
    
    document.getElementById('air-amount').textContent = benefits.airPollution;
    document.getElementById('air-value').textContent = `$${benefits.airValue} MXN`;
    
    document.getElementById('total-value').textContent = `$${benefits.totalValue} MXN`;
    
    // Agregar métricas adicionales si existen los elementos
    updateAdditionalMetrics(benefits);
    
    // Crear gráficas específicas del árbol mejoradas
    createEnhancedTreeCharts(props, benefits);
  }
}

function updateAdditionalMetrics(benefits) {
  // Oxígeno producido
  const oxygenEl = document.getElementById('oxygen-amount');
  if (oxygenEl) {
    oxygenEl.textContent = benefits.oxygenProduced.toLocaleString();
    document.getElementById('oxygen-value').textContent = `$${benefits.oxygenValue} MXN`;
  }
  
  // Carbono secuestrado
  const carbonEl = document.getElementById('carbon-amount');
  if (carbonEl) {
    carbonEl.textContent = benefits.carbonSequestered;
    document.getElementById('carbon-value').textContent = `$${benefits.carbonValue} MXN`;
  }
  
  // Reducción de temperatura
  const tempEl = document.getElementById('temperature-reduction');
  if (tempEl) {
    tempEl.textContent = `${benefits.temperatureReduction}°C`;
  }
  
  // Área de copa real
  const crownAreaEl = document.getElementById('crown-area-actual');
  if (crownAreaEl) {
    crownAreaEl.textContent = `${benefits.crownArea} m²`;
  }
  
  // Métricas avanzadas de análisis
  const sustainabilityEl = document.getElementById('sustainability-index');
  if (sustainabilityEl) {
    const sustainability = calculateSustainabilityIndex(benefits);
    sustainabilityEl.textContent = `${sustainability}/100`;
  }
  
  const ecoContributionEl = document.getElementById('ecological-contribution');
  if (ecoContributionEl) {
    const contribution = calculateEcologicalContribution(benefits);
    ecoContributionEl.textContent = contribution;
  }
  
  const energyEfficiencyEl = document.getElementById('energy-efficiency');
  if (energyEfficiencyEl) {
    const efficiency = calculateEnergyEfficiency(benefits);
    energyEfficiencyEl.textContent = efficiency;
  }
}

function calculateSustainabilityIndex(benefits) {
  // Índice basado en múltiples factores ambientales
  const waterScore = Math.min((parseFloat(benefits.stormwaterValue) / 50) * 25, 25);
  const energyScore = Math.min((parseFloat(benefits.energyValue) / 100) * 25, 25);
  const airScore = Math.min((parseFloat(benefits.airValue) / 30) * 25, 25);
  const carbonScore = Math.min((parseFloat(benefits.carbonValue) / 20) * 25, 25);
  
  return Math.round(waterScore + energyScore + airScore + carbonScore);
}

function calculateEcologicalContribution(benefits) {
  const totalBenefit = parseFloat(benefits.totalValue);
  if (totalBenefit > 300) return 'Excelente';
  if (totalBenefit > 200) return 'Alta';
  if (totalBenefit > 100) return 'Moderada';
  if (totalBenefit > 50) return 'Baja';
  return 'Limitada';
}

function calculateEnergyEfficiency(benefits) {
  const energyValue = parseFloat(benefits.energyValue);
  const crownArea = parseFloat(benefits.crownArea);
  const efficiency = energyValue / crownArea;
  
  if (efficiency > 50) return 'Muy Alta';
  if (efficiency > 30) return 'Alta';
  if (efficiency > 20) return 'Moderada';
  if (efficiency > 10) return 'Baja';
  return 'Muy Baja';
}

function calculateCO2Absorption(diameter, height) {
  if (!diameter || !height) return 0;
  // Fórmula aproximada: biomasa del árbol * factor de absorción de CO2
  const biomass = Math.PI * Math.pow(diameter / 2, 2) * height * 0.5; // kg estimados
  return biomass * 0.02; // kg CO2 por año
}

function calculateOverallScore(props) {
  const healthScore = getHealthScore(props.health);
  const ageScore = getAgeScore(props.planted_year);
  const sizeScore = getSizeScore(props.diameter_cm);
  const conditionScore = getConditionScore(props.condition);
  
  return Math.round((healthScore + ageScore + sizeScore + conditionScore) / 4);
}

function getConditionScore(condition) {
  const conditionMap = {
    'Excellent': 95,
    'Good': 80,
    'Fair': 60,
    'Poor': 40,
    'Critical': 20
  };
  return conditionMap[condition] || 50;
}

function createEnhancedTreeCharts(treeData, benefits) {
  // Destruir gráficas existentes
  if (speciesChart) speciesChart.destroy();
  if (benefitsChart) benefitsChart.destroy();
  if (treeHealthChart) treeHealthChart.destroy();
  if (treeGrowthChart) treeGrowthChart.destroy();
  
  // 1. Gráfica de beneficios ecológicos mejorada
  const benefitsCtx = document.getElementById('benefitsChart').getContext('2d');
  benefitsChart = new Chart(benefitsCtx, {
    type: 'doughnut',
    data: {
      labels: ['Agua Pluvial', 'Energía', 'Aire Limpio', 'Oxígeno', 'Carbono'],
      datasets: [{
        data: [
          parseFloat(benefits.stormwaterValue),
          parseFloat(benefits.energyValue),
          parseFloat(benefits.airValue),
          parseFloat(benefits.oxygenValue),
          parseFloat(benefits.carbonValue)
        ],
        backgroundColor: [
          '#5DADE2',
          '#F39C12', 
          '#A4C3B2',
          '#58D68D',
          '#8B4513'
        ],
        borderWidth: 3,
        borderColor: '#FEFCF3',
        hoverBorderWidth: 4,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FEFCF3',
            font: {
              size: 9,
              weight: '500'
            },
            padding: 6,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: `Beneficios Anuales: $${benefits.totalValue} MXN`,
          color: '#FEFCF3',
          font: {
            size: 12,
            weight: '600'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#FEFCF3',
          bodyColor: '#FEFCF3',
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: $${value} MXN`;
            }
          }
        }
      }
    }
  });

  // 2. Gráfica de comparación con promedio del parque
  const healthCtx = document.getElementById('speciesChart').getContext('2d');
  const healthScore = getHealthScore(treeData.health);
  const ageScore = getAgeScore(treeData.planted_year);
  const sizeScore = getSizeScore(treeData.diameter_cm);
  const conditionScore = getConditionScore(treeData.condition);
  const benefitScore = Math.min((parseFloat(benefits.totalValue) / 100) * 10, 100);
  
  // Promedio del parque para comparación
  const parkAverage = [65, 70, 60, 75, 55];
  const treeScores = [healthScore, ageScore, sizeScore, conditionScore, benefitScore];
  
  speciesChart = new Chart(healthCtx, {
    type: 'radar',
    data: {
      labels: ['Salud', 'Madurez', 'Tamaño', 'Condición', 'Beneficios'],
      datasets: [{
        label: 'Este Árbol',
        data: treeScores,
        backgroundColor: 'rgba(164, 195, 178, 0.3)',
        borderColor: '#A4C3B2',
        borderWidth: 3,
        pointBackgroundColor: '#2D5016',
        pointBorderColor: '#FEFCF3',
        pointBorderWidth: 2,
        pointRadius: 5
      }, {
        label: 'Promedio del Parque',
        data: parkAverage,
        backgroundColor: 'rgba(139, 90, 60, 0.2)',
        borderColor: '#8B5A3C',
        borderWidth: 2,
        pointBackgroundColor: '#8B5A3C',
        pointBorderColor: '#FEFCF3',
        pointBorderWidth: 1,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#FEFCF3',
            font: {
              size: 10,
              weight: '500'
            },
            padding: 8,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Comparación con el Parque',
          color: '#FEFCF3',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          angleLines: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          pointLabels: {
            color: '#FEFCF3',
            font: {
              size: 8,
              weight: '500'
            }
          }
        }
      }
    }
  });
  
  // 3. Crear gráfica de progreso temporal si hay espacio
  createGrowthProjectionChart(treeData, benefits);
}

function createGrowthProjectionChart(treeData, benefits) {
  // Esta función crea una proyección de crecimiento del árbol
  const currentYear = new Date().getFullYear();
  const age = treeData.planted_year ? currentYear - treeData.planted_year : 5;
  const projectedYears = [];
  const projectedBenefits = [];
  const projectedSize = [];
  
  // Proyectar crecimiento para los próximos 10 años
  for (let i = 0; i <= 10; i++) {
    const futureAge = age + i;
    projectedYears.push(currentYear + i);
    
    // Factor de crecimiento basado en la edad
    let growthFactor = 1;
    if (futureAge < 10) {
      growthFactor = 1 + (i * 0.15); // crecimiento rápido cuando joven
    } else if (futureAge < 20) {
      growthFactor = 1 + (i * 0.08); // crecimiento moderado
    } else {
      growthFactor = 1 + (i * 0.03); // crecimiento lento cuando maduro
    }
    
    projectedBenefits.push(parseFloat(benefits.totalValue) * growthFactor);
    projectedSize.push((treeData.diameter_cm || 30) * growthFactor);
  }
  
  // Esta información se puede mostrar en una tercera gráfica o en tooltips
  console.log('Proyección de crecimiento generada:', { projectedYears, projectedBenefits, projectedSize });
}

function getHealthScore(health) {
  const healthMap = {
    'Excelente': 95,
    'Buena': 75,
    'Regular': 60,
    'Mala': 40,
    'Crítica': 20
  };
  return healthMap[health] || 50;
}

function getAgeScore(plantedYear) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - plantedYear;
  // Árbol más maduro = mejor puntaje (hasta cierto punto)
  if (age < 2) return 30;
  if (age < 5) return 60;
  if (age < 10) return 85;
  return 95;
}

function getSizeScore(diameter) {
  // Diámetro más grande = mejor establecimiento
  if (diameter < 20) return 40;
  if (diameter < 35) return 65;
  if (diameter < 50) return 85;
  return 95;
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

function onEachFeature(feature, layer) {
  layer.on('click', function(e) {
    e.originalEvent.treeclicked = true; // Marcar que se hizo clic en un árbol
    updateTreeDetails(feature);
    
    // Resaltar árbol seleccionado
    if (window.selectedTree) {
      window.selectedTree.setStyle({
        weight: 2,
        fillOpacity: 0.8
      });
    }
    
    layer.setStyle({
      weight: 4,
      fillOpacity: 1,
      color: '#FEFCF3'
    });
    
    window.selectedTree = layer;
  });
  
  // Popup simple
  const p = feature.properties;
  const html = `
    <div style="text-align: center;">
      <h3 style="margin: 0 0 5px 0; color: #2D5016;">${p.species || '—'}</h3>
      <p style="margin: 0; font-size: 0.9em; color: #666;"><strong>Diámetro:</strong> ${p.diameter_cm || '—'} cm</p>
      <p style="margin: 0; font-size: 0.9em; color: #666;"><strong>Altura:</strong> ${p.height_m || '—'} m</p>
      <p style="margin: 0; font-size: 0.9em; color: #666;"><strong>Salud:</strong> ${p.health || '—'}</p>
    </div>
  `;
  layer.bindPopup(html);
}

// Inicializar gráficas generales del parque
function initializeCharts() {
  // Destruir gráficas existentes
  if (speciesChart) speciesChart.destroy();
  if (benefitsChart) benefitsChart.destroy();
  
  // Gráfica de distribución por especies del parque (actualizada)
  const speciesCtx = document.getElementById('speciesChart').getContext('2d');
  speciesChart = new Chart(speciesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Mezquite', 'Palo Verde', 'Encino', 'Willow del Desierto', 'Ironwood', 'Palo Fierro'],
      datasets: [{
        data: [2, 1, 1, 2, 1, 1], // Basado en los datos actualizados del GeoJSON
        backgroundColor: [
          '#8B5A3C',
          '#9CAF88',
          '#2D5016',
          '#A4C3B2',
          '#6B9080',
          '#8B5A3C'
        ],
        borderWidth: 3,
        borderColor: '#FEFCF3',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FEFCF3',
            font: {
              size: 10,
              weight: '500'
            },
            padding: 8,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: 'Distribución por Especies del Parque',
          color: '#FEFCF3',
          font: {
            size: 12,
            weight: '600'
          }
        }
      }
    }
  });

  // Gráfica de beneficios totales del parque (mejorada)
  const benefitsCtx = document.getElementById('benefitsChart').getContext('2d');
  benefitsChart = new Chart(benefitsCtx, {
    type: 'bar',
    data: {
      labels: ['Agua', 'Energía', 'Aire', 'Oxígeno', 'Carbono'],
      datasets: [{
        label: 'Beneficios Totales ($MXN)',
        data: [4800, 8200, 2100, 1800, 650], // Estimación mejorada total del parque
        backgroundColor: [
          '#5DADE2',
          '#F39C12', 
          '#A4C3B2',
          '#58D68D',
          '#8B4513'
        ],
        borderColor: [
          '#3498DB',
          '#E67E22',
          '#6B9080',
          '#27AE60',
          '#A0522D'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Beneficios Totales del Parque Madero',
          color: '#FEFCF3',
          font: {
            size: 12,
            weight: '600'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#FEFCF3',
          bodyColor: '#FEFCF3',
          callbacks: {
            label: function(context) {
              return `${context.label}: $${context.parsed.y.toLocaleString()} MXN`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#FEFCF3',
            font: {
              size: 10,
              weight: '500'
            },
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#FEFCF3',
            font: {
              size: 10,
              weight: '500'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Eventos de botones
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar gráficas
  setTimeout(initializeCharts, 500);
  
  // Agregar evento click al mapa para volver al panel de bienvenida
  map.on('click', function(e) {
    // Solo si no se hizo clic en un árbol
    setTimeout(() => {
      if (!e.originalEvent.treeclicked) {
        showWelcomePanel();
      }
    }, 100);
  });
  
  // Botones de acción
  document.getElementById('suggest-edit').addEventListener('click', function() {
    alert('Funcionalidad de edición en desarrollo');
  });
  
  document.getElementById('record-care').addEventListener('click', function() {
    alert('Funcionalidad de registro de cuidado en desarrollo');
  });
  
  // Botones del mapa
  document.querySelector('.share-btn').addEventListener('click', function() {
    navigator.share ? navigator.share({
      title: 'Hermosillo Tree Map',
      url: window.location.href
    }) : alert('Compartir: ' + window.location.href);
  });
  
  document.querySelector('.tweet-btn').addEventListener('click', function() {
    const text = 'Explorando el bosque urbano de Hermosillo 🌳';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`);
  });
  
  document.querySelector('.favorite-btn').addEventListener('click', function() {
    const btn = this;
    if (btn.textContent.includes('❤️')) {
      btn.innerHTML = '💚 Favorited';
      btn.style.background = '#4CAF50';
      btn.style.color = 'white';
    } else {
      btn.innerHTML = '❤️ Favorite';
      btn.style.background = 'white';
      btn.style.color = 'black';
    }
  });
  
  document.querySelector('.report-btn').addEventListener('click', function() {
    alert('Funcionalidad de reporte en desarrollo');
  });
});

// carga GeoJSON inmediatamente al cargar la página
function loadTrees() {
  if (!treeLayer) {
    fetch('trees_hermosillo.geojson')
      .then(r => r.json())
      .then(data => {
        treeLayer = L.geoJSON(data, { pointToLayer, onEachFeature }).addTo(map);
      })
      .catch(err => console.error('Error loading tree data:', err));
  }
}

// Cargar árboles al inicializar
loadTrees();

// También mantener la funcionalidad de zoom por compatibilidad
map.on('zoomend', () => {
  if (map.getZoom() >= 15 && !treeLayer) {
    loadTrees();
  }
  if (map.getZoom() < 12 && treeLayer) {
    map.removeLayer(treeLayer);
    treeLayer = null;
    // Volver al panel de bienvenida
    document.getElementById('welcome-panel').style.display = 'block';
    document.getElementById('tree-data').style.display = 'none';
  }
});

// Inicializar gráficas
initializeCharts();

function showWelcomePanel() {
  // Mostrar panel de bienvenida y ocultar detalles del árbol
  document.getElementById('welcome-panel').style.display = 'block';
  document.getElementById('tree-data').style.display = 'none';
  
  // Resetear árbol seleccionado
  if (window.selectedTree) {
    window.selectedTree.setStyle({
      weight: 2,
      fillOpacity: 0.8
    });
    window.selectedTree = null;
  }
  
  // Reinicializar gráficas generales
  initializeCharts();
}
