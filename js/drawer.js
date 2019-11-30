var Drawer = function() {
    
    var markers = {};
    var originMarker;
    var destinationMarker;

    var selectedDriver = -1;
    
    return {
        drawDriverInMap: drawDriverInMap,
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList,
        drawMarkerInMap: drawMarkerInMap,
        populateAddressList: populateAddressList,
        drawRequests: drawRequests,
        drawAddressInMap: drawAddressInMap
    }

    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap (driver, map, callback) {
        console.log("Dibujando el repartidor: " + driver.id);

        info = driver.toString();
        // coordinate = driver.positions[0];
        coordinate = driver.initialPosition;
        icon = Config.getDriverIcon(driver.id);

        // return drawMarkerInMap(info, map, coordinate, icon);
        marker = drawMarkerInMap(info, map, coordinate, icon);

        // if (callback)
        //     marker.on('click', cleanDrivers(driver.id, callback(driver.id)));
        
        marker.on('click', function(e) {
            selectedDriver = driver.id;
            removeUnselectedDrivers(); // esto ejecutarlo después en misPedidos.js mejor cuando el usuario toque un botón o algo así

            console.log('callback drawer');
            callback(driver);
        });

        // markers.push({key: driver.id, value: marker});
        markers[`${driver.id}`] = marker;
        

        return marker;
    }

    function cleanDrivers(driverSelected, callback) {

        return function (e) {
            for (var driverId in markers) {
                if (driverId != driverSelected)
                    map.removeLayer(markers[driverId]);
            }
    
            // callback;
        }

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
     * Función para listar los pedidos en la página.
     */
    function drawRequests (requests, nodeId) {
        console.log('Dibujando requests en select');
        father = $('#'+nodeId); // Select

        // Creamos la opción y la asignamos al select
        requests.forEach(request => {
            option = $('<option/>');
            option.attr({ 'value': request.id }).text(`Pedido: ${request.id}`);

            father.append(option);
        });

        // Necesario para desplegar todas las opciones
        father.attr('size', requests.length);
    }

    function removeUnselectedDrivers() {

        for (var driverId in markers)
            if (driverId != selectedDriver)
                map.removeLayer(markers[driverId]);

        selectedMarker = markers[selectedDriver];
        markers = {};
        markers[selectedDriver] = selectedMarker;

    }
}
