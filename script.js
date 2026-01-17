let subEscena = 1;

function rotarPanelDerecho() {
    document.querySelectorAll('.sub-slide').forEach(s => s.classList.remove('active'));
    if(subEscena === 1) document.getElementById('sub-escena-noticias').classList.add('active');
    if(subEscena === 2) document.getElementById('sub-escena-trafico').classList.add('active');
    if(subEscena === 3) document.getElementById('sub-escena-telefonos').classList.add('active');
    
    subEscena = subEscena < 3 ? subEscena + 1 : 1;
}

async function loadData() {
    const res = await fetch('./data.json?v=' + Date.now());
    const d = await res.json();
    
    // Noticia Principal
    document.getElementById('noticia-principal').innerHTML = `
        <img src="${d.noticia_destacada.ImagenURL}">
        <div class="info-d"><h1>${d.noticia_destacada.Titular}</h1><p>${d.noticia_destacada.Subtitulo}</p></div>`;
    
    // Lista Noticias Normales
    document.getElementById('lista-n').innerHTML = d.noticias_normales
        .map(n => `<div style="display:flex; margin-bottom:10px; background:rgba(0,0,0,0.2); padding:10px; border-radius:10px;">
            <img src="${n.ImagenURL}" style="width:100px; height:60px; object-fit:cover; border-radius:5px;">
            <h4 style="margin:0 0 0 10px; font-size:0.9rem;">${n.Titular}</h4>
        </div>`).join('');

    document.getElementById('ticker-footer').innerText = d.ticker_footer;
}

setInterval(rotarPanelDerecho, 10000); // Rota la derecha cada 10s
setInterval(() => {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString();
}, 1000);

loadData();
rotarPanelDerecho();
