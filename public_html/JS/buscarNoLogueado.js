document.addEventListener('DOMContentLoaded', function () {
    // Inicializar la base de datos

    // Escuchar el evento de envío del formulario
    const form = document.getElementById('form-buscar');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar recargar la página

        // Obtener los valores de los filtros
        const genero = document.getElementById('preferencia').value;
        const edadMin = parseInt(document.getElementById('edad-min').value, 10);
        const edadMax = parseInt(document.getElementById('edad-max').value, 10);
        const ciudad = document.getElementById('ciudad').value;

        // Buscar en la base de datos
        buscarUsuarios(genero, edadMin, edadMax, ciudad);
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
    console.log("preferencia (filtro):", genero, "usuario.genero:", usuario.genero);

    // Filtrar por criterios
    if (
        (ciudad === '' || usuario.ciudad === ciudad) &&
        (isNaN(edadMin) || usuario.edad >= edadMin) &&
        (isNaN(edadMax) || usuario.edad <= edadMax) &&
        (genero === '' || usuario.genero === genero)
    ) {
        resultados.push(usuario);
        
    }

    cursor.continue(); // Continuar con el siguiente registro
} else {
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
    const tablaExistente = document.querySelector('#tabla-usuarios');
    if (tablaExistente) tablaExistente.remove(); // Eliminar tabla anterior si existe
    const mensaje = document.createElement('p');
    if (resultados.length === 0) {
        mensaje.textContent = "No se encontraron resultados.";
        main.appendChild(mensaje);
        return;
    }else{
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
        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.edad}</td>
           <td><img src="" alt="ImagenUsuarioTablaNoLog"></td>
            <td><a h ref="index.html" class="btn-detalles">Más detalles</a></td>
        `;
        tabla.appendChild(fila);
    });

    main.appendChild(tabla); // Agregar la tabla al `main`
}
}
