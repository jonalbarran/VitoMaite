document.addEventListener('DOMContentLoaded', function () {
    
    // Escuchar el evento de envío del formulario
    document.querySelector('.form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío normal del formulario
        validarDatos(); // Llamada a la función para validar datos
    });
});


function validarDatos() {
    var email = document.querySelector('#email').value;
    var contrasena = document.querySelector('#password').value;

    var request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction("Usuarios", "readonly");
        var usuariosStore = transaction.objectStore("Usuarios");

        var index = usuariosStore.index("mail");
        var request = index.get(email); // Buscar por el email

        request.onsuccess = function () {
            var usuario = request.result;
            if (usuario && usuario.contrasena === contrasena) {
                // Si el email y la contraseña coinciden, redirigir a Inicio.html
                window.location.href = "Inicio.html";
                sessionStorage.setItem("id", usuario.id);
        sessionStorage.setItem("mail", usuario.mail);
        sessionStorage.setItem("contrasena", usuario.contrasena);
        sessionStorage.setItem("genero", usuario.genero);
        sessionStorage.setItem("nombre", usuario.nombre);
        sessionStorage.setItem("apellido", usuario.apellido);
        sessionStorage.setItem("edad", usuario.edad);
        sessionStorage.setItem("premium", usuario.premium);
        sessionStorage.setItem("ciudad", usuario.ciudad);
        sessionStorage.setItem("imagen", usuario.imagen);
            } else {
                alert("Credenciales incorrectas. Intenta de nuevo.");
            }
        };

        request.onerror = function () {
            alert("No se pudo encontrar el usuario.");
        };
    };

    request.onerror = function () {
        console.error("Error al acceder a la base de datos.");
    };
}
