import csv, json, urllib.request, os

# Configuraciones que ya tenemos preparadas
ID_HOJA = "1Q2Wc3xX1fZ8ynhyrYrRBDiWYQY6E0KSsLffqWDnCjRw"
API_KEY_WEATHER = "TU_API_KEY_AQUI" # Usando la API de OpenWeather como ya establecimos
CIUDAD = "Marbella,ES"

URL_NOTICIAS = f"https://docs.google.com/spreadsheets/d/{ID_HOJA}/export?format=csv&gid=0"
URL_TELEFONOS = f"https://docs.google.com/spreadsheets/d/{ID_HOJA}/export?format=csv&sheet=Telefonos"
URL_WEATHER = f"https://api.openweathermap.org/data/2.5/weather?q={CIUDAD}&appid={API_KEY_WEATHER}&units=metric&lang=es"

def obtener_clima():
    try:
        with urllib.request.urlopen(URL_WEATHER, timeout=5) as response:
            data = json.loads(response.read().decode())
            return {
                "temp": f"{round(data['main']['temp'])}°C",
                "estado": data['weather'][0]['description'].upper(),
                "icono_id": data['weather'][0]['icon']
            }
    except:
        return {"temp": "18°C", "estado": "DESPEJADO", "icono_id": "01d"}

def actualizar():
    # Descarga de Excel (Noticias y Ticker F)
    noticias_raw = []
    try:
        req = urllib.request.Request(URL_NOTICIAS, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as res:
            lineas = res.read().decode('utf-8').splitlines()
            noticias_raw = list(csv.DictReader(lineas))
    except: pass

    destacada = next((n for n in noticias_raw if n.get('Tipo') == 'D'), None)
    normales = [n for n in noticias_raw if n.get('Tipo') == 'N'][:4]
    noticias_f = [n.get('Titular') for n in noticias_raw if n.get('Tipo') == 'F']

    datos = {
        "noticia_destacada": destacada or {"Titular": "Bienvenidos", "Subtitulo": "MarbellerosTV", "ImagenURL": ""},
        "noticias_normales": normales,
        "ticker_footer": " • ".join(noticias_f) if noticias_f else "MarbellerosTV",
        "clima": obtener_clima()
    }

    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    actualizar()
