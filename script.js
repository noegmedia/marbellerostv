let subEscena = 1;

function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES', { hour12: false });
}
setInterval(actualizarReloj, 1000);

function rotarPanelDerecho() {
    document.querySelectorAll('.sub-slide').forEach(s => s.classList.remove('active'));
    const ids = ['sub-noticias', 'sub-trafico', 'sub-telefonos'];
    document.getElementById(ids[subEscena - 1]).classList.add('active');
    
    // Si es tráfico, refrescar cámaras
    if(subEscena === 2) {
        document.querySelectorAll('.cam-box img').forEach(img => {
            const base = img.src.split('?')[0];
            img.src = base + '?v=' + Date.now();
        });
    }
    subEscena = subEscena < 3 ? subEscena + 1 : 1;
}

async function loadData() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        // Clima
        document.getElementById('clima-temp').innerText = d.clima.temp;
        document.getElementById('clima-texto').innerText = d.clima.estado;
        document.getElementById('clima-icono').src = `https://openweathermap.org/img/wn/${d.clima.icono_id}@2x.png`;

        // Noticia Principal
        document.getElementById('noticia-principal').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="info-d"><h1>${d.noticia_destacada.Titular}</h1><p>${d.noticia_destacada.Subtitulo}</p></div>`;

        // Ticker
        document.getElementById('ticker-footer').innerText = d.ticker_footer;

        // Lista Noticias N
        document.getElementById('lista-n').innerHTML = d.noticias_normales
            .map(n => `<div class="item-n"><img src="${n.ImagenURL}"><h4>${n.Titular}</h4></div>`).join('');

        // Lista Teléfonos
        document.getElementById('lista-t').innerHTML = d.telefonos
            .map(t => `<div style="background:white; color:#004a99; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; font-weight:bold; font-size:1.3rem;">
                <span>${t.Servicio}</span><span>${t.Numero}</span></div>`).join('');

    } catch (e) { console.log("Cargando datos..."); }
}

setInterval(rotarPanelDerecho, 15000);
setInterval(loadData, 300000);
loadData();
actualizarReloj();
rotarPanelDerecho();
