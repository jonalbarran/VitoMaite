document.addEventListener("DOMContentLoaded", inicializarEditarPerfil);

let imagenBase64Seleccionada = null; // Variable global para almacenar la imagen seleccionada
// Llamar a esta función cuando se carga la página (o cuando el usuario haya iniciado sesión)
const mailUsuario = obtenerIdUsuario();
mostrarCiudadActual(mailUsuario);


function inicializarEditarPerfil() {
    const fotoInput = document.getElementById('foto');
    if (!fotoInput) {
        console.error("El elemento con ID 'foto' no existe.");
        return;
    }

    // Inicializamos la base de datos al cargar la página
    inicializarIndexedDB();

    // Configurar evento de cambio solo para actualizar la vista previa
    fotoInput.addEventListener('change', manejarCambioDeFoto);

    // Cargar la imagen al iniciar, si está en sessionStorage o IndexedDB
    const imagenGuardada = sessionStorage.getItem("imagen");
    if (imagenGuardada) {
        cargarImagenDesdeSessionStorage(imagenGuardada);
    } else {
        cargarImagenDesdeIndexedDB();
    }

    document.getElementById("ver-aficiones").addEventListener("click", function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del botón
        mostrarAficiones(); // Llama a la función para mostrar aficiones
    });


    // Configurar evento de clic en el botón de guardar
    const botonGuardar = document.querySelector('.save');
    botonGuardar.addEventListener('click', guardarPerfil);
}

// IndexedDB: Inicializar la base de datos
function inicializarIndexedDB() {
    const request = indexedDB.open("VitoMaite05", 1); // Nombre de la base de datos

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("Usuarios")) {
            db.createObjectStore("Usuarios", {keyPath: "mail"}); // Suponiendo que 'mail' es la clave primaria
            console.log("ObjectStore 'Usuarios' creado.");
        }
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        console.log("Base de datos inicializada correctamente.");
    };
}

function manejarCambioDeFoto(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
        console.warn("No se seleccionó ningún archivo.");
        return;
    }
    if (!archivo.type.startsWith('image/')) {
        console.error("El archivo seleccionado no es una imagen.");
        alert("Por favor selecciona un archivo de imagen válido.");
        return;
    }

    convertirArchivoABase64(archivo, function (base64) {
        if (!base64) {
            console.error("No se pudo convertir el archivo a Base64.");
            return;
        }

        // Solo actualizamos la vista previa, pero no guardamos en sessionStorage ni IndexedDB aún
        imagenBase64Seleccionada = base64;
        cargarImagenDesdeBase64(base64);
    });
}

function cargarImagenDesdeBase64(imagenBase64) {
    const fotoUsuarioElement = document.getElementById("fotoUsuarioEP");
    if (fotoUsuarioElement) {
        fotoUsuarioElement.src = imagenBase64; // Actualizamos la vista previa con la imagen seleccionada
    } else {
        console.error("El elemento con ID 'fotoUsuarioEP' no existe.");
    }
}

function convertirArchivoABase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
        callback(reader.result); // Base64 se pasa al callback
    };
    reader.onerror = function (error) {
        console.error("Error al leer el archivo:", error);
        alert("Hubo un problema al cargar el archivo. Por favor, inténtalo de nuevo.");
        callback(null); // Manejo del error
    };
    reader.readAsDataURL(file); // Convierte el archivo a Base64
}

function cargarImagenDesdeSessionStorage(imagen) {
    const fotoUsuarioElement = document.getElementById("fotoUsuarioEP");
    if (fotoUsuarioElement) {
        fotoUsuarioElement.src = imagen || 'IMG/default-photo.png'; // Imagen por defecto
        console.log("Imagen cargada desde sessionStorage.");
    } else {
        console.error("El elemento con ID 'fotoUsuarioEP' no existe.");
    }
}

// Cargar la imagen desde IndexedDB
function cargarImagenDesdeIndexedDB() {
    const mailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");

        const getRequest = store.get(mailUsuario); // Obtenemos el usuario por su correo electrónico

        getRequest.onsuccess = function (event) {
            const resultado = event.target.result;
            const fotoUsuarioElement = document.getElementById("fotoUsuarioEP");
            if (resultado && resultado.imagen) {
                // Si encontramos la imagen, la mostramos
                if (fotoUsuarioElement) {
                    fotoUsuarioElement.src = resultado.imagen;
                    console.log("Imagen cargada desde IndexedDB.");
                }
            } else {
                // Si no encontramos imagen, cargamos una por defecto
                if (fotoUsuarioElement) {
                    fotoUsuarioElement.src = 'IMG/default-photo.png'; // Imagen por defecto
                    console.log("Imagen no encontrada, cargada imagen por defecto.");
                }
            }
        };

        getRequest.onerror = function (event) {
            console.error("Error al cargar la imagen desde IndexedDB:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos para cargar la imagen:", event.target.errorCode);
    };
}

// Función de guardar imagen (cuando el usuario hace clic en "Guardar")
function guardarImagen(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Primero, revisamos si se ha seleccionado una nueva imagen
    if (imagenBase64Seleccionada) {
        // Si se ha seleccionado una imagen, guardamos la nueva imagen

        // Guardar la imagen en sessionStorage
        sessionStorage.setItem('imagen', imagenBase64Seleccionada);

        // Guardar la imagen en IndexedDB
        guardarImagenEnIndexedDB(imagenBase64Seleccionada);

        // Actualizar la imagen en la vista
        cargarImagenDesdeBase64(imagenBase64Seleccionada);
        alert("Foto de perfil guardada correctamente.");
    } else {
        // Si no hay imagen seleccionada, solo se actualiza la ciudad, sin tocar la foto
        alert("Solo se ha guardado el cambio de ciudad.");
    }
}

// Función para guardar tanto la imagen como la ciudad en IndexedDB
function guardarPerfil(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const ciudad = document.getElementById("ciudad").value;
    const mailUsuario = obtenerIdUsuario();

    // Si se ha seleccionado una nueva foto
    if (imagenBase64Seleccionada) {
        // Guardar la imagen en sessionStorage
        sessionStorage.setItem('imagen', imagenBase64Seleccionada);
        // Guardar la imagen en IndexedDB
        guardarImagenEnIndexedDB(imagenBase64Seleccionada);
    }

    // Si la ciudad ha cambiado, actualizarla en IndexedDB
    if (ciudad) {
        actualizarCiudadEnIndexedDB(ciudad);
    }
    guardarAficiones(); // Guardar las aficiones seleccionadas

    alert("Perfil actualizado correctamente.");
}

// Guardar la imagen en IndexedDB
function guardarImagenEnIndexedDB(imagenBase64) {
    const mailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario para obtener el ID

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Iniciamos una transacción de lectura y escritura
        const transaction = db.transaction("Usuarios", "readwrite");
        const store = transaction.objectStore("Usuarios");

        // Primero, necesitamos obtener el ID del usuario a partir del mail
        const index = store.index("mail"); // Creamos un índice para buscar por mail
        const getByMailRequest = index.get(mailUsuario); // Usamos 'mailUsuario' para obtener el 'ID' del usuario

        getByMailRequest.onsuccess = function () {
            const usuario = getByMailRequest.result;

            if (usuario) {
                // Ahora tenemos el ID del usuario, podemos actualizar solo la imagen
                usuario.imagen = imagenBase64; // Solo actualizamos el campo imagen

                // Guardamos el objeto actualizado, usando el ID para la actualización
                const putRequest = store.put(usuario);

                putRequest.onsuccess = function () {
                    console.log("Imagen actualizada correctamente en IndexedDB.");
                };

                putRequest.onerror = function (event) {
                    console.error("Error al actualizar la imagen en IndexedDB:", event.target.errorCode);
                };
            } else {
                console.log("Usuario no encontrado.");
            }
        };

        getByMailRequest.onerror = function (event) {
            console.error("Error al obtener el usuario por mail:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos para guardar la imagen:", event.target.errorCode);
    };
}

// Función para actualizar la ciudad en IndexedDB
function actualizarCiudadEnIndexedDB(ciudad) {
    const mailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario para obtener el ID

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuarios", "readwrite");
        const store = transaction.objectStore("Usuarios");

        // Primero, necesitamos obtener el ID del usuario a partir del mail
        const index = store.index("mail"); // Creamos un índice para buscar por mail
        const getByMailRequest = index.get(mailUsuario); // Usamos 'mailUsuario' para obtener el 'ID' del usuario
        const getRequest = store.get(mailUsuario);

        getByMailRequest.onsuccess = function () {
            const usuario = getByMailRequest.result;

            if (usuario) {
                usuario.ciudad = ciudad; // Actualizamos la ciudad
                store.put(usuario);
                console.log("Ciudad actualizada correctamente en IndexedDB.");
            } else {
                console.log("Usuario no encontrado.");
            }
        };

        getByMailRequest.onerror = function (event) {
            console.error("Error al obtener el usuario por mail:", event.target.errorCode);
        };
    };
    request.onerror = function (event) {
        console.error("Error al abrir la base de datos para guardar la imagen:", event.target.errorCode);
    };
}

// Función para obtener el correo electrónico del usuario
function obtenerIdUsuario() {
    return sessionStorage.getItem("mail");
}

// Función para obtener la ciudad actual del usuario desde IndexedDB
function mostrarCiudadActual(mailUsuario) {
    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");

        // Usamos el índice para buscar al usuario por su correo
        const index = store.index("mail");
        const getRequest = index.get(mailUsuario);

        getRequest.onsuccess = function () {
            const usuario = getRequest.result;

            if (usuario) {
                // Mostrar la ciudad actual en el HTML
                const ciudadActual = usuario.ciudad || "No especificada"; // Si no tiene ciudad, mostrar "No especificada"
                document.getElementById("ciudad-actual").textContent = ciudadActual;

                // Establecer la ciudad actual en el desplegable
                document.getElementById("ciudad").value = ciudadActual; // Preselecciona la ciudad en el desplegable
            } else {
                console.log("Usuario no encontrado.");
            }
        };

        getRequest.onerror = function (event) {
            console.error("Error al obtener el usuario:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };
}


// EDITAR AFICIONES------------------------------------------------------------------------


// Función para mostrar las aficiones disponibles con las del usuario preseleccionadas
function mostrarAficiones() {
    const mailUsuario = obtenerIdUsuario();
    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Obtener todas las aficiones
        const aficionesTransaction = db.transaction("Aficiones", "readonly");
        const aficionesStore = aficionesTransaction.objectStore("Aficiones");
        const aficionesRequest = aficionesStore.getAll();

        // Obtener las aficiones del usuario
        const aficionUsuarioTransaction = db.transaction("AficionUsuario", "readonly");
        const aficionUsuarioStore = aficionUsuarioTransaction.objectStore("AficionUsuario");
        const userAficionesRequest = aficionUsuarioStore.getAll();

        aficionesRequest.onsuccess = function () {
            const aficiones = aficionesRequest.result; // Todas las aficiones disponibles

            userAficionesRequest.onsuccess = function () {
                // Obtener solo las aficiones del usuario
                const userAficionIds = userAficionesRequest.result
                    .filter(item => item.mail === mailUsuario) // Filtrar por usuario
                    .map(item => item.aficionId); // Solo obtenemos los aficionId

                // Crear lista de checkboxes
                const listaDiv = document.getElementById("lista-aficiones");
                listaDiv.innerHTML = ""; // Limpiar contenido previo

                aficiones.forEach(aficion => {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = aficion.id; // Asignar el id de la afición
                    checkbox.checked = userAficionIds.includes(aficion.id); // Preseleccionar si el usuario ya la tiene

                    const label = document.createElement("label");
                    label.textContent = aficion.aficion;

                    const div = document.createElement("div");
                    div.appendChild(checkbox);
                    div.appendChild(label);

                    listaDiv.appendChild(div);
                });

                listaDiv.style.display = "block"; // Mostrar la lista
            };

            userAficionesRequest.onerror = function () {
                console.error("Error al obtener las aficiones del usuario.");
            };
        };

        aficionesRequest.onerror = function () {
            console.error("Error al obtener las aficiones disponibles.");
        };
    };

    request.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
}


// Función para guardar o eliminar aficiones del usuario
function guardarAficiones() {
    const mailUsuario = obtenerIdUsuario();
    const listaDiv = document.getElementById("lista-aficiones");
    const checkboxes = listaDiv.getElementsByTagName("input");

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Obtener todas las aficiones del usuario
        const aficionUsuarioTransaction = db.transaction("AficionUsuario", "readwrite");
        const aficionUsuarioStore = aficionUsuarioTransaction.objectStore("AficionUsuario");
        
        // Obtener las aficiones del usuario actual
        const userAficionesRequest = aficionUsuarioStore.getAll();
        userAficionesRequest.onsuccess = function () {
            const userAficiones = userAficionesRequest.result.filter(item => item.mail === mailUsuario);
            const userAficionIds = userAficiones.map(item => item.aficionId);

            // Creamos un array de los aficionId seleccionados
            const aficionesSeleccionadas = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value));

            // 1. Eliminar aficiones desmarcadas
            userAficiones.forEach(function (aficionUsuario) {
                if (!aficionesSeleccionadas.includes(aficionUsuario.aficionId)) {
                    aficionUsuarioStore.delete(aficionUsuario.id); // Eliminar la relación si la afición no está seleccionada
                }
            });

            // 2. Insertar aficiones nuevas
            aficionesSeleccionadas.forEach(function (aficionId) {
                // Solo insertar si no existe ya la relación
                if (!userAficionIds.includes(aficionId)) {
                    aficionUsuarioStore.add({ mail: mailUsuario, aficionId: aficionId });
                }
            });

            // Confirmación y limpieza
            console.log("Aficiones guardadas correctamente.");
        };

        
    };

   
}
