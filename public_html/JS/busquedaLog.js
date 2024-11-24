document.addEventListener('DOMContentLoaded', function () {
    const nombre = sessionStorage.getItem("nombre");
        const apellido = sessionStorage.getItem("apellido");
        const imagen = sessionStorage.getItem("imagen");
        mensajeBienvenida(nombre, apellido);
        actualizarFotoUsuario(imagen);
        botonCerrarSesion();
    
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
function mensajeBienvenida(nombre, apellido) {
    const mensajeBienvenida = document.getElementById("mensajeBienvenida");
    mensajeBienvenida.textContent = `Bienvenid@, ${nombre} ${apellido}`;
}

function actualizarFotoUsuario(imagen) {
    const fotoUsuario = document.getElementById("fotoUsuario");
    if (imagen) {
        fotoUsuario.src = imagen;
    } else {
        fotoUsuario.src = "IMG/default-user.png";
    }
}
function botonCerrarSesion() {

    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    cerrarSesionBtn.addEventListener("click", () => {
        window.location.href = "index.html";
        sessionStorage.clear();
        alert("Sesión cerrada correctamente.");
    });
}
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
    borrarTabla(); // Llamamos a la función que limpia la tabla si ya existe

    // Creamos el mensaje de "no hay resultados"
    if (resultados.length === 0) {
        document.getElementById('EtiquetaErrores').textContent = 'NO HAY USUARIOS CON LOS CRITERIOS SELECCIONADOS';
        return;
    }

    // Limpiamos el mensaje de errores
    document.getElementById('EtiquetaErrores').textContent = ''; 

    // Creamos una nueva tabla
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

    // Rellenamos la tabla con los datos
    
    
    resultados.forEach(usuario => {
        const aficiones = obtenerAficionesUsuario(usuario.mail);
        const checkBoxes = comprobarCheckboxes();

        console.log(compararArrays(checkBoxes, aficiones));
        // Si alguna afición coincide con los checkbox seleccionados
        if (compararArrays(checkBoxes, aficiones)) {
            
            const fila = document.createElement('tr');
            
            // Crear y agregar la imagen del usuario
            const fotoUsuario = document.createElement("img");
            fotoUsuario.src = "img/" + usuario.foto;

            fila.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td><img src="${usuario.imagen}" alt="ImagenUsuarioBNL"></td>
                <td><a href="index.html" class="btn-detalles">Más detalles</a></td>
            `;
            
            fila.appendChild(fotoUsuario);  // Agregar la foto a la fila
            tabla.appendChild(fila);  // Añadir la fila a la tabla
        }
    });

    // Finalmente, agregar la tabla al `main`
    main.appendChild(tabla);
}


function borrarTabla() {
    const tablaExistente = document.querySelector('#tabla-usuarios');

    // Eliminar tabla anterior si existe
    if (tablaExistente) {
        tablaExistente.remove();
    }
}


function comprobarCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const marcados = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            marcados.push(parseInt(checkbox.id));
        }
    });

    console.log(marcados);
    return marcados;
}


function obtenerAficionesUsuario(mail) {

    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("AficionUsuario", "readonly");
        const store = transaction.objectStore("AficionUsuario");

        const aficionesUsuario = []; // Aquí almacenaremos las aficiones del usuario

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const usuario = cursor.value;
                if (usuario.mail === mail) {
                    aficionesUsuario.push(usuario.aficionId);
                }
                 cursor.continue();
            }
             else {
                aficionesUsuario.sort((a, b) => a.edad - b.edad);
                // Mostrar los resultados una vez completada la búsqueda
                console.log(aficionesUsuario);
                return aficionesUsuario;
            }

        };
    };

    request.onerror = function () {
        console.error("Error al acceder a la base de datos.");
    };
}

function compararArrays(array1, array2) {
    // Usamos un Set para optimizar la búsqueda de elementos comunes
    
    if (array1 === null || array1.length === 0) {
    //array nulo, no tiene en cuenta las aficiones porque no hay ninguna marcada
    return true;
}else{
    
    // Comprobamos si algún elemento de array1 está en array2
    for (let i = 0; i < array1.length; i++) {
        
        console.log("1");
        if (array1[i]===array1[i]) {
            console.log("2");
            
            return true;
        }
    }
        console.log("3");
    
    }
    return false; 
}














