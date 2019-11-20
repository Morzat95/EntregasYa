class Tracker {
    
    constructor (map) {
        this.map = map;
    }

    addDriver (driver) {
        //Creamos el layer en el mapa para ese runner
        var driverLayer = L.layerGroup().addTo(this.map);
        // Agregamos el layer al control
        this.map.layersControl.addOverlay(driverLayer, driver.name);

        // Agregamos el marker del repartidor
        let marker = L.marker(driver.positions[0],{icon: Config.getDriverIcon(driver.id)});
        driverLayer.addLayer(marker.bindPopup(driver.name));
      
        var updater = function (newPosition) {
            console.log("Updating view for driver: " + driver.name + "!!");
            console.log(newPosition);

            marker.setLatLng(newPosition);
        }

        // New
        driver.run(updater);

        console.log(`Driver ${driver.id} added.`);
    }
}