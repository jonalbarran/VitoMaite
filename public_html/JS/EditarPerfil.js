document.addEventListener("DOMContentLoaded", inicializarEditarPerfil);

function inicializarEditarPerfil() {
    const fotoInput = document.getElementById('foto');
    if (!fotoInput) {
        console.error("El elemento con ID 'foto' no existe.");
        return;
    }

    // Inicializamos la base de datos al cargar la página
    inicializarIndexedDB();

    // Configurar evento de cambio
    fotoInput.addEventListener('change', manejarCambioDeFoto);

    // Cargar la imagen al iniciar, si está en sessionStorage o IndexedDB
    const imagenGuardada = sessionStorage.getItem("imagen");
    if (imagenGuardada) {
        cargarImagenDesdeSessionStorage(imagenGuardada);
    } else {
        cargarImagenDesdeIndexedDB();
    }
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
        sessionStorage.setItem('imagen', base64); // Guardar en sessionStorage
        guardarImagenEnIndexedDB(base64); // Guardar en IndexedDB
        cargarImagenDesdeSessionStorage(base64); // Cargar directamente
    });
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

// IndexedDB: Inicializar la base de datos
function inicializarIndexedDB() {
    const request = indexedDB.open("VitoMaite05", 1); // Nombre de la base de datos

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("Usuario")) {
            db.createObjectStore("Usuario", { keyPath: "email" }); // Suponiendo que 'email' es la clave primaria
            console.log("ObjectStore 'Usuario' creado.");
        }
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        console.log("Base de datos inicializada correctamente.");
    };
}

// Guardar la imagen en IndexedDB
function guardarImagenEnIndexedDB(imagenBase64) {
    const emailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuario", "readwrite");
        const store = transaction.objectStore("Usuario");

        // Asumiendo que solo guardamos una foto por usuario, actualizamos la foto del usuario específico
        const imagenObjeto = {
            email: emailUsuario, // Usamos el email como identificador único
            imagen: imagenBase64
        };

        const putRequest = store.put(imagenObjeto);

        putRequest.onsuccess = function () {
            console.log("Imagen guardada en IndexedDB correctamente.");
        };

        putRequest.onerror = function (event) {
            console.error("Error al guardar la imagen en IndexedDB:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos para guardar la imagen:", event.target.errorCode);
    };
}

// Cargar la imagen desde IndexedDB
function cargarImagenDesdeIndexedDB() {
    const emailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuario", "readonly");
        const store = transaction.objectStore("Usuario");

        const getRequest = store.get(emailUsuario); // Obtenemos el usuario por su correo electrónico

        getRequest.onsuccess = function (event) {
            const resultado = event.target.result;
            if (resultado && resultado.imagen) {
                const fotoUsuarioElement = document.getElementById("fotoUsuarioEP");
                if (fotoUsuarioElement) {
                    fotoUsuarioElement.src = resultado.imagen;
                    console.log("Imagen cargada desde IndexedDB.");
                }
            } else {
                console.log("No se encontró ninguna imagen para este usuario en IndexedDB.");
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

// Función para obtener el correo electrónico del usuario
function obtenerIdUsuario() {
    // En un escenario real, debes obtener el correo electrónico del usuario autenticado de alguna manera.
    // Ejemplo: Podrías guardarlo en el sessionStorage o en una cookie cuando el usuario inicia sesión.
    // En este caso, vamos a devolver un correo simulado:

    return sessionStorage.getItem("emailUsuario") || "usuario@example.com"; // Aquí debes obtener el correo real.
}
