document.addEventListener("DOMContentLoaded", () => {
    const fotoInput = document.getElementById('foto');
    if (fotoInput) {
        fotoInput.addEventListener('change', function (event) {
            const archivo = event.target.files[0];
            if (archivo) {
                convertirArchivoABase64(archivo, function (base64) {
                    if (base64) {
                        sessionStorage.setItem('imagen', base64); // Guardar en sessionStorage
                        console.log("Imagen guardada en sessionStorage:", base64);
                        const nuevaImagen = sessionStorage.getItem("imagen");
                        cargarImagenDesdeSessionStorage(nuevaImagen);
                    } else {
                        console.error("No se pudo convertir el archivo a Base64.");
                    }
                });
            } else {
                console.warn("No se seleccionó ningún archivo.");
            }
        });

        // Cargar la imagen al iniciar, si está en sessionStorage
        const imagenGuardada = sessionStorage.getItem("imagen");
        if (imagenGuardada) {
            cargarImagenDesdeSessionStorage(imagenGuardada);
        }
    } else {
        console.error("El elemento con ID 'foto' no existe.");
    }
});

/**
 * Convierte un archivo a Base64.
 */
function convertirArchivoABase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
        callback(reader.result); // Base64 se pasa al callback
    };
    reader.onerror = function (error) {
        console.error("Error al leer el archivo:", error);
        callback(null); // Manejo del error
    };
    reader.readAsDataURL(file); // Convierte el archivo a Base64
}

/**
 * Carga la imagen desde sessionStorage si existe.
 */
function cargarImagenDesdeSessionStorage(imagen) {
    const fotoUsuarioElement = document.getElementById("fotoUsuarioEP");
    if (fotoUsuarioElement) {
        fotoUsuarioElement.src = imagen;
        console.log("Imagen cargada desde sessionStorage.");
    } else {
        console.error("El elemento con ID 'fotoUsuarioEP' no existe.");
    }
}
