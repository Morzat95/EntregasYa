var bootstrap = function () {
    urlEntregasYa = Config.urlEntregasYa;
    urlRequests = Config.urlRequests;

    map = createMap('mapid', Config.ungsLocation); // Creamos el mapa

    drawer = new Drawer(); // Instanciamos al que sabe dibujar en el mapa y la página
    tracker = new Tracker(map, drawer); // Instanciamos un trackeador

// -- Retriving Data From URL --

    requestId = getRequestId();

    function getRequestId() {
       return retrieveParamsData('TipoPaquete');
    }

    function retrieveParamsData(param) {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var value = url.searchParams.get(param);
        return value;
    }


// -- Pedidos --
    // requestPedidos(requestId) // Pedimos el pedido
    //     .then(extractPedido) // Extraemos el pedido
    //     .then(requests => {

    //         // pedidos = mapearPedidos(requests); // Mapeamos los pedidos para usarlos posteriormente
    //         // drawer.drawRequests(requests, 'PedidosSelect'); // Incluímos los pedidos en un select

    //         requests = [requests]; // Hack para no romper todo lo que ya está

    //         requests.forEach(request => { // A cada pedido...

    //             drawer.drawMarkerInMap(`Origen pedido ${request.id}`, map, request.sender, Config.getOriginIcon()); // Dibujamos el origen del pedido
    //             drawer.drawMarkerInMap(`Destino pedido ${request.id}`, map, request.receiver, Config.getDestinationIcon()); // Dibujamos el destino del pedido

    //             // resolverRepartidor('¡request) // Le agregamos el repartidor
    //             //     .then(request => {
    //             //         resolverPosiciones(request.driver) // Pedimos las posiciones del repartidor
    //             //             .then(driver => {
    //             //                 driver = new Driver(driver); // Mapeamos a una clase Driver
    //             //                 tracker.addDriver(driver); // Agregamos el repartidor al trackeador
    //             //             });
    //             //     });

    //             // request.availableDrivers.forEach(driver => {
    //             //     drawer.drawDriverInMap(driver, map, onDriverclick(driver.driver_id));
    //             // })

    //             // resolverRepartidores(request) // Le agregamos los repartidores
    //             //     .then(request => {
    //             //         // resolverPosiciones(request.driver) // Pedimos las posiciones del repartidor
    //             //             request.availableDrivers.forEach(driver => {
    //             //                 driver = new Driver(driver); // Mapeamos a una clase Driver
    //             //                 tracker.addDriver(driver); // Agregamos el repartidor al trackeador
    //             //             });
    //             //     });

    //             resolverRepartidores(request)
    //                 .then(console.log('rest'));
    //         });
    //     });

    requestPedidos(requestId)
        .then(extractPedido)
        .then(request => {
            currentRequest = request;

            drawer.drawMarkerInMap('Origen', map, request.sender, Config.getOriginIcon()); // Dibujamos el origen del pedido
            drawer.drawMarkerInMap('Destino', map, request.receiver, Config.getDestinationIcon()); // Dibujamos el destino del pedido

            availableDrivers = request.availableDrivers;

            request.availableDrivers = [];

            availableDrivers.forEach(driverData => {
                resolverRepartidor(request, driverData.driver_id)
                            .then(resolverPosiciones)
                            .then(driver => {
                                driver.initialPosition = driverData.position; // Sino unshift para ponerla al inicio del array de posiciones
                                driver = new Driver(driver);
                                // drawDriver(driver);
                                tracker.addDriver(driver);
                            });
            });

        });

    // var drawDriver = function (driver) {
    //     drawer.drawDriverInMap(driver, map, onDriverclick);
    // }

    // var onDriverclick = function (driver) {
    //     console.log('callback');
    //     return function (e) {
    //         console.log('callback function return');
    //         tracker.addDriver(driver);
    //     }
    // }

    // Si arrastra el mapa dejamos de seguir al conductor
    map.on('dragend', function () {
        tracker.resetMapView();
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