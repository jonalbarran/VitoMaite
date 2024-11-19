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



