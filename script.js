async function cargarContenido() {
    console.log("Intentando cargar datos...");
    try {
        const respuesta = await fetch('./datos.json?t=' + new Date().getTime());
        
        if (!respuesta.ok) {
            throw new Error("No se pudo encontrar el archivo datos.json");
        }

        const datos = await respuesta.json();
        console.log("¡Datos cargados con éxito!", datos);

        // Actualizamos los elementos si existen
        const titulo = document.getElementById('titulo-principal');
        if (titulo) titulo.innerText = datos.titulo || "Sin título";

        const desc = document.getElementById('descripcion-principal');
        if (desc) desc.innerText = datos.descripcion || "Sin descripción";

        const clima = document.getElementById('temp');
        if (clima) clima.innerText = datos.clima || "--°C";

        const ticker = document.getElementById('noticias-scroll');
        if (ticker) ticker.innerText = datos.noticias_barra || "Cargando noticias...";

    } catch (error) {
        console.error("ERROR DETECTADO:", error.message);
    }
}

// Reloj siempre activo
setInterval(() => {
    const reloj = document.getElementById('reloj');
    if (reloj) reloj.innerText = new Date().toLocaleTimeString();
}, 1000);

// Cargar al inicio y cada 10 segundos
cargarContenido();
setInterval(cargarContenido, 10000);
    
