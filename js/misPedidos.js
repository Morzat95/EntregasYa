var bootstrap = function () {
    urlEntregasYa = Config.urlEntregasYa;
    urlRequests = Config.urlRequests;

    map = createMap('mapid', Config.ungsLocation); // Creamos el mapa

    drawer = new Drawer();              // Instanciamos al que sabe dibujar en el mapa y en la página
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
    requestPedidos(requestId)                                   // Pedimos el pedido
    .then(extractPedido)                                        // Extraemos el pedido
    .then(request => {
        currentRequest = request;
        
        drawOrigin(request.sender);                             // Dibujamos el origen del pedido
        drawDestination(request.receiver);                      // Dibujamos el destino del pedido
        
        availableDrivers = request.availableDrivers;
        
        request.availableDrivers = [];                          // Limpiamos el array de repartidores
        
        availableDrivers.forEach(driverData => {                // Por cada repartidor...
            resolverRepartidor(request, driverData.driver_id)   // Le agregamos el repartidor
            .then(resolverPosiciones)                           // Pedimos las posiciones del repartidor
            .then(driver => {
                driver.initialPosition = driverData.position;   // Sino unshift para ponerla al inicio del array de posiciones
                driver = new Driver(driver);                    // Mapeamos a una clase Driver
                tracker.addDriver(driver);                      // Agregamos el repartidor al trackeador
            });
        });
        
    });
    
    var drawOrigin = function (address) {
        drawAddress(address, 'Origen'); // TODO: ver de implementar enums para Origen, Destino y por ahí otro. https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/
    }

    var drawDestination = function (address) {
        drawAddress(address, 'Destino');
    }

    var drawAddress = function (address, type) {
    // No puedo usar 'drawAddressInMap' porque la address que usa el normalizador es distina
    // de la del pedido (solo son cooredenadas para éste último)
        // address.addressType = type;
        // drawer.drawAddressInMap(address, map);
        
        // drawer.drawMarkerInMap(type, map, address, Config.getOriginIcon());
        drawer.drawMarkerInMap(type, map, address, Config.getAddressIcon(type));
    }

    // Si arrastra el mapa dejamos de seguir al conductor
    map.on('dragend', function () {
        tracker.resetMapView();
    });


// -- Tipos de incidente --
    requestIncidentsTypes()                         // Pedimos los tipos de incidentes
        .then(extractIncidentTypes)                 // Extraemos los tipos de incidentes
        .then(types => drawIncidentTypes(types));   // Los dibujamos en la lista

        
// -- Incidentes --
    requestIncidents()                          // Pedimos los incidentes
        .then(extractIncidents)                 // Extraemos los incidentes
        .then(incidents => {
            incidents.forEach(incident => {     // A cada incidente...
                resolveIncidentType(incident)   // Pedimos el tipo de incidente
                    .then(drawIncident);        // Dibujamos el incidente en el mapa
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