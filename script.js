let currentEscena = 1;

function updateClock() {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString('es-ES', { hour12: false });
}
setInterval(updateClock, 1000);

function switchScene() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(`escena-${currentEscena}`).classList.add('active');
    
    // Si entramos en cámaras, forzar refresco
    if(currentEscena === 2) {
        document.querySelectorAll('.cam-box img').forEach(img => {
            const src = img.src.split('?')[0];
            img.src = src + '?t=' + Date.now();
        });
    }

    currentEscena = currentEscena < 3 ? currentEscena + 1 : 1;
}

async function loadData() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        // Clima
        document.getElementById('clima-temp').innerText = d.clima.temp;
        document.getElementById('clima-texto').innerText = d.clima.estado;
        document.getElementById('clima-icono').src = `https://openweathermap.org/img/wn/${d.clima.icono_id}@2x.png`;

        // Ticker
        document.getElementById('ticker-footer').innerText = d.ticker_footer;

        // Noticia Destacada
        document.getElementById('noticia-principal').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="info-box">
                <h1>${d.noticia_destacada.Titular}</h1>
                <p style="font-size:2rem;">${d.noticia_destacada.Subtitulo}</p>
            </div>`;

        // Teléfonos
        document.getElementById('lista-t').innerHTML = d.telefonos
            .map(t => `<div class="tel-row"><span>${t.Servicio}</span><span>${t.Numero}</span></div>`).join('');

    } catch (e) { console.log("Cargando..."); }
}

setInterval(switchScene, 15000); // Cada escena dura 15 segundos
setInterval(loadData, 300000);
loadData();
updateClock();
switchScene();
