import os
import urllib.request
import json
import xml.etree.ElementTree as ET
from datetime import datetime

def buscar_rss(url, limite=5):
    """Busca titulares en cualquier fuente RSS."""
    try:
        # Añadimos un User-Agent para que las webs no bloqueen al robot
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            tree = ET.parse(response)
            root = tree.getroot()
            # Buscamos los títulos dentro de cada <item>
            items = root.findall('.//item')
            titulares = [item.find('title').text.strip() for item in items[:limite]]
            return titulares
    except Exception as e:
        print(f"Error en RSS {url}: {e}")
        return ["Actualizando información local..."]

def obtener_clima_real():
    """Obtiene el clima de Marbella usando la API Key segura de los Secrets."""
    api_key = os.environ.get('CLIMA_KEY')
    
    if not api_key:
        # Si aún no has configurado el Secret, devolvemos un dato por defecto
        return {"temp": "19°C", "estado": "Configurar API", "alerta": "verde"}

    try:
        ciudad = "Marbella,ES"
        url = f"http://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={api_key}&units=metric&lang=es"
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            temp = f"{round(data['main']['temp'])}°C"
            estado = data['weather'][0]['description'].capitalize()
            
            # LÓGICA DE ALERTAS AUTOMÁTICA
            alerta = "verde"
            # Ejemplo: Alerta naranja si supera los 35 grados
            if data['main']['temp'] > 35: 
                alerta = "naranja"
            # Alerta roja si hay condiciones extremas detectadas en el texto
            palabras_peligro = ["tormenta", "huracán", "nieve", "granizo"]
            if any(p in estado.lower() for p in palabras_peligro):
                alerta = "rojo"
            
            return {"temp": temp, "estado": estado, "alerta": alerta}
    except Exception as e:
        print(f"Error clima: {e}")
        return {"temp": "--°C", "estado": "Error de conexión", "alerta": "verde"}

def ejecutar_sistema():
    print(f"Iniciando actualización: {datetime.now()}")

    # 1. Obtener Noticias Locales (Marbella)
    # Usamos Diario SUR sección Marbella por ser muy fiable
    noticias_locales_lista = buscar_rss("https://www.diariosur.es/marbella/rss/")
    
    # 2. Obtener Noticias Nacionales (España)
    noticias_nacionales_lista = buscar_rss("https://www.rtve.es/api/noticias/rss/")
    
    # 3. Obtener Agenda Cultural (Málaga/Marbella)
    agenda_lista = buscar_rss("https://www.juntadeandalucia.es/cultura/agendacultural/rss/malaga", limite=4)

    # 4. Obtener Clima
    datos_clima = obtener_clima_real()

    # CONSOLIDAR TODO EL JSON
    # Este es el archivo que tu script.js leerá
    datos_finales = {
        "titulo": "MARBELLA DIGITAL",
        "clima": datos_clima,
        "noticias_locales": " • ".join(noticias_locales_lista), # Formato para el titular grande
        "noticias_nacionales": " --- ".join(noticias_nacionales_lista), # Formato para el ticker inferior
        "eventos": agenda_lista,
        "ultima_actualizacion": datetime.now().strftime("%H:%M")
    }

    # Guardar en data.json
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(datos_finales, f, ensure_ascii=False, indent=4)
    
    print("¡Sistema actualizado con éxito!")

if __name__ == "__main__":
    ejecutar_sistema()
