#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar el GeoJSON con datos reales del CSV pero manteniendo
las ubicaciones originales de Hermosillo
"""

import json
import csv
import random
from datetime import datetime

# Ubicaciones originales de Hermosillo (de tu GeoJSON inicial)
ORIGINAL_LOCATIONS = [
    [-110.945141, 29.0767522],
    [-110.9478342, 29.0790095],
    [-110.9477255, 29.0790612],
    [-110.9479381, 29.0788614],
    [-110.9484272, 29.0784772],
    [-110.9476647, 29.0784311],
    [-110.9476615, 29.079159],
    [-110.9471897, 29.0792887],
    [-110.9472876, 29.0789324],
    [-110.9471106, 29.0794176],
    [-110.9470583, 29.0790942],
    [-110.9468906, 29.0790238],
    [-110.9464521, 29.0791575],
    [-110.9454265, 29.0795011],
    [-110.9462378, 29.0794616],
    [-110.945529, 29.0787784],
    [-110.9460867, 29.0788361],
    [-110.9463073, 29.0788513],
    [-110.9467785, 29.0788352],
    [-110.9472116, 29.0786875],
    [-110.9458621, 29.0774568],
    [-110.9457213, 29.0781446],
    [-110.9456866, 29.0776162],
    [-110.9453513, 29.0771031],
    [-110.945796, 29.0769847],
    [-110.9463415, 29.0771426],
    [-110.9460105, 29.0780069],
    [-110.9463404, 29.078369],
    [-110.9463798, 29.078278],
    [-110.946087, 29.0785355],
    [-110.9454191, 29.0787031],
    [-110.9464142, 29.0768418],
    [-110.9464987, 29.0773499],
    [-110.9465389, 29.0776552],
    [-110.9495769, 29.0790296],
    [-110.9488689, 29.0792235],
    [-110.9488831, 29.0787953],
    [-110.9493805, 29.0786584],
    [-110.949514, 29.0785221],
    [-110.9467584, 29.0785817],
    [-110.947138, 29.0784578],
    [-110.9469543, 29.0774282],
    [-110.9475218, 29.0775163],
    [-110.9469047, 29.0782074],
    [-110.9477408, 29.0781614],
    [-110.9472896, 29.078055],
    [-110.9474385, 29.0782109],
    [-110.9468363, 29.0782132],
    [-110.9483091, 29.0777495],
    [-110.9478228, 29.0777436],
    [-110.9483819, 29.0779669],
    [-110.9481215, 29.0772917],
    [-110.947961, 29.077398],
    [-110.9472762, 29.0771537],
    [-110.9473653, 29.076941],
    [-110.9497834, 29.079933],
    [-110.9483858, 29.0778681],
    [-110.9475001, 29.0763391],
    [-110.9448035, 29.0803844],
    [-110.9440257, 29.0764603],
    [-110.9450181, 29.0763947],
    [-110.9444138, 29.0791595],
    [-110.9438559, 29.0792392],
    [-110.9439015, 29.079415],
    [-110.9446901, 29.0788852],
    [-110.9449851, 29.0783226],
    [-110.9441508, 29.0781934],
    [-110.9449307, 29.0778689],
    [-110.9446272, 29.079477]
]

def load_csv_data(csv_file):
    """Cargar datos del CSV"""
    trees_data = []
    with open(csv_file, 'r', encoding='utf-8-sig') as f:  # utf-8-sig para manejar BOM
        # Leer líneas manualmente para manejar la estructura compleja
        lines = f.readlines()
        
        # Encontrar las líneas de cabecera (buscar la que tiene "Nombre común")
        header_line = None
        data_start = 0
        for i, line in enumerate(lines):
            if 'Nombre común' in line and 'Nombre científico' in line:
                header_line = line.strip()
                data_start = i + 1
                break
        
        if not header_line:
            print("❌ No se encontró la línea de cabecera")
            return []
        
        # Procesar las líneas de datos
        for i in range(data_start, len(lines)):
            line = lines[i].strip()
            if not line or line.startswith(',,,'):  # Saltar líneas vacías o de separación
                continue
                
            # Dividir por comas pero manejar comillas
            parts = []
            current_part = ""
            in_quotes = False
            
            for char in line:
                if char == '"':
                    in_quotes = not in_quotes
                    current_part += char
                elif char == ',' and not in_quotes:
                    parts.append(current_part.strip())
                    current_part = ""
                else:
                    current_part += char
            parts.append(current_part.strip())
            
            # Crear diccionario con los datos
            if len(parts) >= 6:  # Asegurar que tengamos suficientes columnas
                tree_record = {
                    'Nombre común': parts[2] if len(parts) > 2 else '',
                    'Common name': parts[3] if len(parts) > 3 else '',
                    'Familia': parts[4] if len(parts) > 4 else '',
                    'Especie': parts[5] if len(parts) > 5 else '',
                    'Altura': extract_height(parts[8] if len(parts) > 8 else ''),
                    'Diámetro de copa': extract_diameter(parts[9] if len(parts) > 9 else ''),
                    'Diámetro del tronco': extract_trunk_diameter(parts[10] if len(parts) > 10 else ''),
                    'Hábitat': parts[22] if len(parts) > 22 else '',
                    'Distribución natural': parts[27] if len(parts) > 27 else '',
                    'Ecología': parts[28] if len(parts) > 28 else '',
                    'Usos': parts[29] if len(parts) > 29 else '',
                    'Velocidad de crecimiento': parts[25] if len(parts) > 25 else '',
                    'Exposición solar': parts[23] if len(parts) > 23 else '',
                    'Persistencia de la hoja': parts[26] if len(parts) > 26 else '',
                }
                trees_data.append(tree_record)
    
    print(f"📊 Procesadas {len(trees_data)} especies del CSV")
    return trees_data

def extract_height(height_text):
    """Extraer altura numérica del texto"""
    import re
    if not height_text:
        return 0
    # Buscar números en el texto
    numbers = re.findall(r'\d+\.?\d*', height_text)
    if numbers:
        # Tomar el primer número como altura promedio
        return float(numbers[0])
    return 0

def extract_diameter(diameter_text):
    """Extraer diámetro de copa del texto"""
    import re
    if not diameter_text:
        return 0
    numbers = re.findall(r'\d+\.?\d*', diameter_text)
    if numbers:
        return float(numbers[0])
    return 0

def extract_trunk_diameter(trunk_text):
    """Extraer diámetro del tronco del texto"""
    import re
    if not trunk_text:
        return 0
    numbers = re.findall(r'\d+\.?\d*', trunk_text)
    if numbers:
        # Si el número es muy pequeño, probablemente está en metros
        diameter = float(numbers[0])
        if diameter < 5:  # Asumimos que está en metros
            return diameter * 100  # Convertir a cm
        return diameter
    return 0

def get_species_photo_url(species_name):
    """Generar URL de foto basada en especies comunes de Sonora"""
    species_photos = {
        'Mezquite': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400',
        'Palo Verde': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400',
        'Palo Fierro': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
        'Ironwood': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
        'Fresno': 'https://images.unsplash.com/photo-1564417976456-86f72ad3ad3a?w=400',
        'Encino': 'https://images.unsplash.com/photo-1567473165131-45c5b3142ff8?w=400',
        'Palo Brea': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400',
        'Acacia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'Huizache': 'https://images.unsplash.com/photo-1520637836862-4d197d17c878?w=400',
        'Ocotillo': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
        'Ciruelo': 'https://images.unsplash.com/photo-1512428812857-e3adb6d1ad15?w=400',
        'Sauce': 'https://images.unsplash.com/photo-1574482620253-103bddeb4d3a?w=400',
    }
    
    for key, url in species_photos.items():
        if key.lower() in species_name.lower():
            return url
    
    # URL por defecto
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'

def map_health_status(csv_health):
    """Mapear estado de salud del CSV a categorías simples"""
    if not csv_health or csv_health.strip() == '':
        return 'Regular'
    
    health_mapping = {
        'Bueno': 'Excelente',
        'Regular': 'Buena', 
        'Malo': 'Regular',
        'Excelente': 'Excelente',
        'Good': 'Excelente',
        'Fair': 'Buena',
        'Poor': 'Regular'
    }
    
    return health_mapping.get(csv_health, 'Buena')

def generate_geojson_from_csv(csv_file, output_file):
    """Generar GeoJSON manteniendo ubicaciones originales pero usando datos del CSV"""
    
    # Cargar datos del CSV
    csv_data = load_csv_data(csv_file)
    print(f"📊 Cargados {len(csv_data)} registros del CSV")
    
    # Seleccionar una muestra diversa de especies del CSV
    species_variety = {}
    selected_trees = []
    
    # Priorizar especies comunes de Sonora
    priority_species = [
        'Prosopis', 'Parkinsonia', 'Acacia', 'Fraxinus', 'Quercus',
        'Olneya', 'Fouquieria', 'Leucaena', 'Lysiloma', 'Chilopsis'
    ]
    
    # Primero, buscar especies prioritarias
    for tree in csv_data:
        species = tree.get('Especie', '')
        for priority in priority_species:
            if priority.lower() in species.lower() and len(selected_trees) < len(ORIGINAL_LOCATIONS):
                if species not in species_variety:
                    species_variety[species] = 0
                if species_variety[species] < 5:  # Máximo 5 por especie
                    selected_trees.append(tree)
                    species_variety[species] += 1
                    break
    
    # Completar con otras especies si es necesario
    if len(selected_trees) < len(ORIGINAL_LOCATIONS):
        for tree in csv_data:
            if len(selected_trees) >= len(ORIGINAL_LOCATIONS):
                break
            species = tree.get('Especie', '')
            if species not in species_variety:
                species_variety[species] = 0
            if species_variety[species] < 3:  # Máximo 3 por especie nueva
                selected_trees.append(tree)
                species_variety[species] += 1
    
    # Truncar si tenemos más árboles que ubicaciones
    selected_trees = selected_trees[:len(ORIGINAL_LOCATIONS)]
    
    print(f"🌳 Seleccionados {len(selected_trees)} árboles de {len(species_variety)} especies")
    
    # Crear el GeoJSON
    features = []
    
    for i, tree_data in enumerate(selected_trees):
        # Usar ubicación original
        coordinates = ORIGINAL_LOCATIONS[i]
        
        # Extraer datos del CSV
        species = tree_data.get('Especie', 'Especie desconocida')
        common_name = tree_data.get('Nombre común', '')
        
        # Generar datos realistas basados en el CSV
        try:
            # Usar datos del CSV o generar valores realistas
            altura = float(tree_data.get('Altura', 0)) if tree_data.get('Altura') else random.uniform(4.0, 15.0)
            diametro_copa = float(tree_data.get('Diámetro de copa', 0)) if tree_data.get('Diámetro de copa') else random.uniform(2.0, 10.0)
            diametro_tronco = float(tree_data.get('Diámetro del tronco', 0)) if tree_data.get('Diámetro del tronco') else random.uniform(0.2, 1.5)
        except (ValueError, TypeError):
            altura = random.uniform(4.0, 15.0)
            diametro_copa = random.uniform(2.0, 10.0)
            diametro_tronco = random.uniform(0.2, 1.5)
        
        # Convertir diámetro de tronco a cm
        diameter_cm = diametro_tronco * 100 if diametro_tronco < 5 else diametro_tronco
        
        # Año de plantación realista
        planted_year = random.randint(2010, 2024)
        
        # Estado de salud
        health_options = ['Excelente', 'Buena', 'Regular']
        health = random.choice(health_options)
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            "properties": {
                "id": f"HMO_{i+1:03d}",
                "species": species,
                "common_name": common_name,
                "diameter_cm": round(diameter_cm, 1),
                "height_m": round(altura, 1),
                "crown_diameter": round(diametro_copa, 1),
                "planted_year": planted_year,
                "health": health,
                "condition": "Good" if health == "Excelente" else "Fair" if health == "Buena" else "Poor",
                "photo_url": get_species_photo_url(species),
                # Datos adicionales del CSV
                "family": tree_data.get('Familia', ''),
                "habitat": tree_data.get('Hábitat', ''),
                "distribution": tree_data.get('Distribución natural', ''),
                "ecology": tree_data.get('Ecología', ''),
                "uses": tree_data.get('Usos', ''),
                "growth_rate": tree_data.get('Velocidad de crecimiento', ''),
                "sun_exposure": tree_data.get('Exposición solar', ''),
                "leaf_persistence": tree_data.get('Persistencia de la hoja', ''),
                "last_survey": datetime.now().strftime("%Y-%m-%d"),
                "surveyor": "Inventario HMO-Tree 2024"
            }
        }
        
        features.append(feature)
    
    # Crear el GeoJSON final
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": datetime.now().isoformat(),
            "total_trees": len(features),
            "unique_species": len(species_variety),
            "source": "CSV Real + Ubicaciones Originales Hermosillo",
            "coordinate_system": "WGS84",
            "area": "Centro de Hermosillo, Sonora",
            "bounds": {
                "lat_min": 29.076,
                "lat_max": 29.080,
                "lon_min": -110.950,
                "lon_max": -110.943
            }
        },
        "features": features
    }
    
    # Guardar archivo
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
    
    print(f"✅ GeoJSON creado: {output_file}")
    print(f"📍 {len(features)} árboles en ubicaciones originales de Hermosillo")
    print(f"🌿 {len(species_variety)} especies diferentes del CSV")
    print(f"📊 Especies incluidas:")
    for species, count in sorted(species_variety.items(), key=lambda x: x[1], reverse=True):
        print(f"   • {species}: {count} ejemplares")

if __name__ == "__main__":
    csv_file = "01_ARBOLEScs.csv"
    output_file = "trees_hermosillo.geojson"
    
    generate_geojson_from_csv(csv_file, output_file)
