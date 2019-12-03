var bootstrap = function() {
    urlNormalizador = Config.urlNormalizador;
    urlEntregasYa = Config.urlEntregasYa;
    urlRepartidores = Config.urlRepartidores;
    urlPosiciones = Config.urlPosiciones;

    originAddress = null;
    destinationAddress = null;

    // -- Mapa --

    map = createMap('map', Config.ungsLocation); // Creamos el mapa

    var drawer = new Drawer(); // Componente que sabe dibujar en un mapa

    // -- Direcciones --

    // Nueva versión del normalizador =========================================================
    // Normalizamos las direcciones después de que el usuario deja de tipear en X cantidad de tiempo
    keyupHandlerNormalizar('Origen');
    keyupHandlerNormalizar('Destino');

    function keyupHandlerNormalizar(nodeId) {
        ms = 500;
        $('#' + nodeId).keyup(delay(function(e) {
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

    function normalizar(id) {
        address = document.getElementById(id).value; // Obtenemos la dirección ingresada por el usuario

        requestAddress(address) // Pedimos una dirección
            .then(response => checkAddress(response, id)) // Verificamos si hay que mostrar o no un mensaje de error
            .then(extractAddress) // Extraemos las posibles direcciones
            .then(address => {
                addresses = mapearDirecciones(address); // Mapeamos las direcciones para usarlas posteriormente
                populateAddress(address, id); // Mostramos las opciones al usuario
            });
    }

    var checkAddress = function(response, id) {
        errorMessage = response['errorMessage'] ? response['errorMessage'] : ''; // cambiar '' por undefined
        document.getElementById('error-' + id).innerHTML = errorMessage;

        // Le agregamos animación y color para que quede más lindo :D
        existError = errorMessage != '';

        inputField = document.getElementById(id);
        inputField.classList.toggle("is-valid", !existError); // Si no existe el error lo coloreamos como válido
        inputField.classList.toggle("is-invalid", existError); // Si existe el error lo coloreamos como inválido

        return response;
    }

    // Reemplazamos el input con la dirección seleccionada por el usuario y escondemos el resto
    autocompletarDireccionOrigen();
    autocompletarDireccionDestino();

    function autocompletarDireccionOrigen() {
        autocompletarDireccion('DirectionsListOrigen', 'Origen', 'Origen');
    }

    function autocompletarDireccionDestino() {
        autocompletarDireccion('DirectionsListDestino', 'Destino', 'Destino');
    }

    function autocompletarDireccion(input, node_id, addressType) {
        $("#" + input).click(function() {
            $("#" + node_id).val($(this).find(":selected").text());
            $(this).hide("slow");

            // Dibujamos la dirección en el mapa
            cod_calle = $(this).find(":selected").val();
            direccionSeleccionada = addresses[cod_calle];
            direccionSeleccionada.addressType = addressType;
            drawer.drawAddressInMap(direccionSeleccionada, map);
        });
    }

    // -- Calculo de peso volumetrico --
    
    $('#alto, #ancho, #largo').bind("change keyup", calcularPesoVolumétrico);
    
    // Mostrar info sobre Peso Volumétrico
    $('#PVInfo').hover(function() {
        var popup = document.getElementById("PVPopup");
        popup.classList.toggle("show");
    });

    function calcularPesoVolumétrico () {
        console.log('Calculando Peso Volumétrico');

        alto = $('#alto').val();    // mts
        ancho = $('#ancho').val();  // mts
        largo = $('#largo').val();  // mts

        if (alto != '' && ancho != '' && largo != '') {
            calculo = (largo * ancho * alto) * 200; // Podría ponerse como una variable de configuración...
            $("#PesoVolumétrico").text(Math.ceil(calculo) + 'Kg');
        }
    }

    // -- Repartidores --

    // Mostramos los repartidores cuando el usuario hace click en el respectivo botón
    $('#BtnRepartidores').click(function() {
        obtenerRepartidoresDisponibles();
    });

    function obtenerRepartidoresDisponibles() {

        requestDrivers() // Pedimos los reapratidores
            .then(extractDrivers) // Extraemos los reapartidores
            .then(function(drivers) {
                drivers.forEach(driver => { // Por cada repartidor...
                    resolverPosiciones(driver) // Pedimos sus posiciones
                        .then(driver => {
                            driver = new Driver(driver); // Lo mapeamos a nuestra clase
                            drawDriver(driver); // Lo dibujamos (primera posición)
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

    var populateAddress = function(address, id) {
        drawer.populateAddressList(address, 'DirectionsList' + id);
    }

    var drawDriver = function(driver) {
        // drawer.drawDriverInMap(driver, map);
        drawer.drawDriverInMap(driver, map, informarRepartidorSeleccionado);
    }

    function informarRepartidorSeleccionado(driverId) {
        return function(e) {
            alert(`Repartidor ${driverId} seleccionado`);
        }
    }

    
    $("#form").submit(function(event) {

        origenValido = $("#Origen").hasClass("is-valid");
        destinoValido = $("#Destino").hasClass("is-valid");

        if (!origenValido || !destinoValido) {
            event.preventDefault();
        }
            // window.location = 'mis-pedidos.html?' + $('#TipoPaquete').children("option:selected").val();

        // event.preventDefault(); // Si saco esto, el action del form va. Ver los parámetros que le paso. https://www.w3schools.com/jsref/event_preventdefault.asp https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
    });

}

$(document).ready(function() {
    $(bootstrap);
});