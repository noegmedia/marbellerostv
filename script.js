// FUNCIÓN RELOJ
function reloj() {
    const elementoReloj = document.getElementById('reloj');
    if(elementoReloj) {
        elementoReloj.innerText = new Date().toLocaleTimeString();
    }
}
setInterval(reloj, 1000);

// FUNCIÓN DATOS
async function cargar() {
    try {
        const respuesta = await fetch('./data.json?v=' + Date.now());
        const d = await respuesta.json();
        
        // Ponemos las locales en la descripción o un área central
        document.getElementById('descripcion-principal').innerText = d.noticias_locales;
        
        // Ponemos las nacionales en la barra de abajo
        const ticker = document.getElementById('noticias-scroll');
        if (ticker) {
            ticker.innerText = d.noticias_nacionales;
        }
    } catch (e) {
        console.log("Error cargando noticias");
    }
}

cargar();
setInterval(cargar, 10000);
