async function cargarContenido() {
  try {
    // Fíjate bien: nombre exacto 'data.json'
    const res = await fetch('./data.json?v=' + Date.now());
    const d = await res.json();

    document.getElementById('titulo-principal').innerText = d.titulo;
    document.getElementById('descripcion-principal').innerText = d.descripcion;
    document.getElementById('temp').innerText = d.clima;
    document.getElementById('noticias-scroll').innerText = d.noticias_barra;
  } catch (e) {
    console.log("Error de carga");
  }
}
setInterval(cargarContenido, 5000);
cargarContenido();
