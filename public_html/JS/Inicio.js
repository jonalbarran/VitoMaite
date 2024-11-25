
document.addEventListener("DOMContentLoaded", () => {
// Recuperar el nombre y apellido del sessionStorage

    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");
    mensajeBienvenida(nombre, apellido);
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
        fotoUsuario.src = "IMG/default-photo.png";
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
////////////////////////////////
//////LIKES/////////////////////
////////////////////////////////
document.getElementById("mostrarLikes").addEventListener('click', function () {
    console.log("mis likes");
    var contenedorLikes = document.getElementById("contenedorLikes");
    contenedorLikes.innerHTML = '';
    mostrarLikes();
}
);
function mostrarLikes() {
    var request = indexedDB.open("VitoMaite05", 1);
    var contenedorLikes = document.getElementById("contenedorLikes");
    contenedorLikes.innerHTML = "";
    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["meGusta"], "readonly");
        var visitasStore = transaccion.objectStore("meGusta");
        var cursor = visitasStore.openCursor();
        var tienesLikes = false;
        var hayLikesEnTabla = false;
        var emailUsuario = sessionStorage.getItem('mail');
        cursor.onsuccess = function (eventoCursor) {
            var resultado = eventoCursor.target.result;
            if (resultado) {
                console.log("Registro encontrado:", resultado.value);
                var like = resultado.value;
                if (like.user2 === emailUsuario) {
                    hayLikesEnTabla = true;
                    tienesLikes = true;
                    agregarLikeALaInterfaz(like);
                }

                resultado.continue();
            } else {
                console.log("Fin del cursor.");
                if (!hayLikesEnTabla) {
                    alert("No hay likes!");
                } else if (!tienesLikes) {
                    console.log("No tienes likes a tu perfil!\n :/");
                }
            }
        };
        cursor.onerror = function () {
            console.error("Error al abrir el cursor.");
        };
    };
    request.onerror = function () {
        console.error("Error al abrir la base de datos");
    };
}

function agregarLikeALaInterfaz(like) {
    var contenedorLikes = document.getElementById("contenedorLikes");

    // Verificar si la tabla ya existe, si no, crearla
    var tablaLikes = document.getElementById("tablaLikes");
    if (!tablaLikes) {
        // Si no existe la tabla, crearla
        tablaLikes = document.createElement("table");
        tablaLikes.id = "tablaLikes";  // Asignamos un id para acceder a la tabla después
        tablaLikes.className = "tabla-likes";
        
        // Crear la fila de la cabecera
        var filaCabecera = document.createElement("tr");
        
        // Crear celdas de la cabecera
        var fechaCabecera = document.createElement("th");
        fechaCabecera.textContent = "Fecha Like";
        var esMatchCabecera = document.createElement('th');
        esMatchCabecera.textContent = "Match";
        var usuarioCabecera = document.createElement("th");
        usuarioCabecera.textContent = "Usuario";
        var detallesCabecera = document.createElement("th");
        detallesCabecera.textContent = "Detalles";
        
        // Agregar celdas de la cabecera a la fila de la cabecera
        filaCabecera.appendChild(fechaCabecera);
        filaCabecera.appendChild(usuarioCabecera);
        filaCabecera.appendChild(esMatchCabecera);
        filaCabecera.appendChild(detallesCabecera);
        
        // Añadir la cabecera a la tabla
        tablaLikes.appendChild(filaCabecera);
        
        // Añadir la tabla al contenedor
        contenedorLikes.appendChild(tablaLikes);
    }
    
    // Crear una fila para cada like
    var filaLike = document.createElement("tr");
    
    // Crear celdas para mostrar la información del like
    var fechaCelda = document.createElement("td");
    var fechaStalking = extraerFecha(like.fecha);
    fechaCelda.textContent = fechaStalking;
    
    var usuarioCelda = document.createElement("td");
    var emailUsuario = like.user1;
    obtenerInformacionUsuario(emailUsuario, function (usuario) {
        if (usuario) {
            var nickStalcker = usuario.nombre;
            usuarioCelda.textContent = nickStalcker;
        } else {
            console.log("Usuario no encontrado o error al buscar.");
        }
    });
    
    var matchCelda = document.createElement("td"); // Celda para la imagen de "Match"
    var imgMatch = document.createElement("img");
    imgMatch.style.width = "20px"; // Ajustar tamaño
    imgMatch.style.height = "20px"; // Ajustar tamaño
    
    // Lógica para mostrar la imagen según el valor del like.match
    if (like.like === "2") { // Si hay "match"
        imgMatch.src = "IMG/imagenMatch.png"; // Reemplaza con tu base64
        imgMatch.alt = "Match"; // Texto alternativo
    } else {
        imgMatch.src = "IMG/corazonLike.png"; // Otra imagen o deja vacío si no hay
        imgMatch.alt = "No Match"; // Texto alternativo
    }
    
    matchCelda.appendChild(imgMatch);
    
    // Crear el botón de detalles
    var botonDetalles = document.createElement("button");
    botonDetalles.textContent = "Detalles";
    
    // Asignar el correo del usuario al atributo data-mail del botón
    botonDetalles.dataset.mail = emailUsuario; // Asignamos el correo al botón
    
    // Agregar el evento de clic al botón de detalles
    botonDetalles.addEventListener("click", function (e) {
        const mailUsuario = e.target.dataset.mail; // Obtener el correo del usuario
        sessionStorage.setItem('usuarioSeleccionado', mailUsuario); // Guardar en sessionStorage
        window.location.href = 'detalles.html'; // Redirigir a detalles.html
    });
    
    // Agregar celdas a la fila del like
    filaLike.appendChild(fechaCelda);
    filaLike.appendChild(usuarioCelda);
    filaLike.appendChild(matchCelda);
    filaLike.appendChild(botonDetalles);
    
    // Añadir la fila a la tabla existente
    tablaLikes.appendChild(filaLike);
}



function extraerFecha(fechaConHora) {
    const [fecha] = fechaConHora.split('T');
    return fecha;
}


function obtenerInformacionUsuario(mail, callback) {
    var request = indexedDB.open("VitoMaite05", 1);
    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Usuarios"], "readonly");
        var usuariosStore = transaccion.objectStore("Usuarios");
        // Buscar el usuario por email usando el índice
        var indiceEmail = usuariosStore.index("mail");
        var cursor = indiceEmail.openCursor(IDBKeyRange.only(mail));
        cursor.onsuccess = function (eventoCursor) {
            var resultado = eventoCursor.target.result;
            if (resultado) {

                callback(resultado.value);
            } else {

                callback(null);
            }
        };
        cursor.onerror = function () {
            console.error("Error al buscar el usuario");
            callback(null);
        };
    };
    request.onerror = function () {
        console.error("Error al abrir la base de datos");
        callback(null);
    };
}


