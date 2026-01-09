// 1. FUNCIÓN PARA EL RELOJ
function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString();
}
setInterval(actualizarReloj, 1000);

// 2. FUNCIÓN PARA LEER TUS DATOS
async function cargarContenido() {
    try {
        // Buscamos el archivo de texto con la info
        const respuesta = await fetch('datos.json');
        const datos = await respuesta.json();

        // Ponemos los textos en su sitio
        document.getElementById('titulo-principal').innerText = datos.titulo;
        document.getElementById('descripcion-principal').innerText = datos.descripcion;
        document.getElementById('temp').innerText = datos.clima;
        document.getElementById('noticias-scroll').innerText = datos.ultima_hora;
        
    } catch (error) {
        console.log("Esperando datos...");
    }
}
            
// Revisa si hay cambios cada 5 segundos
setInterval(cargarContenido, 5000);
cargarContenido();
