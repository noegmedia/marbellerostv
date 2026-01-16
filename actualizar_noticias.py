import os
import urllib.request
import json
import re
from datetime import datetime

def buscar_titulares(url, limite=5):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            # Usamos "Regex" en lugar de XML para que no se rompa con caracteres raros
            titulos = re.findall(r'<title>(.*?)</title>', html)
            # El primer título suele ser el nombre de la web, lo saltamos
            resultados = [t.replace('<![CDATA[', '').replace(']]>', '').strip() for t in titulos[1:limite+1]]
            return resultados if resultados else ["Actualizando noticias..."]
    except Exception as e:
        print(f"Error en fuente {url}: {e}")
        return ["Noticias de Marbella en actualización..."]

def obtener_clima_real():
    api_key = os.environ.get('CLIMA_KEY')
    if not api_key:
        return {"temp": "19°C", "estado": "Despejado", "alerta": "verde"}
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q=Marbella,ES&appid={api_key}&units=metric&lang=es"
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            temp = f"{round(data['main']['temp'])}°C"
            estado = data['weather'][0]['description'].capitalize()
            alerta = "verde"
            if data['main']['temp'] > 35: alerta = "naranja"
            if "tormenta" in estado.lower(): alerta = "rojo"
            return {"temp": temp, "estado": estado, "alerta": alerta}
    except:
        return {"temp": "--°C", "estado": "Cielo despejado", "alerta": "verde"}

# --- EJECUCIÓN ---
print(f"Iniciando actualización: {datetime.now()}")

# Fuentes actualizadas y estables
noticias_marbella = buscar_titulares("https://www.laopiniondemalaga.es/rss/section/1105") # Marbella en La Opinión
noticias_espana = buscar_titulares("https://www.abc.es/rss/2.0/espana/") # España estable
eventos = buscar_titulares("https://www.malagahoy.es/rss/marbella/") # Alternativa eventos/noticias locales

datos_finales = {
    "titulo": "MARBELLA DIGITAL",
    "clima": obtener_clima_real(),
    "noticias_locales": " • ".join(noticias_marbella),
    "noticias_nacionales": " --- ".join(noticias_espana),
    "eventos": eventos[:4],
    "ultima_actualizacion": datetime.now().strftime("%H:%M")
}

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(datos_finales, f, ensure_ascii=False, indent=4)

print("¡Sistema actualizado con éxito con nuevas fuentes!")
