// Inicializar el mapa y el marcador globalmente
let map;
let marker;

function initMap() {
    // Establecer una ubicación predeterminada (puedes cambiarla por coordenadas dinámicas)
    const defaultLocation = { lat: 40.416775, lng: -3.703790 }; // Madrid, por ejemplo

    // Crear un nuevo mapa centrado en la ubicación predeterminada
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });

    // Crear un marcador en la ubicación predeterminada y asignarlo a la variable global 'marker'
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Tu ubicación",
    });
}

// Función para actualizar la posición del marcador y centrar el mapa
function actualizarUbicacion(lat, lng) {
    // Crear una nueva LatLng para la nueva ubicación
    const newLocation = new google.maps.LatLng(lat, lng);

    // Verificar que el marcador esté inicializado
    if (marker) {
        // Actualizar la posición del marcador
        marker.setPosition(newLocation);

        // Centrar el mapa en la nueva ubicación
        map.setCenter(newLocation);
        map.setZoom(15); // Puedes ajustar el zoom si es necesario
    } else {
        console.error("El marcador no está inicializado.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el nombre y apellido del sessionStorage
    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");
    const mailSeleccionado = sessionStorage.getItem("usuarioSeleccionado");

    // Saludo y imagen en barra de navegación
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

                const latitud = parseFloat(usuario.latitud);
                const longitud = parseFloat(usuario.longitud);
                console.log("Latitud:", latitud);
                console.log("Longitud:", longitud);
                
                // Iniciar mapa y actualizar la ubicación
                actualizarUbicacion(latitud, longitud);
    
    
                actualizarImagen();
                
            }
        };
    };
}


        function actualizarImagen(){
            const imagenUsuario = document.getElementById("fotoUsuario");
                if (usuario.imagen===null||usuario.imagen===""){
                    imagenUsuario.src = "IMG/AnonimousUser";
                }else{
                    imagenUsuario.src = usuario.imagen;
                }
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
