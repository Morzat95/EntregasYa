var Drawer = function() {
    return {
        drawDriverInMap: drawDriverInMap,
        drawTypesInList: drawTypesInList
    }

    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap(driver, map) {
        console.log("Dibujando el repartidor: " + driver.id);

		var info = driver.name;
		// Creamos un marker.
		var p = L.marker(L.latLng(driver.positions[0].lat, driver.positions[0].lon))
			.bindPopup(info);

		p.addTo(map);
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
