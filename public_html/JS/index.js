/*
 * esta funcion se ejecuta cuando carga la pagina
 */
document.addEventListener('DOMContentLoaded', function () {


    //debuggin
    //alert("Hola!");




    //deberia carga la BD de la aplicacion


    // 3 capas
    // LP LN LD


    // Llamar a la función para abrir/crear la base de datos al cargar la página


    abrirBaseDeDatos();


});


// Manejar errores
solicitud.onerror = function (evento) {
    console.error("Error al abrir la base de datos:", evento.target.error);
};


// Manejar éxito
solicitud.onsuccess = function (evento) {
    var db = evento.target.result;
    console.log("La base de datos 'maitevito' se ha abierto con éxito:", db);
};









// Función para abrir o crear la base de datos
function abrirBaseDeDatos() {
    // Abrir o crear una base de datos llamada con versión 1
    var solicitud = indexedDB.open("vitomaitebd", 1);


    // Configurar el comportamiento cuando se crea o se actualiza la base de datos
    solicitud.onupgradeneeded = function (evento) {
        var db = evento.target.result;


        // Crear almacén de objetos para Productos
        //var productosStore = db.createObjectStore("Productos", {keyPath: "id", autoIncrement: true});
//        productosStore.createIndex("nombre", "nombre", {unique: false});
//        productosStore.createIndex("categoria", "categoria", {unique: false});
//        productosStore.createIndex("vendedor", "vendedor", {unique: false});
//        productosStore.createIndex("comprador", "comprador", {unique: false});        
//        productosStore.createIndex("precio", "precio", {unique: false});
//        productosStore.createIndex("foto", "foto", {unique: false}); // Añadido campo para la foto
//        productosStore.createIndex("latitud", "latitud", {unique: false}); 
//        productosStore.createIndex("longitud", "longitud", {unique: false}); 
//        productosStore.createIndex("fechaSubida", "fechaSubida", {unique: false}); 


        //productosStore.add({nombre: "Teléfono móvil", categoria: "Electrónicos", vendedor: "ruben@adsi.com", comprador:"olga@adsi.com", precio: "100", foto: "producto001.png",latitud:"42.83",longitud:"-2.67",fechaSubida:"2023-11-01T09:00:00"});             
        //... mas productos 


        // Crear almacén de objetos para Categorías
//        var categoriasStore = db.createObjectStore("Categorias", {keyPath: "id", autoIncrement: true});
//        categoriasStore.createIndex("nombre", "nombre", {unique: true});
//
//        // Agregar algunos datos de muestra
//        categoriasStore.add({nombre: "Electrónicos"});
//        categoriasStore.add({nombre: "Ropa"});
//        categoriasStore.add({nombre: "Deporte"});


        //... aqui mas categorias


        // Crear almacén de objetos para Usuarios
        var usuariosStore = db.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
        usuariosStore.createIndex("email", "email", {unique: true});
        usuariosStore.createIndex("password", "password", {unique: false});
        usuariosStore.createIndex("foto", "foto", {unique: false}); // Añadido campo para la foto
        //usuariosStore.createIndex("edad", "edad", {unique: false}); // Añadido campo para la foto
        //si un campo es opcion en la BD existe, pero no tendra valor




        //usuariosStore.add({nombre: "Rubén", email: "ruben@adsi.com", password: "1234", foto: "avatar001.png",edad:"0",profesion:"N/D"});
        usuariosStore.add({nombre: "María", email: "maria@adsi.com", password: "1234", foto: "avatar002.png"});
        usuariosStore.add({nombre: "Olga", email: "olga@adsi.com", password: "1234", foto: "avatar003.png"});
        usuariosStore.add({nombre: "Julen", email: "julen@adsi.com", password: "1234", foto: "avatar004.png"});
    };


}