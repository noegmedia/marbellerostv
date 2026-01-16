async function actualizarPantalla() {
    try {
        // El Date.now() evita que la TV guarde noticias viejas en memoria
        const respuesta = await fetch('./data.json?v=' + Date.now());
        const datos = await respuesta.json();

        // 1. TITULARES DE MARBELLA (Sección central)
        // Usamos innerHTML por si el texto trae caracteres especiales
        const contenedorLocales = document.getElementById('noticias-locales');
        if (contenedorLocales) {
            contenedorLocales.innerHTML = datos.noticias_locales || "Cargando noticias locales...";
        }

        // 2. TICKER NACIONAL (Barra inferior limpia)
        const ticker = document.getElementById('ticker-nacional');
        if (ticker) {
            // Añadimos mucho espacio al final para que el bucle sea fluido
            ticker.innerText = datos.noticias_nacionales + "          ---          ";
        }
        
        // 3. CLIMA REAL
        document.getElementById('temp').innerText = datos.clima.temp;
        document.getElementById('estado-clima').innerText = datos.clima.estado;
        
        const cajaClima = document.getElementById('clima-alerta');
        if (cajaClima) {
            // Actualiza el color de la alerta (verde, amarillo, naranja, rojo)
            cajaClima.className = 'clima-box alerta-' + datos.clima.alerta;
        }

        // 4. AGENDA DE EVENTOS
        const listaEventos = document.getElementById('lista-eventos');
        if (listaEventos && datos.eventos) {
            listaEventos.innerHTML = datos.eventos
                .map(evento => `<li>${evento}</li>`)
                .join('');
        }

    } catch (error) {
        console.error("Error al leer el archivo de datos:", error);
    }
}

// Reloj digital profesional
function iniciarReloj() {
    const relojElemento = document.getElementById('reloj');
    setInterval(() => {
        const ahora = new Date();
        relojElemento.innerText = ahora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }, 1000);
}

// LANZAMIENTO
iniciarReloj();
actualizarPantalla();

// El robot de GitHub actualiza el JSON cada hora, 
// pero el script revisa el archivo cada 5 minutos por si hay cambios manuales.
setInterval(actualizarPantalla, 300000); 
