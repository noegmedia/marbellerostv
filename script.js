async function actualizarPantalla() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();

        // Titulares y Noticias
        document.getElementById('noticias-locales').innerText = d.noticias_locales;
        document.getElementById('ticker-nacional').innerText = d.noticias_nacionales;
        
        // Clima
        document.getElementById('temp').innerText = d.clima.temp;
        document.getElementById('estado-clima').innerText = d.clima.estado;
        document.getElementById('clima-alerta').className = 'clima-box alerta-' + d.clima.alerta;

        // Eventos
        const lista = document.getElementById('lista-eventos');
        lista.innerHTML = d.eventos.map(e => `<li>${e}</li>`).join('');

    } catch (e) { console.error("Error cargando datos"); }
}

function reloj() {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString();
}

setInterval(reloj, 1000);
setInterval(actualizarPantalla, 60000); // Actualiza cada minuto
actualizarPantalla();
