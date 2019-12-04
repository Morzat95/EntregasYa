var bootstrap = function() {
    urlNormalizador = Config.urlNormalizador;
    urlEntregasYa = Config.urlEntregasYa;
    urlRepartidores = Config.urlRepartidores;
    urlPosiciones = Config.urlPosiciones;

    originAddress = null;
    destinationAddress = null;


// -- Mapa --
    map = createMap('map', Config.ungsLocation);    // Creamos el mapa

    var drawer = new Drawer(map);                      // Componente que sabe dibujar en un mapa

    // TODO: Generar los elementos HTML con los enums de la configuración
    
    // -- Direcciones --
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
    
    // TODO: cambiar address por addresses donde corresponda
    function normalizar(id) {
        address = document.getElementById(id).value;        // Obtenemos la dirección ingresada por el usuario

        requestAddress(address)                             // Pedimos una dirección
            .then(response => checkAddress(response, id))   // Verificamos si hay que mostrar o no un mensaje de error
            .then(extractAddress)                           // Extraemos las posibles direcciones
            .then(addresses => {
                _addresses = mapearDirecciones(addresses);    // Mapeamos las direcciones para usarlas posteriormente
                populateAddresses(addresses, id);             // Mostramos las opciones al usuario
            });
    }

    var checkAddress = function(response, id) {
        errorMessage = response['errorMessage'] || '';    // cambiar '' por undefined
        document.getElementById('error-' + id).innerHTML = errorMessage;

        // Le agregamos animación y color para que quede más lindo :D
        existError = errorMessage != '';

        inputField = document.getElementById(id);
        inputField.classList.toggle("is-valid", !existError);   // Si no existe el error lo coloreamos como válido
        inputField.classList.toggle("is-invalid", existError);  // Si existe el error lo coloreamos como inválido

        return response;
    }

    var populateAddresses = function(address, id) {
        drawer.populateAddressesList(address, 'DirectionsList' + id);
    }

    // Reemplazamos el input con la dirección seleccionada por el usuario y escondemos el resto
    autocompletarDireccionOrigen();
    autocompletarDireccionDestino();

    function autocompletarDireccionOrigen() {
        let addressType = Config.AddressType.ORIGEN; // No me gusta esto acá
        autocompletarDireccion('DirectionsListOrigen', 'Origen', addressType);
    }
    
    function autocompletarDireccionDestino() {
        let addressType = Config.AddressType.DESTINO;
        autocompletarDireccion('DirectionsListDestino', 'Destino', addressType);
    }

    function autocompletarDireccion(input, node_id, addressType) {
        $("#" + input).click(function() {

            selectedOption = $(this).find(":selected");

            $("#" + node_id).val(selectedOption.text());
            $(this).hide("slow");

            // Dibujamos la dirección en el mapa
            cod_calle = selectedOption.val();
            direccionSeleccionada = _addresses[cod_calle];
            direccionSeleccionada.addressType = addressType;
            drawer.drawAddressInMap(direccionSeleccionada);
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


// -- Submit --
    $("#form").submit(function(event) {

        origenValido = $("#Origen").hasClass("is-valid");
        destinoValido = $("#Destino").hasClass("is-valid");

        if (!origenValido || !destinoValido) {
            event.preventDefault();
            
            invalidAddress = !origenValido ? 'Origen' : 'Destino';

            alert('Dirección de ' + invalidAddress + ' inválida');
        }

    });

}

$(document).ready(function() {
    $(bootstrap);
});