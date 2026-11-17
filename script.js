
/* =================================
   DATOS DE LAS LINEAS DEL METRO
================================= */

const lines = [
    { name: "Línea 1", route: "Pantitlán - Observatorio", level: "Baja" },
    { name: "Línea 2", route: "Cuatro Caminos - Tasqueña", level: "Media" },
    { name: "Línea 3", route: "Indios Verdes - Universidad", level: "Alta" },
    { name: "Línea 4", route: "Martín Carrera - Santa Anita", level: "Baja" },
    { name: "Línea 5", route: "Politécnico - Pantitlán", level: "Media" },
    { name: "Línea 6", route: "El Rosario - Martín Carrera", level: "Baja" },
    { name: "Línea 7", route: "El Rosario - Barranca del Muerto", level: "Media" },
    { name: "Línea 8", route: "Garibaldi - Constitución de 1917", level: "Alta" },
    { name: "Línea 9", route: "Tacubaya - Pantitlán", level: "Alta" },
    { name: "Línea 12", route: "Mixcoac - Tláhuac", level: "Media" }
];


/* =================================
   DATOS DE LAS ESTACIONES
================================= */

const stations = [
    { name: "Pantitlán", lat: 19.4154, lng: -99.0721, line: "Línea 1" },
    { name: "Observatorio", lat: 19.3984, lng: -99.2003, line: "Línea 1" },
    { name: "Tasqueña", lat: 19.3447, lng: -99.1403, line: "Línea 2" },
    { name: "Cuatro Caminos", lat: 19.4595, lng: -99.2157, line: "Línea 2" },
    { name: "Universidad", lat: 19.3245, lng: -99.1736, line: "Línea 3" },
    { name: "Indios Verdes", lat: 19.4953, lng: -99.1196, line: "Línea 3" },
    { name: "Hidalgo", lat: 19.4375, lng: -99.1477, line: "Línea 3" },
    { name: "Martín Carrera", lat: 19.4832, lng: -99.1040, line: "Línea 4" },
    { name: "Politécnico", lat: 19.5000, lng: -99.1490, line: "Línea 5" },
    { name: "El Rosario", lat: 19.5040, lng: -99.2000, line: "Línea 6" },
    { name: "Barranca del Muerto", lat: 19.3600, lng: -99.1890, line: "Línea 7" },
    { name: "Bellas Artes", lat: 19.4354, lng: -99.1411, line: "Línea 8" },
    { name: "Chabacano", lat: 19.4088, lng: -99.1352, line: "Línea 9" },
    { name: "Mixcoac", lat: 19.3757, lng: -99.1875, line: "Línea 12" },
    { name: "Tláhuac", lat: 19.2868, lng: -99.0144, line: "Línea 12" }
];


/* =================================
   MOSTRAR OCUPACION
================================= */

function getClass(level) {

    if (level === "Baja") return "low";

    if (level === "Media") return "medium";

    return "high";
}


function showLines() {

    const grid = document.getElementById("lineGrid");

    if (!grid) return;

    grid.innerHTML = "";

    lines.forEach(line => {

        grid.innerHTML += `
            <div class="line-card">
                <h3>${line.name}</h3>

                <p>${line.route}</p>

                <p class="level ${getClass(line.level)}">
                    Ocupación: ${line.level}
                </p>
            </div>
        `;

    });

}


/* =================================
   ESTADO GENERAL
================================= */

function showGeneralStatus() {

    const high = lines.filter(
        line => line.level === "Alta"
    ).length;

    const status = document.getElementById("generalLevel");

    if (!status) return;

    if (high >= 4) {

        status.textContent = "Alta";

    } else if (high >= 2) {

        status.textContent = "Variable";

    } else {

        status.textContent = "Estable";

    }

}


/* =================================
   CREAR MAPA INTERACTIVO
================================= */

// Comprobar que Leaflet esté cargado

if (typeof L === "undefined") {

    console.error("Error: No se pudo cargar la biblioteca Leaflet.");

} else {

    const mapElement = document.getElementById("map");

    if (mapElement) {

        // Centrar mapa en Ciudad de México

        const map = L.map("map").setView(
            [19.4326, -99.1332],
            11
        );

 // Pega aquí tu nueva clave API
const CARTO_API_KEY = "cb1_5amg_2_bdc09860de2e571ea74d8cf8";

// Cargar mapa
L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
    {
        attribution:
            '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 20
    }
).addTo(map);


        /* =================================
           MARCADORES DE ESTACIONES
        ================================= */

        const stationMarkers = {};

        stations.forEach(station => {

            const marker = L.marker([
                station.lat,
                station.lng
            ]).addTo(map);

            marker.bindPopup(`
                <strong>${station.name}</strong><br>
                ${station.line}
            `);

            stationMarkers[station.name] = marker;

        });


        /* =================================
           BUSCADOR DE ESTACIONES
        ================================= */

        const searchInput = document.getElementById("searchInput");

        if (searchInput) {

            searchInput.addEventListener("input", function() {

                const search = this.value.toLowerCase().trim();

                const resultBox = document.getElementById("searchResults");

                if (!resultBox) return;

                const results = stations.filter(station =>
                    station.name.toLowerCase().includes(search)
                );

                resultBox.innerHTML = "";

                if (search === "") return;

                if (results.length === 0) {

                    resultBox.innerHTML =
                        '<p class="no-results">No se encontró la estación.</p>';

                    return;

                }

                results.forEach(station => {

                    const result = document.createElement("div");

                    result.className = "search-result";

                    const button = document.createElement("button");

                    button.textContent =
                        `🚉 ${station.name} — ${station.line}`;

                    button.addEventListener("click", () => {

                        map.setView(
                            [station.lat, station.lng],
                            16
                        );

                        const marker = stationMarkers[station.name];

                        if (marker) {
                            marker.openPopup();
                        }

                    });

                    result.appendChild(button);

                    resultBox.appendChild(result);

                });

            });

        }

    } else {

        console.error("No se encontró el elemento con id='map'.");

    }

}


/* =================================
   MOSTRAR ALERTAS
================================= */

function showAlerts() {

    const alertBox = document.getElementById("alerts");

    if (!alertBox) return;

    const crowded = lines.filter(
        line => line.level === "Alta"
    );

    alertBox.innerHTML = "";

    if (crowded.length === 0) {

        alertBox.innerHTML =
            "<p>No hay alertas en los datos de prueba.</p>";

        return;

    }

    crowded.forEach(line => {

        alertBox.innerHTML += `
            <div class="alert">
                ⚠️ <strong>${line.name}</strong>: ocupación alta.
                <br>
                <small>${line.route}</small>
            </div>
        `;

    });

}


/* =================================
   RECOMENDACIONES
================================= */

function showRecommendation() {

    const crowded = lines.filter(
        line => line.level === "Alta"
    );

    const recommendation = document.getElementById(
        "recommendation"
    );

    if (!recommendation) return;

    if (crowded.length >= 3) {

        recommendation.textContent =
            "Varias líneas presentan ocupación alta. Consulta otras opciones antes de iniciar tu viaje.";

    } else {

        recommendation.textContent =
            "La ocupación registrada es variable. Consulta el estado de tu línea antes de viajar.";

    }

}


/* =================================
   INICIAR SMARTMOVE
================================= */

showLines();

showGeneralStatus();

showAlerts();

showRecommendation();

console.log("SmartMove se ha iniciado correctamente.");
