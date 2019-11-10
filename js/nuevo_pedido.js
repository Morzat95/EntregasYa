var url = "https://entregasya.herokuapp.com/api";

var urlPedidos = '/requests/';

var urlIncidents = '/incidents/';
var urlTypes = '/incidenttypes/';

/** ---------Llamado asincrono----------- * */
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
/*******************************************/

/** Crear la lista en el HTML**/
var Crear = function() {
    return {
        drawTypesInList: drawTypesInList
    }
    function drawTypesInList(types, nodeId) {        
        types.forEach(function(types) {
            var li = $('<li>');
            li.append(types.id + " (" + types.id +")");
            $("#"+nodeId).append(li);
        });
    }
}

function generarLista(id){
    /* Crear div para mostrar listado*/
    if(document.getElementById){
        var bloque = document.getElementById(id);
        bloque.style.display = (bloque.style.display == 'none') ? 'block' : 'none';
    }

    var crear = new Crear();

    var callback = function(response) {
        $("#types").empty();

        crear.drawTypesInList(response.requests, 'types');

        var types = response.requests.reduce(function(dict, type) {
			dict[type.id] = type;			
			return dict;
		}, {});
		console.log(types);
    }
    asyncQuery(url + urlTypes, callback);
}


/** 
function muestra_oculta(id){
    if(document.getElementById){
        var el = document.getElementById(id);
        el.style.display = (el.style.display == 'none') ? 'block' : 'none';
    }
}
**/

window.onload = function(){
    this.generarLista('listado-repartidores')
}