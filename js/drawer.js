var Drawer = function() {
    return {
        drawDriverInMap: drawDriverInMap,
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList,
        drawMarkerInMap: drawMarkerInMap
    }

    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap(driver, map) {
        console.log("Dibujando el repartidor: " + driver.id);

        info = driver.toString();
        coordinate = driver.positions[0];
        icon = Config.getDriverIcon(driver.id);

        return drawMarkerInMap(info, map, coordinate, icon);
    }
    
    /******************************************************************************
     * Función para dibujar un incidente en un mapa.
     */
    function drawIncidentInMap(incident, map) {
        console.log("Dibujando el incidente: " + incident.id);		
        
        info = incident.type.description + " - Delay: " + incident.type.delay + "min";
        coordinate = incident.coordinate;
        icon = Config.getIncidentIcon(incident);

        return drawMarkerInMap(info, map, coordinate, icon);
    }
    
    /******************************************************************************
     * Función para dibujar una marker en un mapa.
     */
    function drawMarkerInMap(message, map, coordinate, icon) {

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
    function drawTypesInList(types, nodeId) {
		types.forEach(function(type) {
            var li = $('<li>');
            li.append(type.description + " (" + type.delay +")");
            $("#"+nodeId).append(li);
        });
    }
}
