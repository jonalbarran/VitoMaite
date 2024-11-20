document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el nombre y apellido del sessionStorage
    
    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");

    mensajeBienvenida(nombre,apellido);
    actualizarFotoUsuario(imagen);
    botonCerrarSesion();

    
});

function mensajeBienvenida(nombre, apellido) {
    const mensajeBienvenida = document.getElementById("mensajeBienvenida");

        mensajeBienvenida.textContent = `Bienvenid@, ${nombre} ${apellido}`;
    
}

function actualizarFotoUsuario(imagen) {
    const fotoUsuario = document.getElementById("fotoUsuario");
    if (imagen) {
        fotoUsuario.src = imagen;
    } else {
        fotoUsuario.src = "IMG/default-user.png";
    }
}
    
function botonCerrarSesion() {
    
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    cerrarSesionBtn.addEventListener("click", () => {
        window.location.href = "index.html";
        sessionStorage.clear();
        alert("Sesión cerrada correctamente.");
        
    });
}
function botonMostrarVisitas(){
    const request = indexedDB.open("VitoMaite05", 1);
    const boton = document.getElementById('MostrarVisitas');
    const contenedorTabla = document.getElementById('TablaVisitas');
    
    boton.addEventListener('click', function()) {
    // Limpiar el contenido previo (si existe)
    contenedorTabla.innerHTML = '';
    const tabla = document.createElement('table');
    const filaCabecera = document.createElement('tr');
    const columnas = ['Nombre', 'Fecha', 'Motivo'];
    columnas.forEach(columna => {
        const th = document.createElement('th');
        th.textContent = columna;
        filaCabecera.appendChild(th);
   });
   cabecera.appendChild(filaCabecera);
    tabla.appendChild(cabecera);

   const cuerpo = document.createElement('tbody');
    visitas.forEach(visita => {
        const fila = document.createElement('tr');
        Object.values(visita).forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            fila.appendChild(td);
        });
        cuerpo.appendChild(fila);
    });
    tabla.appendChild(cuerpo);

    // Agregar la tabla al contenedor
    contenedorTabla.appendChild(tabla);
}    
function mostrarLikes() {
    var request = indexedDB.open("VitoMaite05", 1);
    
}