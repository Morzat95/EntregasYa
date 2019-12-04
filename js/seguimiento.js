var bootstrap = function () {
    urlEntregasYa = Config.urlEntregasYa;
    urlRequests = Config.urlRequests;

    map = createMap('mapid', Config.ungsLocation);  // Creamos el mapa

    drawer = new Drawer(map);       // Instanciamos al que sabe dibujar en el mapa y en la página
    tracker = new Tracker(drawer);  // Instanciamos un trackeador


// -- Filtros --
    _filtros = {};  // Solo soportamos el Score porque el resto de filtros no son propiedades que tienen actualmente los repartidores

    // Obtenemos el input del score
    $('#score').change(function () {
        selectedOption = $(this).find(':selected');
        _filtros['score'] = selectedOption.val();
    });

    // Filtramos los repartidores
    $('#BtnListarRepartidores').click(function () {

        matchedDrivers = tracker.getMatchedDrivers(_filtros);

        drawer.removeUnselectedDrivers(matchedDrivers);
        drawer.removeAllContent(['list-tab', 'nav-tabContent']);
        
        for (var driverId in matchedDrivers)
            drawer.drawDriverInList(matchedDrivers[driverId]);

    });

    
// -- Retriving Data From URL --
    _url = retrieveData();      // URL con los datos del formulario
    requestId = getRequestId(); // ID del pedido a buscar

    function retrieveData() {
        var url_string = window.location.href;
        return new URL(url_string);
    }

    function getRequestId() {
       return retrieveParamsData('TipoPaquete');
    }

    function retrieveParamsData(param) {
        var value = _url.searchParams.get(param);
        return value;
    }


// -- Pedidos --
    requestPedidos(requestId)                                   // Pedimos el pedido
    .then(extractPedido)                                        // Extraemos el pedido
    .then(resolverOrigen)                                       // Resolvemos el Origen
    .then(resolverDestino)                                      // Resolvemos el Destino
    .then(request => {
        currentRequest = request;                               // Guardamos una referencia al request para usarlo posteriormente (creo que no lo usamos al final)

        drawAddress(request.sender);                            // Dibujamos el origen del pedido
        drawAddress(request.receiver);                          // Dibujamos el destino del pedido
        
        availableDrivers = request.availableDrivers;
        
        request.availableDrivers = [];                          // Limpiamos el array de repartidores
        
        availableDrivers.forEach(driverData => {                // Por cada repartidor...
            resolverRepartidor(request, driverData.driver_id)   // Le agregamos el repartidor
            .then(resolverPosiciones)                           // Pedimos las posiciones del repartidor
            .then(driver => {
                driver.initialPosition = driverData.position;   // Sino unshift para ponerla al inicio del array de posiciones
                driver = new Driver(driver);                    // Mapeamos a una clase Driver
                tracker.addDriver(driver);                      // Agregamos el repartidor al trackeador
                drawDriverInList(driver);
            });
        });
        
    });

    var drawAddress = function (address) {
        flyOnCreate = false;    // Para no centrar la vista en el marker al crearlo
        drawer.drawAddressInMap(address, flyOnCreate);        
    }

    var drawDriverInList = function (driver) {
        drawer.drawDriverInList(driver, 'list-tab', 'nav-tabContent', tracker.startTracking());
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
        drawer.drawIncidentInMap(incident);
    }

    var drawIncidentTypes = function (incidentTypes) {
        drawer.drawTypesInList(incidentTypes, 'types');
    }

}

$(document).ready(function() {
    $(bootstrap);
});