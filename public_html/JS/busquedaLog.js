document.addEventListener('DOMContentLoaded', function () {
    const nombre = sessionStorage.getItem("nombre");
    const apellido = sessionStorage.getItem("apellido");
    const imagen = sessionStorage.getItem("imagen");
    const mail = sessionStorage.getItem("mail");
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

            buscarUsuarios(genero, edadMin, edadMax, ciudad, mail);
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



function buscarUsuarios(genero, edadMin, edadMax, ciudad, mail) {
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


                // Log para cada variable antes de la comparación
                console.log("Comparando con los siguientes valores:");
                console.log("ciudad (filtro):", ciudad, "usuario.ciudad:", usuario.ciudad);
                console.log("edadMin:", edadMin, "usuario.edad:", usuario.edad);
                console.log("edadMax:", edadMax, "usuario.edad:", usuario.edad);
                console.log("usuario.genero:", usuario.genero);
                console.log(usuario.mail," comparado con ", mail);

                
                // Filtrar por criterios
                if (
                        (usuario.ciudad === ciudad) &&
                        (usuario.edad >= edadMin) &&
                        (usuario.edad <= edadMax) &&
                        (usuario.genero === genero) &&
                        (usuario.mail !== mail)
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


async function mostrarResultados(resultados) {
    const main = document.querySelector('main');
    borrarTabla(); // Llamamos a la función que limpia la tabla si ya existe

    // Creamos el mensaje de "no hay resultados"
    if (resultados.length === 0) {
        document.getElementById('EtiquetaErrores').textContent = 'NO HAY USUARIOS CON LOS CRITERIOS SELECCIONADOS';
         document.getElementById('resultados').textContent = '';
        return;
    }

    // Limpiamos el mensaje de errores
    document.getElementById('resultados').textContent = '';

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
        <th>Like</th>
    `;
    tabla.appendChild(encabezado);

    // Rellenamos la tabla con los datos
    for (const usuario of resultados) {
        const aficiones = await obtenerAficionesUsuario(usuario.mail); // Esperar las aficiones

        console.log(aficiones);
        const checkBoxes = comprobarCheckboxes();

        console.log(compararArrays(checkBoxes, aficiones));
        // Si alguna afición coincide con los checkbox seleccionados
        if (compararArrays(checkBoxes, aficiones)) {
            const fila = document.createElement('tr');

            // Crear y agregar la imagen del usuario
            const fotoUsuario = document.createElement("img");
            fotoUsuario.src = "img/" + usuario.foto;

                
            const btnLike = document.createElement("button");
            btnLike.classList.add("btn-like");
            btnLike.dataset.mail = usuario.mail; // Guardar el mail como dataset
            const iconoLike = document.createElement("img");
            iconoLike.src = "IMG/corazonDarLike.png"; // Ruta de la imagen del icono
            iconoLike.alt = "Like";
            iconoLike.style.width = "20px"; // Ajustar tamaño del icono
            iconoLike.style.height = "20px";
            btnLike.appendChild(iconoLike);

            // Añadir evento al botón para manejar el clic
            btnLike.addEventListener("click", () => manejarClickLike(usuario.mail));

            fila.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td><img src="${usuario.imagen}" alt="ImagenUsuarioBNL"></td>
                <td><button class="btn-detalles" data-mail="${usuario.mail}">Más detalles</button></td>
                
            `;
            const celdaLike = document.createElement("td");
            celdaLike.appendChild(btnLike);
            fila.appendChild(celdaLike);


            tabla.appendChild(fila);
        }
    }

    // Agregar un evento a todos los botones "Más detalles"
    tabla.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-detalles')) {
            const mailUsuario = e.target.dataset.mail; // Obtener el correo del usuario
            sessionStorage.setItem('usuarioSeleccionado', mailUsuario); // Guardar en sessionStorage
            window.location.href = 'detalles.html'; // Redirigir a detalles.html
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


    return marcados;
}


function obtenerAficionesUsuario(mail) {
    return new Promise((resolve, reject) => {
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
                } else {
                    resolve(aficionesUsuario); // Resolvemos la promesa con las aficiones encontradas
                }
            };


        };


    });
}








function compararArrays(array1, array2) {
    // Usamos un Set para optimizar la búsqueda de elementos comunes

    console.log("Comparando:", array1, "con", array2);
    if (array1 === null || array1.length === 0) {
        //array nulo, no tiene en cuenta las aficiones porque no hay ninguna marcada
        return true;
    } else {

        // Comprobamos si algún elemento de array1 está en array2
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                console.log("Comparando:", array1[i], "y", array2[j]);
                if (array1[i] === array2[j]) {
                    console.log(" encontrado:", array1[i]);

                    return true;
                }
            }
        }

    }
    return false;
}

function manejarClickLike(mail) {

    const request = indexedDB.open("VitoMaite05");

    request.onsuccess = function (event) {
        const db = event.target.result; // Referencia a la base de datos
        console.log("Base de datos 'VitoMaite05' abierta exitosamente");

        console.log('Se dio like al usuario con mail: ${mail}');
        // Aquí puedes agregar lógica adicional, como registrar el like en una base de datos.

        const mailUsuario = sessionStorage.getItem("mail");
        console.log(mailUsuario);

        // Crear una transacción de solo lectura en la tabla "MeGusta"
        const transaction = db.transaction(["meGusta"], "readwrite");
        const meGustaStore = transaction.objectStore("meGusta");

        // Usar un cursor para recorrer los registros
        const cursorRequest = meGustaStore.openCursor();
        let centinela= false;
        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const meGusta = cursor.value;
                console.log(meGusta.user1, mail, meGusta.user2, mailUsuario);
                if (meGusta.user1 === mail && meGusta.user2 === mailUsuario) {
                       centinela=true;
                    if (meGusta.like === '2') {
                        alert('Ya tenias match');
                    } else {
                        meGusta.like = '2';
                        alert('Has hecho Match');
                        const updateRequest = cursor.update(meGusta);
                    }
                } else if (meGusta.user1 === mailUsuario && meGusta.user2 === mail)
                {       centinela=true;
                    if (meGusta.like === '2') {
                        alert('Ya tenias match');
                    } else {
                        meGusta.like = '2';
                        alert('Has hecho Match');
                        const updateRequest = cursor.update(meGusta);
                    }
                } 
                cursor.continue();
            }else{
                if(centinela===false){
            alert('Le has dado Like');
            const nuevoRegistro = {
            user1: mailUsuario,
            user2: mail,
            like: '1',
            fecha:new Date().toISOString()
        };
        const addRequest = meGustaStore.add(nuevoRegistro);
            
            }
            ;




        };
        
    
};
};
}

function manejarClickLike(mail) {

    const request = indexedDB.open("VitoMaite05");

    request.onsuccess = function (event) {
        const db = event.target.result; // Referencia a la base de datos
        console.log("Base de datos 'VitoMaite05' abierta exitosamente");

        console.log('Se dio like al usuario con mail: ${mail}');
        // Aquí puedes agregar lógica adicional, como registrar el like en una base de datos.

        const mailUsuario = sessionStorage.getItem("mail");
        console.log(mailUsuario);

        // Crear una transacción de solo lectura en la tabla "MeGusta"
        const transaction = db.transaction(["meGusta"], "readwrite");
        const meGustaStore = transaction.objectStore("meGusta");

        // Usar un cursor para recorrer los registros
        const cursorRequest = meGustaStore.openCursor();
        let centinela= false;
        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const meGusta = cursor.value;
                console.log(meGusta.user1, mail, meGusta.user2, mailUsuario);
                if (meGusta.user1 === mail && meGusta.user2 === mailUsuario) {
                       centinela=true;
                    if (meGusta.like === '2') {
                        console.log('Ya tenias match');
                    } else {
                        meGusta.like = '2';
                        console.log('Has hecho Match');
                        const updateRequest = cursor.update(meGusta);
                    }
                } else if (meGusta.user1 === mailUsuario && meGusta.user2 === mail)
                {       centinela=true;
                    if (meGusta.like === '2') {
                        console.log('Ya tenias match');
                    } else {
                        meGusta.like = '2';
                        console.log('Has hecho Match');
                        const updateRequest = cursor.update(meGusta);
                    }
                } 
                cursor.continue();
            }else{
                if(centinela===false){
            console.log('Le has dado Like');
            const nuevoRegistro = {
            user1: mailUsuario,
            user2: mail,
            like: '1',
            fecha:new Date().toISOString()
        };
        const addRequest = meGustaStore.add(nuevoRegistro);
            
            }
            ;




        };
        
        
    };
};
}
