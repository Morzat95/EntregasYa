
/******************************************************************************
 * Funciones para request asincrónico y sincrónico utilizando XMLHttpRequest
 */
var asyncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // https://stackoverflow.com/questions/13293617/why-is-my-ajax-function-calling-the-callback-multiple-times
        if (this.readyState === 4) {
            if (this.status === 200) {
                // parseamos el resultado para obtener el objeto JavaScript
                resObj = JSON.parse(xhttp.responseText)
                // llamamos a la función callback con el objeto parseado como parámetro.
                callback(resObj);
            }
        }
    };
    xhttp.open("GET", url, true);
    var ret = xhttp.send();
    return ret;
}

var syncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    // El browser (Chrome) dispara una excepción:
    // [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental
    // effects to the end user's experience.
    // For more help, check https://xhr.spec.whatwg.org/.
    xhttp.send();

    if (xhttp.status === 200) {
        resObj = JSON.parse(xhttp.responseText)
        return resObj;
    }
    return null;
}

/******************************************************************************
 * Inicio.
 */
var bootstrap = function() {
    var url = Config.url;
	var urlIncidents = '/incidents/';
	var urlTypes = '/incidenttypes/';
	
    var map = createMap('mapid');
    var drawer = new Drawer();

    // OPCIÓN 1: Request asincrónico. *****************************************
    // dibujar los incidentes de manera asincrónica
    
	// funcion para procesar los tipos	
	var callback = function(response) {
		//Lista de tipos de incidentes
		drawer.drawTypesInList(response.incidenttypes, 'types');
		
		//Ejemplo reduce con un diccionario de tipos
		var types = response.incidenttypes.reduce(function(dict, type) {
			dict[type.id] = type;			
			return dict;

		}, {});
		console.log(types);
		
		// funcion para procesar el incidente, cuando ya tenemos los tipos
        var callback2 = function(response) {
			
			drawIncidentInMap(drawer, response.incident, map, types[response.incident.type_id]);
        }
		
		//Pedimos el incidente 18, segundo pedido
		asyncQuery(url + urlIncidents + "18", callback2);
		//

    };
	
	//Empieza el pedido, primero los tipos
    asyncQuery(url + urlTypes, callback);
	
    // Esta opción deriva en el callbackhell
    // Referencias:
    // 1. http://callbackhell.com/
    // 2. https://stackoverflow.com/questions/25098066/what-the-hell-is-callback-hell-and-how-and-why-rx-solves-it
    // FIN OPCIÓN 1 ***********************************************************

	
    // OPCIÓN 2: Request sincrónico.  *****************************************
    // dibujar los incidentes de manera sincrónica
    var response1 = syncQuery(url + urlIncidents + "81", skip);
    if (response1) {
		var type_id = response1.incident.type_id;
		
		var response2 = syncQuery(url + urlTypes + type_id, skip);
		
		type = response2.incidenttype;		
		
		drawIncidentInMap(drawer, response1.incident, map, type);		
    }

    // FIN OPCIÓN 2 ***********************************************************

};

var skip = function(response) {
};

var drawIncidentInMap = function(drawer, incident, map, type){
	console.log(incident);

    incident.type = type;
    delete incident.type_id;

    console.log(incident);

	drawer.drawIncidentInMap(incident, map);
};

$(window).on("load", function () {
    console.log("Fetch data...");
    $(bootstrap);
});