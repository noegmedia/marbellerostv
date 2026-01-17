let current = 1;
const timings = { 1: 5000, 2: 15000, 3: 10000, 4: 15000, 5: 10000 };

async function loadData() {
    try {
        const res = await fetch('./data.json?v=' + Date.now());
        const d = await res.json();
        
        // Destacada
        document.getElementById('destacada-container').innerHTML = `
            <img src="${d.noticia_destacada.ImagenURL}">
            <div class="txt"><h1>${d.noticia_destacada.Titular}</h1><p>${d.noticia_destacada.Subtitulo}</p></div>`;

        // Normales
        document.getElementById('lista-noticias').innerHTML = d.noticias_normales
            .map(n => `<div class="card-n"><img src="${n.ImagenURL}"><h3>${n.Titular}</h3></div>`).join('');

        // Clima
        document.getElementById('clima-info').innerHTML = `<h1>MARBELLA: ${d.clima.temp} | Humedad: ${d.clima.humedad}</h1>`;

        // Telefonos
        document.getElementById('telefonos-grid').innerHTML = d.telefonos
            .map(t => `<div class="tel-item"><span>${t.Servicio}</span><span>${t.Numero}</span></div>`).join('');

    } catch (e) { console.error("Error al cargar datos"); }
}

function updateTraffic() {
    // Refresca las cámaras DGT añadiendo un timestamp para evitar caché
    document.querySelectorAll('.cam-box img').forEach(img => {
        const src = img.src.split('?')[0];
        img.src = src + '?t=' + Date.now();
    });
}

function run() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(`escena-${current}`).classList.add('active');
    
    if(current === 4) updateTraffic();

    setTimeout(() => {
        current = current < 5 ? current + 1 : 1;
        run();
    }, timings[current]);
}

loadData();
setInterval(loadData, 300000);
run();
