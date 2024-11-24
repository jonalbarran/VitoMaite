document.addEventListener('DOMContentLoaded', function () {
    // Inicializar la base de datos
    abrirBaseDeDatos();
    // Escuchar el evento de envío del formulario
    const form = document.getElementById('form-buscar');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar recargar la página

        // Obtener los valores de los filtros
        const genero = document.getElementById('preferencia').value;
        const edadMin = parseInt(document.getElementById('edad-min').value, 10);
        const edadMax = parseInt(document.getElementById('edad-max').value, 10);
        const ciudad = document.getElementById('ciudad').value;

        if (edadMin > edadMax) {
            document.getElementById('EtiquetaErrores').textContent = 'LA EDAD MÁXIMA TIENE QUE SER MAYOR QUE LA MÍNIMA';
            borrarTabla();
        } else if (edadMin < 18) {
            document.getElementById('EtiquetaErrores').textContent = 'LA EDAD DEBE SER MAYOR QUE 18';
            borrarTabla();
        } else if (edadMax > 101) {
            document.getElementById('EtiquetaErrores').textContent = 'LA EDAD DEBE SER MENOR QUE 101';
            borrarTabla();
        } else if (isNaN(edadMin) || isNaN(edadMax)) {
            document.getElementById('EtiquetaErrores').textContent = 'RELLENA LOS CAMPOS DE EDAD';
            borrarTabla();

        } else {
            // Buscar en la base de datos
            document.getElementById('EtiquetaErrores').textContent = '';

            buscarUsuarios(genero, edadMin, edadMax, ciudad);
        }
    });
});

function buscarUsuarios(genero, edadMin, edadMax, ciudad) {
    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");

        const resultados = []; // Aquí almacenaremos los usuarios filtrados

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const usuario = cursor.value;
                console.log("Usuario encontrado:", usuario);

                // Log para cada variable antes de la comparación
                console.log("Comparando con los siguientes valores:");
                console.log("ciudad (filtro):", ciudad, "usuario.ciudad:", usuario.ciudad);
                console.log("edadMin:", edadMin, "usuario.edad:", usuario.edad);
                console.log("edadMax:", edadMax, "usuario.edad:", usuario.edad);
                console.log("usuario.genero:", usuario.genero);

                // Filtrar por criterios
                if (
                        (usuario.ciudad === ciudad) &&
                        (usuario.edad >= edadMin) &&
                        (usuario.edad <= edadMax) &&
                        (usuario.genero === genero)
                        ) {
                    resultados.push(usuario);


                }

                cursor.continue(); // Continuar con el siguiente registro
            } else {
                resultados.sort((a, b) => a.edad - b.edad);
                // Mostrar los resultados una vez completada la búsqueda
                mostrarResultados(resultados);
            }

        };
    };

    request.onerror = function () {
        console.error("Error al acceder a la base de datos.");
    };
}


function mostrarResultados(resultados) {
    const main = document.querySelector('main');
    borrarTabla();

    const mensaje = document.createElement('p');
    if (resultados.length === 0) {
        document.getElementById('EtiquetaErrores').textContent = 'NO HAY USUARIOS CON LOS CRITERIOS SELECCIONADOS';
        return;
    } else {
        mensaje.textContent = " ";
        const tabla = document.createElement('table');
        tabla.id = 'tabla-usuarios';

        // Crear encabezados de la tabla
        const encabezado = document.createElement('tr');
        encabezado.innerHTML = `
        <th>Nombre</th>
        <th>Edad</th>
        <th>Foto</th>
        <th>Mas detalles</th>
        
        
    `;
        tabla.appendChild(encabezado);

        // Rellenar la tabla con los datos
        resultados.forEach(usuario => {
            const fila = document.createElement('tr');
            var fotoUsuario = document.createElement("img");
            fotoUsuario.src = "img/" + usuario.foto;
            console.log("1");
            fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.edad}</td>
            <td><img src="${usuario.imagen}" alt="ImagenUsuarioBNL"></td>
            <td><a href="index.html" class="btn-detalles">Más detalles</a></td>
            
        `;
            console.log(usuario.imagen);
            tabla.appendChild(fila);


        });

        main.appendChild(tabla); // Agregar la tabla al `main`
    }
}

function borrarTabla() {
    const tablaExistente = document.querySelector('#tabla-usuarios');

    // Eliminar tabla anterior si existe
    if (tablaExistente) {
        tablaExistente.remove();
    }
}


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
            usuariosStore.createIndex("latitud", "latitud", {unique: false});
            usuariosStore.createIndex("longitud", "longitud", {unique: false});
            usuariosStore.createIndex("imagen", "imagen", {unique: false});
        }
        
        if (!db.objectStoreNames.contains("AficionUsuario")) {
        var aficionUsuarioStore = db.createObjectStore("AficionUsuario", {keyPath: "id", autoIncrement: true});
        aficionUsuarioStore.createIndex("mail", "mail", {unique: false});
        aficionUsuarioStore.createIndex("aficionId", "aficionId", {unique: false});
    }
    
       

        var usuariosAficiones = [
            {mail: "laura.sanchez@example.com", aficionId: 1}, // Afición 1
            {mail: "laura.sanchez@example.com", aficionId: 2}, // Afición 2
            {mail: "aitzol.gomez@example.com", aficionId: 3},
            {mail: "aitzol.gomez@example.com", aficionId: 4},
            {mail: "alazne.ortiz@example.com", aficionId: 5},
            {mail: "alazne.ortiz@example.com", aficionId: 6},
            {mail: "andres.sanchez@example.com", aficionId: 7},
            {mail: "andres.sanchez@example.com", aficionId: 8},
            {mail: "ane.uribe@example.com", aficionId: 9},
            {mail: "ane.uribe@example.com", aficionId: 10},
            {mail: "borja.martinez@example.com", aficionId: 11},
            {mail: "borja.martinez@example.com", aficionId: 12},
            {mail: "carla.perez@example.com", aficionId: 13},
            {mail: "carla.perez@example.com", aficionId: 14},
            {mail: "carlos.garcia@example.com", aficionId: 15},
            {mail: "daniel.lopez@example.com", aficionId: 1},
            {mail: "daniel.lopez@example.com", aficionId: 2},
            {mail: "david.martin@example.com", aficionId: 3},
            {mail: "david.martin@example.com", aficionId: 4},
            {mail: "estibaliz.garcia@example.com", aficionId: 5},
            {mail: "estibaliz.garcia@example.com", aficionId: 6},
            {mail: "juan.perez@example.com", aficionId: 7},
            {mail: "juan.perez@example.com", aficionId: 8},
            {mail: "omar.lopez@example.com", aficionId: 9},
            {mail: "omar.lopez@example.com", aficionId: 10},
            {mail: "pedro.gomez@example.com", aficionId: 11}
        ];

        usuariosAficiones.forEach(function (aficionUsuario) {
            aficionUsuarioStore.add(aficionUsuario);
        });

        // Crear el objectStore de "Aficiones" solo si no existe
        if (!db.objectStoreNames.contains("Aficiones")) {
            var aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            aficionesStore.createIndex("aficion", "aficion", {unique: false});
        }
        // Aficiones de ejemplo
        var aficiones = [
            "Leer", "Bailar", "Pintar", "Escribir", "Nadar", "Viajar", "Mus", "Correr", "Cocinar",
            "Senderismo", "Música", "Cantar", "Yoga", "Fotografía", "Videojuegos"
        ];

        aficiones.forEach(function (aficion) {
            aficionesStore.add({aficion: aficion});
        });


        // Crear el objectStore de "meGusta" solo si no existe
        if (!db.objectStoreNames.contains("meGusta")) {
            var meGustaStore = db.createObjectStore("meGusta", {keyPath: "id", autoIncrement: true});
            meGustaStore.createIndex("user1", "user1", {unique: false});
            meGustaStore.createIndex("user2", "user2", {unique: false});
            meGustaStore.createIndex("like", "like", {unique: false});
        }
        meGustaStore.add({user1: "carla.perez@example.com", user2: "omar.lopez@example.com", fecha: "03-11-2024T15:47", like: "2"});
        meGustaStore.add({user1: "laura.sanchez@example.com", user2: "omar.lopez@example.com", fecha: "03-11-2024T15:47", like: "2"});
        meGustaStore.add({user1: "omar.lopez@example.com", user2: "laura.sanchez@example.com", fecha: "03-11-2024T15:47", like: "2"});

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


    var base64imagen1 = '';
    var base64imagen2 = '';
    var base64imagen3 = '';
    var base64imagen4 = '';
    var base64imagen5 = '';
    var base64imagen6 = '';
    var base64imagen7 = '';
    var base64imagen8 = '';
    var base64imagen9 = '';
    var base64imagen10 = '';
    var base64imagen11 = '';
    var base64imagen12 = '';
    var base64imagen13 = '';
    var base64imagen14 = '';
    
    // Usuarios
    var usuarios = [
        {
            "id": 1,
            "mail": "laura.sanchez@example.com",
            "contrasena": "laura123",
            "genero": "Femenino",
            "nombre": "Laura",
            "apellido": "Sánchez",
            "edad": 30,
            "premium": false,
            "ciudad": "Donosti",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen1
        },
        {
            "id": 2,
            "mail": "aitzol.gomez@example.com",
            "contrasena": "aitzol123",
            "genero": "Masculino",
            "nombre": "Aitzol",
            "apellido": "Gómez",
            "edad": 27,
            "premium": false,
            "ciudad": "Bilbao",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen2
        },
        {
            "id": 3,
            "mail": "alazne.ortiz@example.com",
            "contrasena": "alazne123",
            "genero": "Femenino",
            "nombre": "Alazne",
            "apellido": "Ortiz",
            "edad": 22,
            "premium": false,
            "ciudad": "Vitoria",
            "latitud": "42.853952353623626",
            "longitud": "-2.6790045547584014",
            "imagen": base64imagen3
        }
        , {
            "id": 4,
            "mail": "andres.sanchez@example.com",
            "contrasena": "andres123",
            "genero": "Masculino",
            "nombre": "Andres",
            "apellido": "Sánchez",
            "edad": 34,
            "premium": false,
            "ciudad": "Donosti",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen4
        }, {
            "id": 5,
            "mail": "ane.uribe@example.com",
            "contrasena": "ane123",
            "genero": "Femenino",
            "nombre": "Ane",
            "apellido": "Uribe",
            "edad": 20,
            "premium": false,
            "ciudad": "Bilbao",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen5
        }
        , {
            "id": 6,
            "mail": "borja.martinez@example.com",
            "contrasena": "borja123",
            "genero": "Masculino",
            "nombre": "Borja",
            "apellido": "Martínez",
            "edad": 29,
            "premium": false,
            "ciudad": "Donosti",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen6
        }
        , {
            "id": 7,
            "mail": "carla.perez@example.com",
            "contrasena": "carla123",
            "genero": "Femenino",
            "nombre": "Carla",
            "apellido": "Pérez",
            "edad": 24,
            "premium": false,
            "ciudad": "Vitoria",
            "latitud": "42.855619",
            "longitud": "-2.671592",
            "imagen": base64imagen7
        }
        , {
            "id": 8,
            "mail": "carlos.garcia@example.com",
            "contrasena": "carlos123",
            "genero": "Masculino",
            "nombre": "Carlos",
            "apellido": "García",
            "edad": 32,
            "premium": false,
            "ciudad": "Bilbao",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen8
        },

        {
            "id": 9,
            "mail": "daniel.lopez@example.com",
            "contrasena": "daniel123",
            "genero": "Masculino",
            "nombre": "Daniel",
            "apellido": "López",
            "edad": 28,
            "premium": false,
            "ciudad": "Donosti",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen9
        },
        {
            "id": 10,
            "mail": "david.martin@example.com",
            "contrasena": "david123",
            "genero": "Masculino",
            "nombre": "David",
            "apellido": "Martín",
            "edad": 35,
            "premium": false,
            "ciudad": "Bilbao",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen10
        },
        {
            "id": 11,
            "mail": "estibaliz.garcia@example.com",
            "contrasena": "estibaliz123",
            "genero": "Femenino",
            "nombre": "Estíbaliz",
            "apellido": "García",
            "edad": 30,
            "premium": false,
            "ciudad": "Vitoria",
            "latitud": "42.845516",
            "longitud": "-2.684636",
            "imagen": base64imagen11
        }
        , {
            "id": 12,
            "mail": "juan.perez@example.com",
            "contrasena": "juan123",
            "genero": "Masculino",
            "nombre": "Juan",
            "apellido": "Pérez",
            "edad": 40,
            "premium": false,
            "ciudad": "Donosti",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen12
        },
        {
            "id": 15,
            "mail": "omar.lopez@example.com",
            "contrasena": "omar123",
            "genero": "Masculino",
            "nombre": "Omar",
            "apellido": "López",
            "edad": 46,
            "premium": false,
            "ciudad": "Bilbao",
            "latitud": "0",
            "longitud": "0",
            "imagen": base64imagen13
        },
        {
            "id": 14,
            "mail": "pedro.gomez@example.com",
            "contrasena": "pedro123",
            "genero": "Masculino",
            "nombre": "Pedro",
            "apellido": "Gómez",
            "edad": 33,
            "premium": false,
            "ciudad": "Vitoria",
            "latitud": "42.839429",
            "longitud": "-2.673291",
            "imagen": base64imagen14
        }

    ];


    // Agregar los usuarios a la base de datos
    usuarios.forEach(function (usuario) {
        usuariosStore.add(usuario);
    });
    
    
        
    }
    

    