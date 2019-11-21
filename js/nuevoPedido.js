var bootstrap = function () {
    urlNormalizador = Config.urlNormalizador;
    urlEntregasYa = Config.urlEntregasYa;
    urlRepartidores = Config.urlRepartidores;
    urlPosiciones = Config.urlPosiciones;

// -- Mapa --

    map = createMap('map'); // Creamos el mapa

    var drawer = new Drawer(); // Componente que sabe dibujar en un mapa

// -- Direcciones --

// Nueva versión del normalizador =========================================================
    // Normalizamos las direcciones después de que el usuario deja de tipear en X cantidad de tiempo
    keyupHandlerNormalizar('Origen');
    keyupHandlerNormalizar('Destino');

    function keyupHandlerNormalizar(nodeId) {
        ms = 500;
        $('#'+nodeId).keyup(delay(function(e) {
            // console.log('Time elapsed!', this.value);
            normalizar(nodeId);
        }, ms));
    }

    // Función que me permite ejecutar una función pasada como parámetro después de X tiempo
    function delay(fn, ms) {
        let timer = 0;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(fn.bind(this, ...args), ms || 0);
        }
    }
// ========================================================================================

// Vieja versión del normalizador =========================================================
    // Normalizamos las direcciones cuando se hace click en los respectivos botones
    // clickHandlerNormalizar('Origen');
    // clickHandlerNormalizar('Destino');

    function clickHandlerNormalizar(nodeId) {
        $('#Btn'+nodeId).click(function(){
            normalizar(nodeId);
        });
    }

// ========================================================================================
    
    function normalizar(id) {
        address = document.getElementById(id).value; // Obtenemos la dirección ingresada por el usuario
        requestAddress(address) // Pedimos una dirección
        .then(response => checkAddress(response, id)) // Verificamos si hay que mostrar o no un mensaje de error
        .then(extractAddress) // Extraemos las posibles direcciones
        .then(address => populateAddressList(address, id)); // Mostramos las opciones al usuario
    }
    
    var checkAddress = function (response, id) {
        errorMessage = response['errorMessage'] ? response['errorMessage'] : '';
        document.getElementById('error-'+id).innerHTML = errorMessage;
        return response;
    }

    var populateAddressList = function (address, id) {
        console.log('Generando Listado de Direcciones...');

        list = $('#DirectionsList'+id);
        list.empty();

        address.forEach(direction => {
            option = document.createElement('option');
            option.value = option.textContent = direction.direccion;
            list.append(option);
        });
    }

    // Reemplazamos el input con la dirección seleccionada por el usuario
    autocompletarDireccion('DirectionsListOrigen', 'Origen');
    autocompletarDireccion('DirectionsListDestino', 'Destino');

    function autocompletarDireccion(input, node_id) {
        $("#"+input).change(function() {
            $("#"+node_id).val($(this).find(":selected").text());
        });
    }


// -- Repartidores --

    // Mostramos los repartidores cuando el usuario hace click en el respectivo botón
    $('#BtnRepartidores').click(function () {
        obtenerRepartidoresDisponibles();
    });

    function obtenerRepartidoresDisponibles() {

        requestDrivers() // Pedimos los reapratidores
        .then(extractDrivers) // Extraemos los reapartidores
        .then(function (drivers) {
            drivers.forEach(driver => { // Por cada repartidor...
                resolverPosiciones(driver) // Pedimos sus posiciones
                .then(driver => {
                    driver = new Driver(driver); // Lo mapeamos a nuestra clase
                    drawDriver(driver);  // Lo dibujamos (primera posición)
                });
            });
        });
        
        // No funciona como se espera
        // tracker = new Tracker(map);
        // requestDrivers()
        //     .then(extractDriver)
        //     .then(function (drivers) {
            //         drivers.forEach(driver => {
                //             resolverPosiciones(driver)
                //                 .then(function (driver) {
                    //                     driver = new Driver(driver);
                    //                     tracker.addDriver(driver);
                    //                     // tracker.start();
                    //                     console.log(`Driver ${driver.id} added.`);
                    
                    //                 })
                    //         });
                    //     })
                    //     .then(function() {
                        //         console.log('Fin.');
                        //         // console.log(tracker.driversData);
                        //         tracker.start();
                        //     });
    }

    
    var drawDriver = function (driver) {
        drawer.drawDriverInMap(driver, map);
    }

}

$(document).ready(function() {
    $(bootstrap);
});