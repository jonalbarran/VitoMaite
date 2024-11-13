/*
 * Esta función se ejecuta cuando carga la página-------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function () {
    abrirBaseDeDatos();
});




function abrirBaseDeDatos() {
    var request = indexedDB.open("BaseDeDatosUsuarios", 1);

    request.onupgradeneeded = function (event) {
        var db = event.target.result;


        if (!db.objectStoreNames.contains("Usuarios")) {
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




        if (!db.objectStoreNames.contains("Aficiones")) {
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
            aficionesStore.createIndex("email", "email", {unique: false});
        }



        if (!db.objectStoreNames.contains("Matches")) {
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
        mail: "usuario1@mail.com", nickname: "User1", genero: "M", nombre: "Juan",
        apellidos: "Pérez", contraseña: "root", edad: 25, premium: "0",
        colorPelo: "Negro", colorOjos: "Café", fotoUsuario: "avatar001.png"
    });
    usuariosStore.add({
        mail: "usuario2@mail.com", nickname: "User2", genero: "N", nombre: "Ana",
        apellidos: "García", contraseña: "root", edad: 28, premium: "1",
        colorPelo: "Rubio", colorOjos: "Azul", fotoUsuario: "avatar002.png"
    });
    usuariosStore.add({
        mail: "usuario3@mail.com", nickname: "User3", genero: "M", nombre: "Alex",
        apellidos: "López", contraseña: "root", edad: 22, premium: "0",
        colorPelo: "Castaño", colorOjos: "Verde", fotoUsuario: "avatar003.png"
    });
    usuariosStore.add({
        mail: "usuario4@mail.com", nickname: "User4", genero: "M", nombre: "Carlos",
        apellidos: "Martínez", contraseña: "root", edad: 30, premium: true,
        colorPelo: "Gris", colorOjos: "Café", fotoUsuario: "avatar004.png"
    });


    aficionesStore.add({aficion: "viajes", email: "ruben@adsi.com"});
    aficionesStore.add({aficion: "beber", email: "ruben@adsi.com"});
    aficionesStore.add({aficion: "mus", email: "marykay@adsi.com"});
    aficionesStore.add({aficion: "fiesta", email: "juan@correo.com"});
    aficionesStore.add({aficion: "bailar", email: "ana@correo.com"});

    matchesStore.add({user1: "pepe@xx", user2: "maria@xx", ok: 2});
    matchesStore.add({user1: "pepe@xx", user2: "juan@xx", ok: 1});
    matchesStore.add({user1: "jabi@xx", user2: "mary@xx", ok: 1});

    console.log("Datos agregados correctamente.");
}


/*
 * Esta función se ejecuta cuando carga la página
 */

