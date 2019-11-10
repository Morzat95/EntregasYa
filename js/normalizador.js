



var url_n = "http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=";



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


function normalizar(id) {
    var direccion = document.getElementById(id).value;

    

    var callback = function(response) {
    
        response.direccionesNormalizadas.forEach(function(type){
            window.alert(type.cod_calle);
        });


        
        var types = response.direccionesNormalizadas.reduce(function(dict, type) {
			dict[type.id] = type;			
			return dict;

		}, {});
		console.log(types.value);
    }

    asyncQuery(url_n + direccion, callback);
}
