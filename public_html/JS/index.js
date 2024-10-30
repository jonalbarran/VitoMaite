/*
 * Esta función se ejecuta cuando carga la página
 */
document.addEventListener('DOMContentLoaded', function () {
    abrirBaseDeDatos();
});

function abrirBaseDeDatos() {
    var request = indexedDB.open("BaseDeDatosUsuarios", 2); // Aumentar la versión de la base de datos

    request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Verificar si el almacén de objetos ya existe y, si no, crearlo
        if (!db.objectStoreNames.contains("Usuarios")) {
            // Crear almacén de objetos para Usuarios
            var usuariosStore = db.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
            usuariosStore.createIndex("mail", "mail", {unique: true});
            usuariosStore.createIndex("nickname", "nickname", {unique: false});
            usuariosStore.createIndex("genero", "genero", {unique: false});
            usuariosStore.createIndex("nombre", "nombre", {unique: false});
            usuariosStore.createIndex("apellidos", "apellidos", {unique: false});
            usuariosStore.createIndex("contraseña", "contraseña", {unique: false});
            usuariosStore.createIndex("edad", "edad", {unique: false});
            usuariosStore.createIndex("premium", "premium", {unique: false});
            usuariosStore.createIndex("colorPelo", "colorPelo", {unique: false});
            usuariosStore.createIndex("colorOjos", "colorOjos", {unique: false});
            usuariosStore.createIndex("fotoUsuario", "fotoUsuario", {unique: false});
        }

        // Verificar si el almacén de objetos Aficiones ya existe
        if (!db.objectStoreNames.contains("Aficiones")) {
            // Crear almacén de objetos para Aficiones
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
            aficionesStore.createIndex("email", "email", {unique: false});
        }

        // Verificar si el almacén de objetos Matches ya existe
        if (!db.objectStoreNames.contains("Matches")) {
            // Crear almacén de objetos para Matches
            var matchesStore = db.createObjectStore("Matches", {keyPath: "id", autoIncrement: true});
            matchesStore.createIndex("user1", "user1", {unique: false});
            matchesStore.createIndex("user2", "user2", {unique: false});
            matchesStore.createIndex("ok", "ok", {unique: false});
        }

        console.log("Almacenes de objetos creados con éxito.");
    };

    request.onsuccess = function (event) {
        var db = event.target.result;
        console.log("La base de datos 'BaseDeDatosUsuarios' se ha abierto con éxito");
        agregarDatos(db); // Llama a la función para agregar datos con la base de datos abierta
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}

function agregarDatos(db) {
    // Abre las transacciones en modo "readwrite" para cada almacén
    var usuariosTransaction = db.transaction("Usuarios", "readwrite");
    var aficionesTransaction = db.transaction("Aficiones", "readwrite");
    var matchesTransaction = db.transaction("Matches", "readwrite");

    var usuariosStore = usuariosTransaction.objectStore("Usuarios");
    var aficionesStore = aficionesTransaction.objectStore("Aficiones");
    var matchesStore = matchesTransaction.objectStore("Matches");

    // Agregar algunos usuarios de ejemplo
    usuariosStore.add({
        mail: "usuario1@mail.com", nickname: "User1", genero: "Masculino", nombre: "Juan",
        apellidos: "Pérez", contraseña: "pass123", edad: 25, premium: false,
        colorPelo: "Negro", colorOjos: "Café", fotoUsuario: "avatar001.png"
    });
    usuariosStore.add({
        mail: "usuario2@mail.com", nickname: "User2", genero: "Femenino", nombre: "Ana",
        apellidos: "García", contraseña: "pass456", edad: 28, premium: true,
        colorPelo: "Rubio", colorOjos: "Azul", fotoUsuario: "avatar002.png"
    });
    usuariosStore.add({
        mail: "usuario3@mail.com", nickname: "User3", genero: "No Binario", nombre: "Alex",
        apellidos: "López", contraseña: "pass789", edad: 22, premium: false,
        colorPelo: "Castaño", colorOjos: "Verde", fotoUsuario: "avatar003.png"
    });
    usuariosStore.add({
        mail: "usuario4@mail.com", nickname: "User4", genero: "Masculino", nombre: "Carlos",
        apellidos: "Martínez", contraseña: "pass000", edad: 30, premium: true,
        colorPelo: "Gris", colorOjos: "Café", fotoUsuario: "avatar004.png"
    });

    // Agregar algunas aficiones de ejemplo
    aficionesStore.add({aficion: "viajes", email: "ruben@adsi.com"});
    aficionesStore.add({aficion: "beber", email: "ruben@adsi.com"});
    aficionesStore.add({aficion: "mus", email: "marykay@adsi.com"});
    aficionesStore.add({aficion: "fiesta", email: "juan@correo.com"});
    aficionesStore.add({aficion: "bailar", email: "ana@correo.com"});

    // Agregar algunos matches de ejemplo
    matchesStore.add({user1: "pepe@xx", user2: "maria@xx", ok: 2});
    matchesStore.add({user1: "pepe@xx", user2: "juan@xx", ok: 1});
    matchesStore.add({user1: "jabi@xx", user2: "mary@xx", ok: 1});

    console.log("Datos agregados correctamente.");
}
