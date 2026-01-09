async function cargarContenido() {
    try {
        // Usamos data.json con el truco para evitar la caché
        const respuesta = await fetch('./data.json?v=' + new Date().getTime());
        
        if (!respuesta.ok) throw new Error("Archivo no encontrado");

        const datos = await respuesta.json();

        // IMPORTANTE: Los nombres aquí deben ser iguales a los de tu data.json
        document.getElementById('titulo-principal').innerText = datos.titulo;
        document.getElementById('descripcion-principal').innerText = datos.descripcion;
        document.getElementById('temp').innerText = datos.clima;
        document.getElementById('noticias-scroll').innerText = datos.noticias_barra;

        console.log("Sincronización exitosa con data.json");

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}
