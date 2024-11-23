let map; // Variable para el mapa
let userLocation; // Coordenadas del usuario
let distanceCircle; // Círculo que muestra el radio
let markers = []; // Almacenará los marcadores en el mapa

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Crear el mapa centrado en la ubicación del usuario
                map = new google.maps.Map(document.getElementById("map"), {
                    center: userLocation,
                    zoom: 15,
                });

                // Agregar un marcador en la ubicación del usuario
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "TÚ",
                });

                // Inicializar el círculo con una distancia predeterminada
                drawCircle(0.5);

                // Manejar el cambio de distancia en el desplegable
                document.getElementById("distance").addEventListener("change", (event) => {
                    const selectedDistance = parseFloat(event.target.value);
                    drawCircle(selectedDistance);
                });

                // Mostrar los usuarios como marcadores (con filtro de distancia)
                loadUsersFromIndexedDB();
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                alert("No se pudo obtener tu ubicación. Revisa los permisos del navegador.");
            }
        );
    } else {
        alert("Tu navegador no soporta la API de Geolocalización.");
    }
}

// Función para dibujar el círculo en el mapa
function drawCircle(kilometers) {
    const radiusInMeters = kilometers * 1000; // Convertir a metros

    if (distanceCircle) {
        distanceCircle.setMap(null); // Eliminar círculo existente
    }

    distanceCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
        map: map,
        center: userLocation,
        radius: radiusInMeters, // Radio en metros
    });

    // Filtrar y mostrar los usuarios dentro del nuevo radio
    updateVisibleMarkers(kilometers); // Usar kilómetros aquí
}

// Cargar usuarios desde IndexedDB y mostrarlos en el mapa
function loadUsersFromIndexedDB() {
    const request = indexedDB.open("VitoMaite05", 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");

        // Obtener todos los usuarios
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = (e) => {
            const usuarios = e.target.result;
            addMarkers(usuarios); // Agregar los marcadores después de obtener los usuarios
            updateVisibleMarkers(distanceCircle.getRadius() / 1000); // Filtrar según el radio actual (en kilómetros)
        };
    };

    request.onerror = (event) => {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}

// Añadir marcadores en el mapa para cada usuario
function addMarkers(usuarios) {
    // Eliminar marcadores existentes
    markers.forEach((marker) => marker.setMap(null));
    markers = [];

    usuarios.forEach((usuario) => {
        const lat = parseFloat(usuario.latitud);
        const lng = parseFloat(usuario.longitud);

        // Verifica si las coordenadas son válidas
        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 && lng !== 0)) {
            const marker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: map,
                title: usuario.nombre,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE, // Forma del marcador
                    fillColor: 'red', // Color de relleno
                    fillOpacity: 1, // Opacidad
                    strokeColor: 'white', // Color del borde
                    strokeWeight: 2, // Grosor del borde
                    scale: 10  // Escala (tamaño)
                }
            });

            // Mostrar información al hacer clic en el marcador
            const infoWindow = new google.maps.InfoWindow({
                content: `<div><h3>${usuario.nombre}</h3><h3>${usuario.apellido}</h3><h3>${usuario.edad}</h3></div>`,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        } else {
            console.warn(`Coordenadas inválidas para el usuario: ${usuario.nombre}`);
        }
    });
}

// Filtrar y mostrar los usuarios dentro del radio del círculo
function updateVisibleMarkers(radiusInKilometers) {
    markers.forEach((marker) => {
        const distance = calcularDistancia(
            userLocation.lat,
            userLocation.lng,
            marker.getPosition().lat(),
            marker.getPosition().lng()
        );

        // Mostrar u ocultar el marcador dependiendo de la distancia
        if (distance <= radiusInKilometers) { // Comparar en kilómetros
            marker.setMap(map); // Mostrar marcador
        } else {
            marker.setMap(null); // Ocultar marcador
        }
    });
}

// Calcular la distancia entre dos puntos usando la fórmula de Haversine
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}
