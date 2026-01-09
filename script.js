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
        
        document.getElementById('titulo-principal').innerText = d.titulo;
        document.getElementById('descripcion-principal').innerText = d.descripcion;
        document.getElementById('temp').innerText = d.clima;
        document.getElementById('noticias-scroll').innerText = d.noticias_barra;
    } catch (e) {
        console.log("Error");
    }
}
cargar();
setInterval(cargar, 10000);
