var bootstrap = function () {
    urlEntregasYa = Config.urlEntregasYa;
    urlRequests = Config.urlRequests;

    map = createMap('mapid'); // Creamos el mapa

    tracker = new Tracker(map); // Instanciamos un trackeador
    drawer = new Drawer(); // Instanciamos al que sabe dibujar en el mapa

// -- Pedidos --
    requestPedidos() // Pedimos los pedidos
        .then(extractPedidos) // Extraemos los pedidos
        .then(requests => {
            requests.forEach(request => { // A cada pedido...
                resolverRepartidor(request) // Le agregamos el repartidor
                    .then(request => {
                        resolverPosiciones(request.driver) // Pedimos las posiciones del repartidor
                            .then(driver => {
                                driver = new Driver(driver); // Mapeamos a una clase Driver
                                tracker.addDriver(driver); // Agregamos el repartidor al trackeador
                            });
                    });
            });
        });

// -- Tipos de incidente --
    requestIncidentsTypes() // Pedimos los tipos de incidentes
        .then(extractIncidentTypes) // Extraemos los tipos de incidentes
        .then(types => drawIncidentTypes(types)); // Los dibujamos en la lista

        

// -- Incidentes --
    requestIncidents() // Pedimos los incidentes
        .then(extractIncidents) // Extraemos los incidentes
        .then(incidents => {
            incidents.forEach(incident => { // A cada incidente...
                resolveIncidentType(incident) // Pedimos el tipo de incidente
                    .then(drawIncident); // Dibujamos el incidente en el mapa
            });
        })

    var drawIncident = function (incident) {
        drawer.drawIncidentInMap(incident, map);
    }

    var drawIncidentTypes = function (incidentTypes) {
        drawer.drawTypesInList(incidentTypes, 'types');
    }

}

$(document).ready(function() {
    $(bootstrap);
});