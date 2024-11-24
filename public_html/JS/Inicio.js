
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
                console.log("He llegado");
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
        var tablaLikes = document.createElement("table");
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
        // Agregar celdas de la cabecera a la fila de la cabecera
        filaCabecera.appendChild(fechaCabecera);
        filaCabecera.appendChild(usuarioCabecera);
        filaCabecera.appendChild(esMatchCabecera);
        //añades la cabecera
        tablaLikes.appendChild(filaCabecera);
        // Crear una fila para cada like
        var filaLike = document.createElement("tr");
        // Crear celdas para mostrar la información del artículo
        var fechaCelda = document.createElement("td");
        fechaStalking = extraerFecha(like.fecha);
        fechaCelda.textContent = fechaStalking;
        var usuarioCelda = document.createElement("td");
        emailUsuario = like.user1;
        obtenerInformacionUsuario(emailUsuario, function (usuario) {
        if (usuario) {

        nickStalcker = usuario.nombre;
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
imgMatch.src = "IMG/corazonLike.png"; // Reemplaza con tu base64
        imgMatch.alt = "Match"; // Texto alternativo
} else {
imgMatch.src = "IMG/corazonLike2.png"; // Otra imagen o deja vacío si no hay
        imgMatch.alt = "No Match"; // Texto alternativo
}

matchCelda.appendChild(imgMatch);
        var botonDetalles = document.createElement("button");
        // Agregar celdas a la fila del artículo
        filaLike.appendChild(fechaCelda);
        filaLike.appendChild(usuarioCelda);
        filaLike.appendChild(matchCelda);
        filaLike.appendChild(botonDetalles);
        botonDetalles.textContent = "Detalles";
        botonDetalles.addEventListener("click", function () {
        mostrarDetallesLike();
        });
        tablaLikes.appendChild(filaLike);
        contenedorLikes.appendChild(tablaLikes);
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

//****************************************************************************** 
//*************************** Busqueda ************************************
//****************************************************************************** 

// Elementos del DOM
const aficiones = document.getElementById("aficiones");
        const aficionesSeleccionadas = document.getElementById("aficionesSeleccionadas");
        const moverAficionBtn = document.getElementById("btn-mover-aficion");
        const formulario = document.getElementById("form-buscar"); // El formulario

// Variable global para almacenar las aficiones seleccionadas
        let aficionesSeleccionadasArray = [];
// Mover la opción seleccionada a la lista de aficiones seleccionadas
        moverAficionBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón

                const opcionSeleccionada = aficiones.options[aficiones.selectedIndex];
                if (opcionSeleccionada) {
        // Crear una nueva opción para la lista de seleccionadas
        const nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = opcionSeleccionada.value;
                nuevaOpcion.textContent = opcionSeleccionada.textContent;
                // Añadir la nueva opción a la lista de seleccionadas
                aficionesSeleccionadas.appendChild(nuevaOpcion);
                // Guardar la afición seleccionada en el array de aficiones seleccionadas
                aficionesSeleccionadasArray.push(opcionSeleccionada.value);
                // Eliminar la opción de la lista original
                aficiones.remove(opcionSeleccionada.index);
        }
        });
// Eliminar una afición de la lista seleccionada al hacer clic sobre ella
        aficionesSeleccionadas.addEventListener("click", (event) => {
        const opcionSeleccionada = event.target;
                if (opcionSeleccionada.tagName === "OPTION") {
        // Crear una nueva opción para la lista original
        const nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = opcionSeleccionada.value;
                nuevaOpcion.textContent = opcionSeleccionada.textContent;
                // Añadir la opción a la lista original
                aficiones.appendChild(nuevaOpcion);
                // Eliminar la opción de la lista seleccionada
                aficionesSeleccionadas.removeChild(opcionSeleccionada);
                // Eliminar la afición del array de seleccionadas
                const index = aficionesSeleccionadasArray.indexOf(opcionSeleccionada.value);
                if (index !== - 1) {
        aficionesSeleccionadasArray.splice(index, 1); // Eliminar la afición del array
        }
        }
        });
// Al enviar el formulario, guardamos las aficiones seleccionadas en un array
        formulario.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

                // Al hacer submit, el array de aficiones seleccionadas ya está actualizado
                console.log("Aficiones seleccionadas (array):", aficionesSeleccionadasArray);
                // Aquí puedes hacer lo que necesites con el array de aficiones seleccionadas,
                // como enviarlo a un servidor o guardarlo en el almacenamiento local.
        });
        

















function obtenerAficionesIDs(aficionesSeleccionadasArray) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("VitoMaite05", 1);

        request.onerror = function (event) {
            console.error("Error al abrir la base de datos:", event);
            reject("No se pudo abrir la base de datos.");
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Aficiones", "readonly");
            const store = transaction.objectStore("Aficiones");

            const ids = []; // Array para guardar los id de las aficiones encontradas
            let pendientes = aficionesSeleccionadasArray.length; // Contador para saber cuándo terminan todas las búsquedas

            if (pendientes === 0) {
                resolve(ids); // Si no hay aficiones seleccionadas, devolver un array vacío
                return;
            }

            // Iterar sobre el array de aficiones seleccionadas
            aficionesSeleccionadasArray.forEach((aficion) => {
                const index = store.index("aficion"); // Suponiendo que en la tabla "Aficiones" hay un índice por nombre

                // Realizar la búsqueda por nombre de afición
                const requestAficion = index.get(aficion);

                requestAficion.onerror = function () {
                    console.error("Error al buscar la afición:", aficion);
                    pendientes--;
                    if (pendientes === 0) {
                        resolve(ids); // Resolver la promesa cuando terminen todas las búsquedas
                    }
                };

                requestAficion.onsuccess = function () {
                    const aficionEncontrada = requestAficion.result;
                    if (aficionEncontrada) {
                        // Si la afición existe, añadir su id al array
                        ids.push(aficionEncontrada.id);
                    }
                    pendientes--;
                    if (pendientes === 0) {
                        resolve(ids); // Resolver la promesa cuando terminen todas las búsquedas
                    }
                };
            });
        };
    });
}

















function obtenerMailsPorAficiones(db, aficionIds) {
return new Promise((resolve, reject) => {
// Crear una transacción de solo lectura para la store "AficionUsuario"
var transaction = db.transaction("AficionUsuario", "readonly");
        var aficionUsuarioStore = transaction.objectStore("AficionUsuario");
        // Usamos un Set para evitar duplicados
        var mailsUnicos = new Set();
        // Recorrer el array de aficionIds
        aficionIds.forEach(aficionId => {
        // Abrir un cursor en "AficionUsuario" filtrado por "aficionId"
        var cursorRequest = aficionUsuarioStore.index("aficionId").openCursor(IDBKeyRange.only(aficionId));
                cursorRequest.onsuccess = function (event) {
                var cursor = event.target.result;
                        if (cursor) {
                // Añadimos el mail al Set (si ya existe, no se añadirá de nuevo)
                mailsUnicos.add(cursor.value.mail);
                        console.log('He entrado');
                        // Continuamos con el siguiente registro
                        cursor.continue();
                }
                };
                cursorRequest.onerror = function (event) {
                console.error("Error al obtener el cursor:", event.target.error);
                        reject("Error al acceder a la base de datos.");
                };
        });
        // Una vez que el cursor ha terminado de iterar
        transaction.oncomplete = function () {
        // Convertir el Set en un array y devolver los mails únicos
        resolve(Array.from(mailsUnicos));
        };
        transaction.onerror = function (event) {
        console.error("Error en la transacción:", event.target.error);
                reject("Error al acceder a la base de datos.");
        };
});
        }







