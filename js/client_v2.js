
var bootstrap = function() {
    var url = Config.url;
    var map = createMap('mapid');
	var urlIncidents = '/incidents/';
	var urlTypes = '/incidenttypes/';

    var drawer = new Drawer();

    // OPCIÓN 3: Promises. Request asincrónico evitando el callbackhell.   ****

    var requestIncident = function(incident_id) {
        return $.ajax(url + urlIncidents+ incident_id);
    }
    var requestType = function(type_id) {
        return $.ajax(url + urlTypes + type_id);
    }
    var responseExtract = function(attr, response) {
        console.log(response);
        return response[attr]
    }
    var extractIncident = function(response) {
        return responseExtract('incident', response);
    }
    var extractType = function(response) {
        return responseExtract('incidenttype', response);
    }
    var drawIncident = function(incident) {
		drawer.drawIncidentInMap(incident, map);
    }

    var resType = function(incident) {
        // pedimos el tipo con el type_id, y retornamos el incidente completo
        return requestType(incident.type_id)
               .then(function(response){
                    incident.type = extractType(response);
                    delete incident.type_id;
                    return incident;        
                });
    }
	
    // comenzamos la ejecución:
	requestIncident(19)			// pedimos el incidente al servidor
        .then(extractIncident)	// extraemos el incidente de la respuesta del servidor 	.then(resp =>{extractIncident(resp)})
        .then(resType)			// resolvemos el tipo de incidente		.then(incident => resType(incident))
        .then(drawIncident)		// dibujamos el incidente con su tipo 	.then(incident =>{console.log(incident);drawIncident})
        .done(function() {
            console.log("Fin.");
        });

    // FIN OPCIÓN 3 ***********************************************************
};

$(bootstrap);