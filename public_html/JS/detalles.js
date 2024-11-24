
document.addEventListener("DOMContentLoaded", () => {
// Recuperar el nombre y apellido del sessionStorage

    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");
    const mailSeleccionado = sessionStorage.getItem("usuarioSeleccionado");

// Saludo y imagén en barra navegación
    mensajeBienvenida(nombre, apellido);
    actualizarFotoUsuario(imagen);
    botonCerrarSesion();
    
    
    colocarEnPagina(mailSeleccionado);
    

});


function colocarEnPagina(mailSeleccionado) {
    var request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Usuarios"], "readonly");
        var usuariosStore = transaccion.objectStore("Usuarios");

        // Buscar el usuario por su correo electrónico
        var indiceMail = usuariosStore.index("mail");
        var solicitud = indiceMail.get(mailSeleccionado);

        solicitud.onsuccess = function () {
            var usuario = solicitud.result;
            if (usuario) {
                console.log("Usuario encontrado:", usuario);
                
                // Rellenar las etiquetas con los datos del usuario
                document.getElementById("labelMail").textContent = usuario.mail;
                document.getElementById("labelEdad").textContent = usuario.edad;
                document.getElementById("labelGenero").textContent = usuario.genero;
                document.getElementById("labelCiudad").textContent = usuario.ciudad;

                // Rellenar la imagen
                const imagenUsuario = document.querySelector("img[alt='imagenUsuario']");
                
                    imagenUsuario.src = usuario.imagen;
               
            }
      
        };
    };
    }


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