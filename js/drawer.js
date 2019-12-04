var Drawer = function(map) {
    
    var driverLayers = {};      // Referencia a layers de los repartidores
    var addressesMarkers = {};  // Referencia a markers de origen y destino

    var focusDriverId = -1;     // Referencia al id del repartidor clickeado

    this.map = map;

    return {
        drawDriverInMap: drawDriverInMap,
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList,
        drawMarkerInMap: drawMarkerInMap,
        populateAddressesList: populateAddressesList,
        drawAddressInMap: drawAddressInMap,
        updateRemainingTime: updateRemainingTime,
        updateRequestStatus: updateRequestStatus,
        setView: setView,
        removeUnselectedDrivers: removeUnselectedDrivers,
        drawDriverInList: drawDriverInList,
        removeAllContent: removeAllContent
    }


    /******************************************************************************
     * Función para dibujar un repartidor en un mapa.
     */
    function drawDriverInMap (driver, callback) {
        console.log("Dibujando el repartidor: " + driver.id);

        info = driver.toString();
        coordinate = driver.initialPosition; // O positions[0]. Ver...
        options = Config.driverMarkerOptions(driver);

        marker = drawMarkerInMap(info, coordinate, options);

        //Creamos el layer en el mapa para ese repartidor
        var driverLayer = L.layerGroup().addTo(map);

        // Agregamos el layer al control
        map.layersControl.addOverlay(driverLayer, driver.name);

        driverLayer.addLayer(marker);

        driverLayers[`${driver.id}`] = driverLayer;

        
        return marker;
    }


    /******************************************************************************
     * Función para remover los markers de los repartidores no seleccionados.
     */
    function removeUnselectedDrivers(drivers) {
        for (var driverId in driverLayers) {
            map.removeLayer(driverLayers[driverId]); // Borro todos los markers por defecto
            for (var driver in drivers)
                if (driverId == driver)
                    driverLayers[driverId].addTo(map);
        }
    }
    

    /******************************************************************************
     * Función para dibujar un incidente en un mapa.
     */
    function drawIncidentInMap (incident) {
        console.log("Dibujando el incidente: " + incident.id);		
        
        info = incident.type.description + " - Delay: " + incident.type.delay + "min";
        coordinate = incident.coordinate;
        options = Config.incidentMarkerOptions(incident);

        return drawMarkerInMap(info, coordinate, options);
    }


    /******************************************************************************
     * Función para dibujar una dirección en un mapa.
     */
    function drawAddressInMap (address, flyOnCreate = true) {
        console.log("Dibujando la dirección: " + address.cod_calle);		
        
        info = address.addressType + '<br>' + address.direccion;
        coordinate = {'lat': address.coordenadas.y, 'lon': address.coordenadas.x};
        options = Config.addressMarkerOptions(address);

        console.log(coordinate);
        
        marker = drawMarkerInMap(info, coordinate, options, L.circleMarker);
        
        // Guardo la referencia al marker
        setAddressMarker(address.addressType, marker);

        if (flyOnCreate)    // Por default centramos la vista del mapa en el marker
            map.flyTo(marker._latlng);

        return marker;
    }


    /******************************************************************************
     * Función para referenciar al marker según el tipo de dirección
     */
    function setAddressMarker(addressType, marker) {
        if (addressesMarkers[addressType])
            map.removeLayer(addressesMarkers[addressType]);
        addressesMarkers[addressType] = marker;
    }

    
    /******************************************************************************
     * Función para dibujar una marker en un mapa.
     */
    function drawMarkerInMap (message, coordinate, options = {}, markerFunction = L.marker) {

        // Creamos un marker.
        marker = markerFunction(L.latLng(coordinate), options).bindPopup(message);

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
    function populateAddressesList (address, id) {
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
     * Función para desplegar los repartidores en lista junto con su información
     */
    var ListTab = null;     // Tuve que hacer esto para que ande lcdsm
    var TabContent = null;  // Tuve que hacer esto para que ande lcdsm
    var Callback = null;    // Tuve que hacer esto para que ande lcdsm
    function drawDriverInList(driver, listTab, tabContent, callback) {

        console.log(`Agregando repartidor ${driver.name} (${driver.id}) a la lista`);

        _listTab = $('#'+listTab);          // TODO: NO ME ESTÁ ENCONTRANDO EL ELEMENTO WTF?!
        _tabContent = $('#'+tabContent);    // TODO: NO ME ESTÁ ENCONTRANDO EL ELEMENTO WTF?!

        if (!ListTab)
            ListTab = _listTab;
        if (!TabContent)
            TabContent = _tabContent;
        if (!Callback)
            Callback = callback;
        
        listSchema = $(`<a class="list-group-item list-group-item-action" id="list-driver${driver.id}-list" data-toggle="list" href="#list-driver${driver.id}" role="tab" aria-controls="driver${driver.id}">${driver.name}</a>`);
        listSchema.click(function() {
            setView(driver.initialPosition, Config.driverZoom);
        });
        
        tabSchema = $(`<div class="tab-pane fade" id="list-driver${driver.id}" role="tabpanel" aria-labelledby="list-driver${driver.id}-list">${driver.toString()}</div>`);

        selectButton = $(`<button class="btn btn-success" value="${driver.id}">Elegir</button>`);
        selectButton.click(function() {

            focusDriverId = driver.id;

            selectedDrivers = {};
            selectedDrivers[focusDriverId] = driver;
            removeUnselectedDrivers(selectedDrivers);

            // callback(driver);
            Callback(driver);

            $('#Drivers').hide();
        });

        // _listTab.append(listSchema);
        // _tabContent.append(tabSchema);
        // tabSchema.append(selectButton);
        ListTab.append(listSchema);
        TabContent.append(tabSchema);
        tabSchema.append(selectButton);

    }

    function removeAllContent(elements) {
        elements.forEach(element => {
            $('#'+element).empty();
        });
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
        element = $('#RequestStatus');

        let status = Config.RequestStatus;

        switch (newStatus) {
            case status.EN_CURSO: element.css('color', 'yellow'); break;
            case status.ENTREGADO: element.css('color', 'greenyellow'); break;
        }

        element.html(newStatus);
    }

    function setView(coordinate, zoom) {
        map.flyTo(coordinate, zoom);
    }
}