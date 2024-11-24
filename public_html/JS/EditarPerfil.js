document.addEventListener("DOMContentLoaded", inicializarEditarPerfil);

let imagenBase64Seleccionada = null; // Variable global para almacenar la imagen seleccionada

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

    // Configurar evento de clic en el botón de guardar
    const botonGuardar = document.querySelector('.save');
    botonGuardar.addEventListener('click', guardarImagen);
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


// Función de guardar imagen (cuando el usuario hace clic en "Guardar")
function guardarImagen(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    if (!imagenBase64Seleccionada) {
        console.error("No se ha seleccionado una imagen.");
        alert("Por favor, selecciona una imagen antes de guardar.");
        return;
    }

    // Guardar la imagen en sessionStorage
    sessionStorage.setItem('imagen', imagenBase64Seleccionada);

    // Guardar la imagen en IndexedDB
    guardarImagenEnIndexedDB(imagenBase64Seleccionada);

    // Actualizar la imagen en la vista
    cargarImagenDesdeBase64(imagenBase64Seleccionada);
    alert("Foto de perfil guardada correctamente.");
}

// IndexedDB: Inicializar la base de datos
function inicializarIndexedDB() {
    const request = indexedDB.open("VitoMaite05", 1); // Nombre de la base de datos

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("Usuarios")) {
            db.createObjectStore("Usuarios", { keyPath: "mail" }); // Suponiendo que 'mail' es la clave primaria
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

// Guardar la imagen en IndexedDB
function guardarImagenEnIndexedDB(imagenBase64) {
    const mailUsuario = obtenerIdUsuario(); // Usamos el correo electrónico del usuario para obtener el ID

    const request = indexedDB.open("VitoMaite05", 1);

    // En caso de que la base de datos sea creada o actualizada
    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Si la base de datos se está creando o actualizando, definimos el object store 'Usuarios'
        if (!db.objectStoreNames.contains("Usuarios")) {
            const objectStore = db.createObjectStore("Usuarios", { keyPath: "ID", autoIncrement: true }); // 'ID' será la clave primaria
            objectStore.createIndex("mail", "mail", { unique: true }); // También podemos crear un índice para 'mail' si lo necesitamos
        }
    };

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

// Función para obtener el correo electrónico del usuario
function obtenerIdUsuario() {
    return sessionStorage.getItem("mail"); 
}
