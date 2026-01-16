import os
import urllib.request
import json
import re
from datetime import datetime

def buscar_titulares(url, backup_msg):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read().decode('utf-8', errors='ignore')
            # Buscamos lo que hay entre <title> y </title>
            encontrados = re.findall(r'<title>(.*?)</title>', content)
            # Limpiamos y quitamos el primer título (suele ser el nombre del diario)
            limpios = [t.replace('<![CDATA[', '').replace(']]>', '').strip() for t in encontrados[1:6]]
            return limpios if len(limpios) > 0 else [backup_msg]
    except:
        return [backup_msg]

# Ejecución
clima = {"temp": "19°C", "estado": "Despejado", "alerta": "verde"} # Por defecto
# Aquí iría tu lógica de OpenWeather que ya tenemos...

datos = {
    "titulo": "MARBELLA DIGITAL",
    "clima": clima,
    "noticias_locales": " • ".join(buscar_titulares("https://www.laopiniondemalaga.es/rss/section/1105", "Marbella: Actualidad local en directo")),
    "noticias_nacionales": " --- ".join(buscar_titulares("https://www.abc.es/rss/2.0/espana/", "Siga la actualidad nacional en Marbella TV")),
    "eventos": buscar_titulares("https://www.malagahoy.es/rss/marbella/", "Consulta la agenda cultural en nuestra web")[:4]
}

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(datos, f, ensure_ascii=False, indent=4)
