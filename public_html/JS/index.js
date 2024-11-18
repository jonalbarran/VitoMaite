document.addEventListener('DOMContentLoaded', function () {
    abrirBaseDeDatos();
});

function abrirBaseDeDatos() {
    var request = indexedDB.open("VitoMaite05", 1);

    request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Crear el objectStore de "Usuarios" solo si no existe
        if (!db.objectStoreNames.contains("Usuarios")) {
            var usuariosStore = db.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
            usuariosStore.createIndex("mail", "mail", {unique: true});
            usuariosStore.createIndex("contrasena", "contrasena", {unique: false});
            usuariosStore.createIndex("genero", "genero", {unique: false});
            usuariosStore.createIndex("nombre", "nombre", {unique: false});
            usuariosStore.createIndex("apellido", "apellido", {unique: false});
            usuariosStore.createIndex("edad", "edad", {unique: false});
            usuariosStore.createIndex("premium", "premium", {unique: false});
            usuariosStore.createIndex("ciudad", "ciudad", {unique: false});
        }

        // Crear el objectStore de "Aficiones" solo si no existe
        if (!db.objectStoreNames.contains("Aficiones")) {
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
        }

        // Crear el objectStore de "meGusta" solo si no existe
        if (!db.objectStoreNames.contains("meGusta")) {
            var meGustaStore = db.createObjectStore("meGusta", {keyPath: "id", autoIncrement: true});
            meGustaStore.createIndex("user1", "user1", {unique: false});
            meGustaStore.createIndex("user2", "user2", {unique: false});
            meGustaStore.createIndex("ok", "ok", {unique: false});
        }

        console.log("Almacenes de objetos creados con éxito.");
    };

    request.onsuccess = function (event) {
        var db = event.target.result;
        console.log("La base de datos 'VitoMaite05' se ha abierto con éxito");
        agregarDatos(db);
    };

    request.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
}

function agregarDatos(db) {
    var usuariosTransaction = db.transaction("Usuarios", "readwrite");
    var aficionesTransaction = db.transaction("Aficiones", "readwrite");
    var meGustaTransaction = db.transaction("meGusta", "readwrite");

    var usuariosStore = usuariosTransaction.objectStore("Usuarios");
    var aficionesStore = aficionesTransaction.objectStore("Aficiones");
    var meGustaStore = meGustaTransaction.objectStore("meGusta");

    // Usuarios de ejemplo
    var usuarios = [
        {
            "id": 1,
            "mail": "juan.perez@example.com",
            "contrasena": "juan123",
            "genero": "Masculino",
            "nombre": "Juan",
            "apellido": "Pérez",
            "edad": 28,
            "premium": false,
            "ciudad": "Bilbao",
            "imagen": "base64imagen1"
        },
        {
            "id": 2,
            "mail": "maria.gomez@example.com",
            "contrasena": "maria123",
            "genero": "Femenino",
            "nombre": "María",
            "apellido": "Gómez",
            "edad": 24,
            "premium": false,
            "ciudad": "Donosti",
            "imagen": "base64imagen2"
        },
        {
            "id": 3,
            "mail": "pedro.lopez@example.com",
            "contrasena": "pedro123",
            "genero": "Masculino",
            "nombre": "Pedro",
            "apellido": "López",
            "edad": 35,
            "premium": false,
            "ciudad": "Bilbao",
            "imagen": "base64imagen3"
        },
        {
            "id": 4,
            "mail": "laura.sanchez@example.com",
            "contrasena": "laura123",
            "genero": "Femenino",
            "nombre": "Laura",
            "apellido": "Sánchez",
            "edad": 30,
            "premium": false,
            "ciudad": "Donosti",
            "imagen": "base64imagen3"
        }
    ];

    // Agregar los usuarios a la base de datos
    usuarios.forEach(function (usuario) {
        usuariosStore.add(usuario);
    });

    // Aficiones de ejemplo
    var aficiones = [
        "Leer", "Bailar", "Pintar", "Escribir", "Nadar", "Viajar", "Mus", "Correr", "Cocinar", 
        "Senderismo", "Música", "Cantar", "Yoga", "Fotografía", "Videojuegos"
    ];

    aficiones.forEach(function (aficion) {
        aficionesStore.add({ aficion: aficion });
    });

    // Me gusta de ejemplo
    meGustaStore.add({ user1: "pepe@xx", user2: "maria@xx", ok: 2 });
    meGustaStore.add({ user1: "pepe@xx", user2: "juan@xx", ok: 1 });
    meGustaStore.add({ user1: "jabi@xx", user2: "mary@xx", ok: 1 });

    console.log("Datos agregados correctamente.");
}
