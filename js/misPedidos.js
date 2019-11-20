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

            pedidos = mapearPedidos(requests); // Mapeamos los pedidos para usarlos posteriormente
            drawRequests(requests, 'PedidosSelect'); // Incluímos los pedidos en un select

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

    // Mapear pedidos
    function mapearPedidos(requests) {
        return requests.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});
    }


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

    var drawRequests = function (requests, nodeId) {
        console.log('Dibujando requests en select');
        father = $('#'+nodeId);

        // Creamos la opción y la asignamos al select
        requests.forEach(request => {
            option = $('<option/>');
            option.attr({ 'value': request.id }).text(`Pedido: ${request.id}`);

            father.append(option);
        });

        // Cuando selecciona una opción se actualiza la vista del mapa
        father.click(function () {
            selectedOption = $(this).val();
            driver = pedidos[selectedOption].driver;
            // map.flyTo(tracker.getCurrentPosition(driver.id), 16);
            tracker.followDriver(driver.id);
        });

        // Necesario para desplegar todas las opciones
        father.attr('size', requests.length);
    }

}

$(document).ready(function() {
    $(bootstrap);
});