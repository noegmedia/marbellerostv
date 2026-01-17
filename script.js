let subEscena = 1;

function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES');
}
setInterval(actualizarReloj, 1000);

function rotarPanelDerecho() {
    document.querySelectorAll('.sub-slide').forEach(s => s.classList.remove('active'));
    const ids = ['sub-noticias', 'sub-trafico', 'sub-telefonos'];
    document.getElementById(ids[subEscena - 1]).classList.add('active');
    subEscena = subEscena < 3 ? subEscena + 1 : 1;
}

async function load() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        document.getElementById('ticker-footer').innerText = d.ticker_footer;
        document.getElementById('clima-temp').innerText = d.clima.temp;
        
        document.getElementById('noticia-principal').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="info-d"><h1>${d.noticia_destacada.Titular}</h1><p>${d.noticia_destacada.Subtitulo}</p></div>`;

        document.getElementById('lista-n').innerHTML = d.noticias_normales
            .map(n => `<div style="display:flex; margin-bottom:15px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
                <img src="${n.ImagenURL}" style="width:100px; height:70px; object-fit:cover;">
                <h4 style="margin:10px; font-size:1rem;">${n.Titular}</h4></div>`).join('');

        document.getElementById('lista-t').innerHTML = d.telefonos
            .map(t => `<div style="background:white; color:#004a99; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; font-weight:bold;">
                <span>${t.Servicio}</span><span>${t.Numero}</span></div>`).join('');
    } catch (e) { console.log("Cargando..."); }
}

setInterval(rotarPanelDerecho, 12000);
load();
setInterval(load, 300000);
actualizarReloj();
rotarPanelDerecho();
