var Drawer = function() { // TODO: ver si le paso el mapa...
    
    var driverMarkers = {};
    var originMarker;
    var destinationMarker;

    var selectedDriver = -1;    // TODO: El nombre debería ser algo como 'focusDriverId'
    
    return {
        drawDriverInMap: drawDriverInMap,
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList,
        drawMarkerInMap: drawMarkerInMap,
        populateAddressList: populateAddressList,
        drawAddressInMap: drawAddressInMap,
        updateRemainingTime: updateRemainingTime,
        updateRequestStatus: updateRequestStatus
    }


    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap (driver, map, callback) {
        console.log("Dibujando el repartidor: " + driver.id);

        info = driver.toString();
        coordinate = driver.initialPosition; // O positions[0]. Ver...
        icon = Config.getDriverIcon(driver.id);

        marker = drawMarkerInMap(info, map, coordinate, icon);
        
        marker.on('click', function(e) {
            selectedDriver = driver.id;
            removeUnselectedDrivers(); // esto ejecutarlo después en misPedidos.js mejor cuando el usuario toque un botón o algo así

            callback(driver);
        });

        driverMarkers[`${driver.id}`] = marker;
        

        return marker;
    }


    /******************************************************************************
     * Función para remover los markers de los repartidores no seleccionados.
     */
    function removeUnselectedDrivers() { // TODO: los layerControl todavía quedan disponibles. Borrarlos.

        for (var driverId in driverMarkers)
            if (driverId != selectedDriver)
                map.removeLayer(driverMarkers[driverId]);

        selectedMarker = driverMarkers[selectedDriver];
        driverMarkers = {};
        driverMarkers[selectedDriver] = selectedMarker;

    }
    

    /******************************************************************************
     * Función para dibujar un incidente en un mapa.
     */
    function drawIncidentInMap (incident, map) {
        console.log("Dibujando el incidente: " + incident.id);		
        
        info = incident.type.description + " - Delay: " + incident.type.delay + "min";
        coordinate = incident.coordinate;
        icon = Config.getIncidentIcon(incident);

        return drawMarkerInMap(info, map, coordinate, icon);
    }


    /******************************************************************************
     * Función para dibujar una dirección en un mapa.
     */
    function drawAddressInMap (address, map) {
        console.log("Dibujando la dirección: " + address.cod_calle);		
        
        info = address.direccion;
        coordinate = {'lat': address.coordenadas.y, 'lon': address.coordenadas.x};
        console.log(coordinate);
        
        marker = drawMarkerInMap(info, map, coordinate);
        
        // Guardo la referencia al marker
        if (address.addressType == 'Origen') {
            
            if (originMarker)
                map.removeLayer(originMarker);
            
            originMarker = marker
            // icon = Config.getOriginIcon(address); TODO
        }
        else if (address.addressType == 'Destino') {
            
            if (destinationMarker)
                map.removeLayer(destinationMarker);
            
            destinationMarker = marker;
            // icon = Config.getDestinationIcon(address); TODO
        }

        map.flyTo(marker._latlng);

        return marker;
    }

    
    /******************************************************************************
     * Función para dibujar una marker en un mapa.
     */
    function drawMarkerInMap (message, map, coordinate, icon) {

        // Creamos un marker.
        marker = L.marker(L.latLng(coordinate)).bindPopup(message);

        if (icon)
            marker.setIcon(icon)

        // Esto solo funcionaría en desktop... Pero lo dejamos igual porque es más cómodo para testear :)
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });

        marker.addTo(map);

        return marker;
    }
    

    /******************************************************************************
     * Función para listar los tipos de incidente en la página.
     */
    function drawTypesInList (types, nodeId) {
		types.forEach(function(type) {
            var li = $('<li>');
            li.append(type.description + " (" + type.delay +")");
            $("#"+nodeId).append(li);
        });
    }


    /******************************************************************************
     * Función para mostrar las opciones para la dirección normalizada en la página.
     */
    function populateAddressList (address, id) {
        console.log('Generando Listado de Direcciones...');

        list = $('#'+id);
        list.empty();

        // Si no hay resultados ocultamos el select
        if (address.length <= 0) {
            list.hide("slow");
            return;
        }

        address.forEach(direction => {
            option = document.createElement('option');
            option.value = direction.cod_calle;
            option.textContent = direction.direccion;
            list.append(option);
        });

        // Desplegamos toda la lista
        list.attr('size', address.length);
        list.show("slow");
    }


    /******************************************************************************
     * Función para mostrar el tiempo restante para que el pedido llegue a su destino.
     */
    function updateRemainingTime(remainingTime) {
        $('#TiempoRestante').html(remainingTime.toString().toHHMMSS());
    }


    /******************************************************************************
     * Función para mostrar el estado actual del pedido
     */
    function updateRequestStatus(newStatus) {
        // $('#RequestStatus').html(newStatus);

        element = $('#RequestStatus');

        switch (newStatus) { // TODO: enums
            case 'EN CURSO': element.css('color', 'yellow'); break;
            case 'ENTREGADO': element.css('color', 'greenyellow'); break;
        }

        element.html(newStatus);
    }
}