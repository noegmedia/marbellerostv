// Actualización del reloj cada segundo
setInterval(() => {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES', { hour12: false });
}, 1000);

async function load() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        // Datos del Clima (OpenWeather)
        document.getElementById('clima-temp').innerText = d.clima.temp;
        document.getElementById('clima-texto').innerText = d.clima.estado;
        document.getElementById('clima-icono').src = `https://openweathermap.org/img/wn/${d.clima.icono_id}@2x.png`;
        
        // Noticia Principal
        document.getElementById('noticia-principal').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="info-d">
                <h1>${d.noticia_destacada.Titular}</h1>
                <p>${d.noticia_destacada.Subtitulo}</p>
            </div>`;

        // Ticker Footer (Tipo F)
        document.getElementById('ticker-footer').innerText = d.ticker_footer;

        // Aquí iría el resto de la carga de lista-n y lista-t que ya tienes configurada
    } catch (e) { console.log("Refrescando sistema..."); }
}

// Rotación del panel derecho cada 15 segundos
setInterval(rotarPanelDerecho, 15000); 
load();
setInterval(load, 300000); // Recarga de Excel y Clima cada 5 minutos
