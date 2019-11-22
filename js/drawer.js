var Drawer = function() {
    return {
        drawDriverInMap: drawDriverInMap,
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList,
        drawMarkerInMap: drawMarkerInMap,
        populateAddressList: populateAddressList,
        drawRequests: drawRequests
    }

    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap (driver, map, callback) {
        console.log("Dibujando el repartidor: " + driver.id);

        info = driver.toString();
        coordinate = driver.positions[0];
        icon = Config.getDriverIcon(driver.id);

        // return drawMarkerInMap(info, map, coordinate, icon);
        marker = drawMarkerInMap(info, map, coordinate, icon);

        if (callback)
            marker.on('click', callback(driver.id));

        return marker;
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
            option.value = option.textContent = direction.direccion;
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
}
