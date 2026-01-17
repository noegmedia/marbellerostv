import csv, json, urllib.request, os
from datetime import datetime

ID_HOJA = "1Q2Wc3xX1fZ8ynhyrYrRBDiWYQY6E0KSsLffqWDnCjRw"
URL_NOTICIAS = f"https://docs.google.com/spreadsheets/d/{ID_HOJA}/export?format=csv&gid=0"
URL_TELEFONOS = f"https://docs.google.com/spreadsheets/d/{ID_HOJA}/export?format=csv&sheet=Telefonos"

def descargar_csv(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            lineas = response.read().decode('utf-8').splitlines()
            return list(csv.DictReader(lineas))
    except: return []

def actualizar():
    noticias_raw = descargar_csv(URL_NOTICIAS)
    telefonos_raw = descargar_csv(URL_TELEFONOS)

    destacada = next((n for n in noticias_raw if n.get('Tipo') == 'D'), None)
    normales = [n for n in noticias_raw if n.get('Tipo') == 'N'][:4]
    noticias_f = [n.get('Titular') for n in noticias_raw if n.get('Tipo') == 'F']

    datos = {
        "noticia_destacada": destacada or {"Titular": "Bienvenidos", "Subtitulo": "MarbellerosTV", "ImagenURL": ""},
        "noticias_normales": normales,
        "ticker_footer": " • ".join(noticias_f) if noticias_f else "MarbellerosTV en directo",
        "telefonos": telefonos_raw,
        "clima": {"temp": "18°C", "estado": "SIN ALERTAS"}
    }
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=4)

if __name__ == "__main__": actualizar()
