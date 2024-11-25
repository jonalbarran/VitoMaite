// Inicializar el mapa y el marcador globalmente
let map;
let marker;

function initMap() {
    const defaultLocation = { lat: 40.416775, lng: -3.703790 }; // Madrid, por ejemplo

    // Crear un nuevo mapa centrado en la ubicación predeterminada
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });

    // Crear un marcador en la ubicación predeterminada
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Tu ubicación",
    });
}

// Función para actualizar la posición del marcador y centrar el mapa
function actualizarUbicacion(lat, lng) {
    const newLocation = new google.maps.LatLng(lat, lng);

    if (marker) {
        marker.setPosition(newLocation);
        map.setCenter(newLocation);
        map.setZoom(15);
    } else {
        console.error("El marcador no está inicializado.");
        initMap();
        actualizarUbicacion(lat, lng);
    }
}

// Función para eliminar el mapa y el marcador
function eliminarMapa() {
    if (marker) {
        marker.setMap(null); // Eliminar el marcador del mapa
    }

    if (map) {
        map = null; // Eliminar el mapa
    }

    window.location.href = 'busquedaLog.html'; // Redirigir después de eliminar el mapa
}

// Añadir el event listener al botón
document.querySelector('.atras-btn').addEventListener('click', eliminarMapa);



// Event listener al cargar el documento para recuperar la información de sessionStorage y trabajar con IndexedDB
document.addEventListener("DOMContentLoaded", () => {
    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");
    const mailSeleccionado = sessionStorage.getItem("usuarioSeleccionado");

    mensajeBienvenida(nombre, apellido);
    actualizarFotoUsuario(imagen);
    botonCerrarSesion();

    iniciarPagina(mailSeleccionado);
});



function iniciarPagina(mailSeleccionado) {
    var request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Usuarios"], "readonly");
        var usuariosStore = transaccion.objectStore("Usuarios");

        var indiceMail = usuariosStore.index("mail");
        var solicitud = indiceMail.get(mailSeleccionado);

        solicitud.onsuccess = function () {
            var usuario = solicitud.result;
            if (usuario) {
                console.log("Usuario encontrado:", usuario);

                document.getElementById("labelMail").textContent = usuario.mail;
                document.getElementById("labelEdad").textContent = usuario.edad;
                document.getElementById("labelGenero").textContent = usuario.genero;
                document.getElementById("labelCiudad").textContent = usuario.ciudad;

                const latitud = parseFloat(usuario.latitud);
                const longitud = parseFloat(usuario.longitud);
                console.log("Latitud:", latitud);
                console.log("Longitud:", longitud);

                // Iniciar mapa y actualizar la ubicación
                actualizarUbicacion(latitud, longitud);
                
                actualizarImagen(usuario.imagen);
            }
        };
    };
}

function actualizarImagen(imagenB64) {
    const imagenUsuario = document.getElementById("imagenUsuario");
    imagenUsuario.src = imagenB64;
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
