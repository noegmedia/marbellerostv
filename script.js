async function cargarContenido() {
    try {
        // Añadimos un número aleatorio al final para evitar que el navegador guarde una versión vieja (cache)
        const respuesta = await fetch('datos.json?v=' + Math.random());
        const datos = await respuesta.json();

        console.log("Datos recibidos:", datos); // Esto te dirá en la consola si los lee

        if(document.getElementById('titulo-principal')) 
            document.getElementById('titulo-principal').innerText = datos.titulo;
        
        if(document.getElementById('descripcion-principal'))
            document.getElementById('descripcion-principal').innerText = datos.descripcion;
        
        if(document.getElementById('temp'))
            document.getElementById('temp').innerText = datos.clima;
            
        if(document.getElementById('noticias-scroll'))
            document.getElementById('noticias-scroll').innerText = datos.noticias_barra;

    } catch (error) {
        console.error("Error leyendo el JSON:", error);
    }
}

// Actualizar cada 5 segundos
setInterval(cargarContenido, 5000);
cargarContenido();
