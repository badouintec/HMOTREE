#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para procesar el CSV de especies de árboles de Hermosillo
y generar un GeoJSON realista con datos cuantitativos y cualitativos
"""

import pandas as pd
import json
import random
import math
from datetime import datetime

# Configuración
CSV_PATH = "/Users/juangamez/Desktop/01_ARBOLEScs.csv"
OUTPUT_PATH = "/Users/juangamez/Documents/GitHub/HMOTREE/trees_hermosillo.geojson"

# Coordenadas de Hermosillo (área urbana y periurbana)
HERMOSILLO_BOUNDS = {
    'lat_min': 29.05,
    'lat_max': 29.15,
    'lon_min': -111.05,
    'lon_max': -110.90
}

# URLs de imágenes para especies principales (usando fuentes públicas)
DEFAULT_PHOTO_URLS = {
    'Spondias purpurea L.': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spondias_purpurea_leaves.jpg/512px-Spondias_purpurea_leaves.jpg',
    'Plumeria rubra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Plumeria_rubra_-_Köhler–s_Medizinal-Pflanzen-032.jpg/512px-Plumeria_rubra_-_Köhler–s_Medizinal-Pflanzen-032.jpg',
    'Brahea brandegeei': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Brahea_brandegeei.jpg/512px-Brahea_brandegeei.jpg',
    'Sabal uresana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sabal_uresana.jpg/512px-Sabal_uresana.jpg',
    'Washingtonia robusta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Washingtonia_robusta_Frond.jpg/512px-Washingtonia_robusta_Frond.jpg',
    'Chilopsis linearis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chilopsis_linearis_kz01.jpg/512px-Chilopsis_linearis_kz01.jpg',
    'Cercidium floridum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Cercidium_floridum_9.jpg/512px-Cercidium_floridum_9.jpg',
    'Prosopis velutina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Prosopis_velutina_2.jpg/512px-Prosopis_velutina_2.jpg',
    'Olneya tesota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Olneya_tesota_1.jpg/512px-Olneya_tesota_1.jpg',
    'Acacia farnesiana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Acacia_farnesiana_1.jpg/512px-Acacia_farnesiana_1.jpg'
}

def clean_text(text):
    """Limpia y formatea texto"""
    if pd.isna(text) or text == '':
        return None
    return str(text).strip()

def parse_dimension(dimension_text):
    """Extrae valores numéricos de texto de dimensiones"""
    if pd.isna(dimension_text):
        return None
    
    text = str(dimension_text).lower()
    
    # Buscar patrones como "3.00-8.00 m", "hasta 15.00 m", etc.
    import re
    
    # Buscar rangos primero
    range_match = re.search(r'(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)', text)
    if range_match:
        min_val = float(range_match.group(1))
        max_val = float(range_match.group(2))
        return random.uniform(min_val, max_val)
    
    # Buscar "hasta X m"
    hasta_match = re.search(r'hasta\s+(\d+(?:\.\d+)?)', text)
    if hasta_match:
        max_val = float(hasta_match.group(1))
        return random.uniform(max_val * 0.6, max_val)
    
    # Buscar primer número
    number_match = re.search(r'(\d+(?:\.\d+)?)', text)
    if number_match:
        val = float(number_match.group(1))
        return random.uniform(val * 0.8, val * 1.2)
    
    return None

def generate_random_coordinates():
    """Genera coordenadas aleatorias dentro de Hermosillo"""
    lat = random.uniform(HERMOSILLO_BOUNDS['lat_min'], HERMOSILLO_BOUNDS['lat_max'])
    lon = random.uniform(HERMOSILLO_BOUNDS['lon_min'], HERMOSILLO_BOUNDS['lon_max'])
    return [lon, lat]  # GeoJSON usa [longitude, latitude]

def get_health_status():
    """Genera estado de salud realista"""
    statuses = [
        'Excelente', 'Muy bueno', 'Bueno', 'Regular', 'Necesita atención'
    ]
    weights = [0.15, 0.25, 0.35, 0.20, 0.05]  # Distribución realista
    return random.choices(statuses, weights=weights)[0]

def get_age_class():
    """Genera clase de edad realista"""
    ages = ['Joven', 'Adulto joven', 'Maduro', 'Viejo']
    weights = [0.30, 0.35, 0.25, 0.10]
    return random.choices(ages, weights=weights)[0]

def generate_observations(species_data):
    """Genera observaciones específicas basadas en los datos de la especie"""
    observations = []
    
    # Observaciones basadas en características específicas
    if 'floración' in str(species_data.get('Temporada', '')).lower():
        observations.append(f"Floración observada: {species_data.get('Temporada', 'No especificada')}")
    
    if 'espinas' in str(species_data.get('Textura', '')).lower():
        observations.append("Presenta espinas características de la especie")
    
    if 'caducifolio' in str(species_data.get('Persistencia de la hoja', '')).lower():
        observations.append("Pérdida estacional de follaje")
    
    # Observaciones ecológicas aleatorias
    eco_observations = [
        "Importante para polinizadores locales",
        "Proporciona sombra en zona urbana",
        "Adaptado a clima semiárido",
        "Parte del corredor ecológico urbano",
        "Refugio para avifauna local"
    ]
    
    if random.random() < 0.7:  # 70% probabilidad
        observations.append(random.choice(eco_observations))
    
    return "; ".join(observations) if observations else "Sin observaciones especiales"

def process_species_data():
    """Procesa el CSV y extrae datos de especies únicas"""
    print(f"Leyendo archivo CSV: {CSV_PATH}")
    
    # Leer CSV con encoding apropiado
    try:
        df = pd.read_csv(CSV_PATH, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(CSV_PATH, encoding='latin-1')
    
    print(f"Total de filas en CSV: {len(df)}")
    
    # Filtrar filas que tienen nombre científico
    df_clean = df[df['Nombre científico'].notna() & (df['Nombre científico'] != '')]
    print(f"Filas con nombre científico: {len(df_clean)}")
    
    # Obtener especies únicas
    especies_unicas = df_clean.drop_duplicates(subset=['Nombre científico'])
    print(f"Especies únicas encontradas: {len(especies_unicas)}")
    
    species_dict = {}
    
    for _, row in especies_unicas.iterrows():
        nombre_cientifico = clean_text(row.get('Nombre científico', ''))
        if not nombre_cientifico:
            continue
            
        nombre_comun = clean_text(row.get('Nombre común', ''))
        family = clean_text(row.get('Familia', ''))
        
        species_dict[nombre_cientifico] = {
            'nombre_comun': nombre_comun,
            'familia': family,
            'altura': clean_text(row.get('Altura', '')),
            'copa_ancho': clean_text(row.get('Copa θ/ Ancho', '')),
            'tronco_diametro': clean_text(row.get('Tronco θ', '')),
            'forma_copa': clean_text(row.get('Forma copa ', '')),
            'follaje': clean_text(row.get('Persistencia de la hoja', '')),
            'floración_color': clean_text(row.get('Color', '')),
            'floración_temporada': clean_text(row.get('Temporada', '')),
            'fruto_color': clean_text(row.get('Color.1', '')),
            'corteza_color': clean_text(row.get('Color.2', '')),
            'corteza_textura': clean_text(row.get('Textura', '')),
            'habitat': clean_text(row.get('Hábitat', '')),
            'exposicion_solar': clean_text(row.get('Agua', '')),
            'tasa_crecimiento': clean_text(row.get('Tasa de crecimiento', '')),
            'distribucion': clean_text(row.get('Distribución Natural', '')),
            'ecologia': clean_text(row.get('Ecología', '')),
            'usos': clean_text(row.get('Usos', '')),
            'observaciones_csv': clean_text(row.get('Observaciones', ''))
        }
    
    return species_dict

def generate_trees_geojson(species_dict):
    """Genera el GeoJSON con árboles realistas"""
    print("Generando datos de árboles...")
    
    features = []
    tree_id = 1
    
    # Generar múltiples árboles por especie (distribución realista)
    for nombre_cientifico, species_data in species_dict.items():
        # Número de árboles por especie (más común = más árboles)
        num_trees = random.randint(3, 25)  # Entre 3 y 25 árboles por especie
        
        for i in range(num_trees):
            # Generar datos cuantitativos realistas
            altura = parse_dimension(species_data.get('altura')) or random.uniform(2.0, 15.0)
            copa_diametro = parse_dimension(species_data.get('copa_ancho')) or random.uniform(1.5, altura * 0.8)
            tronco_diametro = parse_dimension(species_data.get('tronco_diametro')) or random.uniform(0.1, 1.2)
            
            # Datos cualitativos
            salud = get_health_status()
            edad_clase = get_age_class()
            observaciones = generate_observations(species_data)
            
            # URL de foto (usar una por defecto o específica de la especie)
            photo_url = DEFAULT_PHOTO_URLS.get(nombre_cientifico, 
                                             f"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Tree_silhouette.svg/256px-Tree_silhouette.svg.png")
            
            feature = {
                "type": "Feature",
                "properties": {
                    "id": tree_id,
                    "species": nombre_cientifico,
                    "common_name": species_data.get('nombre_comun', 'No disponible'),
                    "family": species_data.get('familia', 'No disponible'),
                    
                    # Datos cuantitativos
                    "height": round(altura, 2),
                    "canopy_diameter": round(copa_diametro, 2),
                    "trunk_diameter": round(tronco_diametro, 2),
                    
                    # Datos cualitativos
                    "health": salud,
                    "age_class": edad_clase,
                    "canopy_shape": species_data.get('forma_copa', 'No disponible'),
                    "leaf_persistence": species_data.get('follaje', 'No disponible'),
                    "flowering_color": species_data.get('floración_color', 'No disponible'),
                    "flowering_season": species_data.get('floración_temporada', 'No disponible'),
                    "fruit_color": species_data.get('fruto_color', 'No disponible'),
                    "bark_color": species_data.get('corteza_color', 'No disponible'),
                    "bark_texture": species_data.get('corteza_textura', 'No disponible'),
                    
                    # Datos ecológicos y de manejo
                    "habitat": species_data.get('habitat', 'No disponible'),
                    "sun_exposure": species_data.get('exposicion_solar', 'No disponible'),
                    "growth_rate": species_data.get('tasa_crecimiento', 'No disponible'),
                    "natural_distribution": species_data.get('distribucion', 'No disponible'),
                    "ecology": species_data.get('ecologia', 'No disponible'),
                    "uses": species_data.get('usos', 'No disponible'),
                    "observations": observaciones,
                    
                    # Metadatos
                    "photo_url": photo_url,
                    "last_survey": datetime.now().strftime("%Y-%m-%d"),
                    "surveyor": "Inventario HMO-Tree 2024"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": generate_random_coordinates()
                }
            }
            
            features.append(feature)
            tree_id += 1
    
    # Crear GeoJSON completo
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": datetime.now().isoformat(),
            "total_trees": len(features),
            "unique_species": len(species_dict),
            "source": "CSV Especies Árboles Hermosillo",
            "coordinate_system": "WGS84",
            "bounds": HERMOSILLO_BOUNDS
        },
        "features": features
    }
    
    return geojson

def main():
    """Función principal"""
    print("=== Procesador CSV a GeoJSON para HMO-Tree ===")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Procesar especies del CSV
        species_dict = process_species_data()
        
        if not species_dict:
            print("❌ No se encontraron especies válidas en el CSV")
            return
        
        print(f"✅ {len(species_dict)} especies procesadas exitosamente")
        
        # Generar GeoJSON
        geojson_data = generate_trees_geojson(species_dict)
        
        print(f"✅ {geojson_data['metadata']['total_trees']} árboles generados")
        
        # Guardar archivo
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Archivo GeoJSON guardado en: {OUTPUT_PATH}")
        
        # Mostrar estadísticas
        print("\n=== ESTADÍSTICAS ===")
        print(f"Especies únicas: {geojson_data['metadata']['unique_species']}")
        print(f"Total de árboles: {geojson_data['metadata']['total_trees']}")
        print(f"Área de cobertura: Hermosillo, Sonora")
        print(f"Coordenadas: {HERMOSILLO_BOUNDS['lat_min']:.3f}°N - {HERMOSILLO_BOUNDS['lat_max']:.3f}°N")
        print(f"              {abs(HERMOSILLO_BOUNDS['lon_min']):.3f}°W - {abs(HERMOSILLO_BOUNDS['lon_max']):.3f}°W")
        
        # Mostrar algunas especies encontradas
        print(f"\n=== ESPECIES INCLUIDAS (muestra) ===")
        species_names = list(species_dict.keys())[:10]
        for i, species in enumerate(species_names, 1):
            common_name = species_dict[species].get('nombre_comun', 'Sin nombre común')
            print(f"{i:2d}. {species} ({common_name})")
        
        if len(species_dict) > 10:
            print(f"    ... y {len(species_dict) - 10} especies más")
        
        print(f"\n✅ Proceso completado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante el procesamiento: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
