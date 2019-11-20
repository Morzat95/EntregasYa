class Tracker {

    constructor (map, drawer) {
        this.map = map;
        this.drawer = drawer;
        this.drivers = {}
        this.selectedDriverId = -1;
    }

    addDriver (driver) {
        //Creamos el layer en el mapa para ese runner
        var driverLayer = L.layerGroup().addTo(this.map);
        // Agregamos el layer al control
        this.map.layersControl.addOverlay(driverLayer, driver.name);

        // Agregamos el marker del repartidor
        let marker = this.drawer.drawDriverInMap(driver, map);
        driverLayer.addLayer(marker);
      
        self = this;
        var updater = function (newPosition) {
            console.log("Updating view for driver: " + driver.name + "!!");
            console.log(newPosition);

            marker.setLatLng(newPosition);

            // Para seguir al conductor
            if (self.selectedDriverId == driver.id) {
                let zoom = 16;
                map.flyTo(newPosition, zoom);
            }
        }

        this.drivers[driver.id] = driver;

        // New
        driver.run(updater);

        console.log(`Driver ${driver.id} added.`);
    }

    getCurrentPosition(driver_id) {
        return this.drivers[driver_id].currentPosition();
    }

    followDriver(driver_id) {
        this.selectedDriverId = driver_id;
    }

    resetMapView() {
        this.selectedDriverId = -1;
    }
}