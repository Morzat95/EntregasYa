var requestAddress = function (address) {
    return $.ajax(urlNormalizador + address + '&geocodificar=TRUE'); // Quiero siempre las coordenadas
}

function requestDrivers(driver_id) {
    driver_id = driver_id ? driver_id : '';
    return $.ajax(urlEntregasYa + urlRepartidores + driver_id);
}

var requestPosiciones = function (driver_id) {
    return $.ajax(urlEntregasYa + urlRepartidores + driver_id + urlPosiciones);
}

var requestPedidos = function (request_id) {
    request_id = request_id ? request_id : '';
    return $.ajax(urlEntregasYa + urlRequests + request_id);
}

var requestIncidents = function (incident_id) {
    incident_id = incident_id ? incident_id : '';
    return $.ajax(urlEntregasYa + urlIncidents + incident_id);
}

var requestIncidentsTypes = function (type_id) {
    type_id = type_id ? type_id : '';
    return $.ajax(urlEntregasYa + urlIncidentsTypes + type_id);
}

var responseExtract = function(attr, response) {
    // console.log(response);
    return response[attr];
}

var extractAddress = function (response) {
    return responseExtract('direccionesNormalizadas', response);
}

var extractDrivers = function (response) {
    return responseExtract('drivers', response);
}

var extractDriver = function (response) {
    return responseExtract('driver', response);
}

var extractPosiciones = function (response) {
    return responseExtract('positions', response);
}

var extractPedidos = function (response) {
    return responseExtract('requests', response);
}

var extractPedido = function (response) {
    return responseExtract('request', response);
}

var extractIncidents = function (response) {
    return responseExtract('incidents', response);
}

var extractIncidentType = function (response) {
    return responseExtract('incidenttype', response);
}

var extractIncidentTypes = function (response) {
    return responseExtract('incidenttypes', response);
}

var resolverPosiciones = function (driver) {
    return requestPosiciones(driver.id)
            .then(function (response) {
                driver.positions = extractPosiciones(response);
                return driver;
            });
}

// var resolverRepartidor = function (request) {
//     return requestDrivers(request.availableDrivers[0].driver_id)
//                 .then(extractDriver)
//                 .then(driver => {
//                     request.driver = driver;
//                     delete request.availableDrivers;
//                     return request;
//                 });
// }

// var resolverRepartidor = function (request, driver_id) {
//     return requestDrivers(driver_id)
//                 .then(extractDriver)
//                 .then(driver => {
//                     request.driver = driver;
//                     delete request.availableDrivers;
//                     return request;
//                 });
// }

var resolverRepartidores = function (request) {
    
    availableDrivers = request.availableDrivers;

    request.availableDrivers = [];

    availableDrivers.forEach(driverData => {
        requestDrivers(driverData.driver_id)
            .then(extractDriver)
            .then(driver => {
                // driverData = driver;
                driver.initialPosition = driverData.position;
                request.availableDrivers.push(driver);
            });
        return request;
    });

    // return request;
}

var resolverRepartidor = function (request, driver_id) {
    return requestDrivers(driver_id)
        .then(extractDriver)
        .then(driver => {
            request.availableDrivers.push(driver);
            return driver;
        });
}

var resolveIncidentType = function (incident) {
    return requestIncidentsTypes(incident.type_id)
                .then(extractIncidentType)
                .then(type => {
                    incident.type = type;
                    delete incident.type_id;
                    return incident;
                });
}