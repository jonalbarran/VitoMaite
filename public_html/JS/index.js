/*
 * Esta función se ejecuta cuando carga la página-------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function () {
   
    abrirBaseDeDatos();
});




function abrirBaseDeDatos() {
    var request = indexedDB.open("VitoMaite05", 1);

    request.onupgradeneeded = function (event) {
        var db = event.target.result;


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




        if (!db.objectStoreNames.contains("Aficiones")) {
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            
            aficionesStore.createIndex("id", "id", { unique: true });
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
        }
        
        
        if (!db.objectStoreNames.contains("Aficiones")) {
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            
            aficionesStore.createIndex("id", "id", { unique: true });
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
        }


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
        console.log("La base de datos 'BaseDeDatosUsuarios' se ha abierto con éxito");
        agregarDatos(db);
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
    [
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
    "imagen": "data:image/png;base64,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"
  }
]




    aficionesStore.add({ aficion: "Leer" });
        aficionesStore.add({ aficion: "Bailar" });
        aficionesStore.add({ aficion: "Pintar" });
        aficionesStore.add({ aficion: "Escribir" });
        aficionesStore.add({ aficion: "Nadar" });
        aficionesStore.add({ aficion: "Viajar" });
        aficionesStore.add({ aficion: "Mus" });
        aficionesStore.add({ aficion: "Correr" });
        aficionesStore.add({ aficion: "Cocinar" });
        aficionesStore.add({ aficion: "Senderismo" });
        aficionesStore.add({ aficion: "Música" });
        aficionesStore.add({ aficion: "Cantar" });
        aficionesStore.add({ aficion: "Yoga" });
        aficionesStore.add({ aficion: "Fotografía" });
        aficionesStore.add({ aficion: "Videojuegos" });

    meGustaStore.add({user1: "pepe@xx", user2: "maria@xx", ok: 2});
    meGustaStore.add({user1: "pepe@xx", user2: "juan@xx", ok: 1});
    meGustaStore.add({user1: "jabi@xx", user2: "mary@xx", ok: 1});

    console.log("Datos agregados correctamente.");
}



