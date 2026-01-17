let current = 1;
const timings = { 1: 5000, 2: 15000, 3: 10000, 4: 15000, 5: 10000 };

function actualizarReloj() {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString('es-ES');
}
setInterval(actualizarReloj, 1000);

async function loadData() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        // Ticker Footer desde Excel (Tipo F)
        document.getElementById('ticker-footer').innerText = d.ticker_footer;

        // Noticias
        document.getElementById('destacada-container').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="txt"><h1>${d.noticia_destacada.Titular}</h1><p>${d.noticia_destacada.Subtitulo}</p></div>`;

        document.getElementById('lista-noticias').innerHTML = d.noticias_normales
            .map(n => `<div style="display:flex; background:rgba(0,0,0,0.3); margin-bottom:10px; height:110px; border-radius:8px; overflow:hidden; border: 1px solid white;">
                <img src="${n.ImagenURL}" style="width:160px; object-fit:cover;">
                <h3 style="padding:10px; font-size:1.1rem; margin:0; color:white;">${n.Titular}</h3>
            </div>`).join('');

        // Listín
        document.getElementById('telefonos-grid').innerHTML = d.telefonos
            .map(t => `<div class="tel-item"><span>${t.Servicio}</span><span>${t.Numero}</span></div>`).join('');

        // Clima
        document.getElementById('clima-info').innerHTML = `<h1 style="font-size:3rem; color:white;">MARBELLA: ${d.clima.temp} | Humedad: ${d.clima.humedad}</h1>`;

    } catch (e) { console.error("Cargando..."); }
}

function run() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    const nextSlide = document.getElementById(`escena-${current}`);
    if(nextSlide) nextSlide.classList.add('active');
    
    setTimeout(() => {
        current = current < 5 ? current + 1 : 1;
        run();
    }, timings[current]);
}

loadData();
setInterval(loadData, 300000);
run();
