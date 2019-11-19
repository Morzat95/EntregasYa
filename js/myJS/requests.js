var requestAddress = function (address) {
    return $.ajax(urlNormalizador + address);
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

var responseExtract = function(attr, response) {
    console.log(response);
    return response[attr]
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

var resolverPosiciones = function (driver) {
    return requestPosiciones(driver.id)
            .then(function (response) {
                driver.positions = extractPosiciones(response);
                return driver;
            });
}

var resolverRepartidor = function (request) {
    return requestDrivers(request.availableDrivers[0].driver_id)
                .then(extractDriver)
                .then(driver => {
                    request.driver = driver;
                    delete request.availableDrivers;
                    return request;
                });
}