import urllib.request
import json
import xml.etree.ElementTree as ET
from datetime import datetime

def buscar_rss(url, limite=5):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        tree = ET.parse(response)
        root = tree.getroot()
        return [item.find('title').text for item in root.findall('.//item')[:limite]]
    except Exception as e:
        return [f"Actualizando información..."]

# Simulación de motor de clima (Aquí podrías conectar una API en el futuro)
def obtener_clima_marbella():
    return {
        "temp": "19°C",
        "estado": "Cielos Despejados",
        "alerta": "verde" # Cambiar a 'amarillo', 'naranja' o 'rojo' manualmente o vía API
    }

datos = {
    "titulo": "MARBELLA DIGITAL",
    "clima": obtener_clima_marbella(),
    "noticias_locales": " • ".join(buscar_rss("https://www.diariosur.es/marbella/rss/")),
    "noticias_nacionales": " --- ".join(buscar_rss("https://www.rtve.es/api/noticias/rss/")),
    "eventos": buscar_rss("https://www.juntadeandalucia.es/cultura/agendacultural/rss/malaga", 4)
}

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(datos, f, ensure_ascii=False, indent=4)
