var requestAddress = function (address, geocodificar = 'TRUE') {
    return $.ajax(urlNormalizador + 'direccion=' + address + '&geocodificar=' + geocodificar);    // Por default quiero las coordenadas
}

var requestAddressLatLng = function (coordinate, tipoResultado = 'calle_altura') {
    lat = coordinate.lat;
    lng = coordinate.lon;
    // return $.ajax(urlNormalizadorBase + 'lng=' + lng + '&lat=' + lat + '&TipoResultado=' + tipoResultado);
    return $.ajax(urlNormalizador + 'lng=' + lng + '&lat=' + lat + '&TipoResultado=' + tipoResultado);
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

var resolverDireccion = function (request, addressSource, addressType) {    // Podría mapear la dirección a un objeto y ser al objeto al que le digo setAddressType(type)
    return requestAddressLatLng(request[addressSource])                     // De esta forma puedo usar 'setAddressType' en nuevoPedido.js también... Ver.
        .then(address => {
            address.addressType = addressType;
            request[addressSource] = address;
            return request;
        });
}

var resolverOrigen = function (request) {
    addressType = Config.AddressType.ORIGEN;
    return resolverDireccion(request, 'sender', addressType);
}
var resolverDestino = function (request) {
    addressType = Config.AddressType.DESTINO;
    return resolverDireccion(request, 'receiver', addressType);
}