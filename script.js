// VARIABLES DE ESTADO
let listaNoticias = [];
let noticiaActualIndex = 0;

// 1. RELOJ GIGANTE
function actualizarReloj() {
    const ahora = new Date();
    const h = String(ahora.getHours()).padStart(2, '0');
    const m = String(ahora.getMinutes()).padStart(2, '0');
    const s = String(ahora.getSeconds()).padStart(2, '0');
    document.getElementById('reloj').innerText = `${h}:${m}:${s}`;
}
setInterval(actualizarReloj, 1000);

// 2. FUNCIÓN PARA ROTAR NOTICIAS (Solo cambia el texto)
function rotarNoticias() {
    if (listaNoticias.length === 0) return;

    const contenedor = document.getElementById('noticia-principal');
    contenedor.style.opacity = 0;

    setTimeout(() => {
        const n = listaNoticias[noticiaActualIndex];
        
        // Creamos la estructura de Titular + Subtítulo
        contenedor.innerHTML = `
            <div class="titular-grande">${n.Titular}</div>
            <div class="subtitulo-noticia">${n.Subtitulo || ''}</div>
        `;
        
        contenedor.style.opacity = 1;
        noticiaActualIndex = (noticiaActualIndex + 1) % listaNoticias.length;
    }, 500);
}

// 3. CARGA DE DATOS DESDE DATA.JSON (Y API CLIMA vía Python)
async function cargarDatos() {
    try {
        const respuesta = await fetch('./data.json?v=' + Date.now());
        const d = await respuesta.json();

        // --- CLIMA ---
        document.getElementById('clima-temp').innerText = d.clima.temp;
        document.getElementById('clima-texto').innerText = d.clima.estado;
        document.getElementById('clima-icono').src = `https://openweathermap.org/img/wn/${d.clima.icono_id}@2x.png`;

        // --- TICKER (Última hora) ---
        document.getElementById('ticker-footer').innerHTML = d.ticker_footer.split(' • ').join(' <span style="color:var(--azul); padding: 0 40px;"> ■ </span> ');

        // --- TELÉFONOS ---
        const listaT = document.getElementById('lista-t');
        listaT.innerHTML = d.telefonos.map(t => `
            <li><span>${t.Servicio}</span> <span>${t.Numero}</span></li>
        `).join('');

        // --- PROCESAR NOTICIAS PARA ROTACIÓN ---
        // Combinamos la noticia destacada (D) con las normales (N) para que todas roten
        listaNoticias = [];
        if (d.noticia_destacada) listaNoticias.push(d.noticia_destacada);
        if (d.noticias_normales) listaNoticias.push(...d.noticias_normales);

        // Iniciamos la primera noticia si la lista estaba vacía
        if (listaNoticias.length > 0 && noticiaActualIndex === 0) {
            document.getElementById('noticia-principal').innerText = listaNoticias[0].Titular;
            noticiaActualIndex = 1;
        }

        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// --- CONFIGURACIÓN DE TIEMPOS ---

// Recargar el JSON del servidor cada 5 minutos (datos nuevos del Excel)
setInterval(cargarDatos, 300000); 

// Rotar el titular en pantalla cada 10 segundos
setInterval(rotarNoticias, 10000);

// Refrescar las cámaras DGT cada 30 segundos para que no sean estáticas
setInterval(() => {
    document.querySelectorAll('.cam-box img').forEach(img => {
        const baseSrc = img.src.split('?')[0];
        img.src = baseSrc + '?v=' + Date.now();
    });
}, 30000);

// Inicio inmediato
cargarDatos();
actualizarReloj();