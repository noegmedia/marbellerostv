async function actualizarPantalla() {
    try {
        // Añadimos un número aleatorio al final para evitar que el navegador guarde una copia vieja (cache)
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();

        // 1. Noticias Locales (Titulares grandes en el centro)
        const contenedorLocales = document.getElementById('noticias-locales');
        if (contenedorLocales) {
            contenedorLocales.innerText = d.noticias_locales;
        }

        // 2. Ticker Nacional (Barra inferior en movimiento)
        const ticker = document.getElementById('ticker-nacional');
        if (ticker) {
            // Duplicamos el texto para que el bucle no tenga huecos
            ticker.innerText = d.noticias_nacionales + " --- " + d.noticias_nacionales;
        }
        
        // 3. Clima y Alertas
        document.getElementById('temp').innerText = d.clima.temp;
        document.getElementById('estado-clima').innerText = d.clima.estado;
        
        const cajaClima = document.getElementById('clima-alerta');
        if (cajaClima) {
            // Esto cambia el color de la caja automáticamente (verde, amarillo, rojo)
            cajaClima.className = 'clima-box alerta-' + d.clima.alerta;
        }

        // 4. Agenda de Eventos
        const listaEventos = document.getElementById('lista-eventos');
        if (listaEventos && d.eventos) {
            listaEventos.innerHTML = d.eventos
                .map(evento => `<li>${evento}</li>`)
                .join('');
        }

    } catch (e) {
        console.error("Error al cargar los datos del JSON:", e);
    }
}

// Reloj en tiempo real
function actualizarReloj() {
    const ahora = new Date();
    const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES', opciones);
}

// Ejecución inicial y bucles
setInterval(actualizarReloj, 1000); // Cada segundo
setInterval(actualizarPantalla, 300000); // Cada 5 minutos busca noticias nuevas en el JSON

actualizarReloj();
actualizarPantalla();
