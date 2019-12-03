class Tracker {

    constructor (map, drawer) {
        this.map = map;
        this.drawer = drawer;
        this.drivers = {}
        this.selectedDriverId = -1;
        this.driversData = {};
        this.isTracking = false;
    }

    addDriver (driver) {
        //Creamos el layer en el mapa para ese runner
        var driverLayer = L.layerGroup().addTo(this.map);
        // Agregamos el layer al control
        this.map.layersControl.addOverlay(driverLayer, driver.name);

        // Agregamos el marker del repartidor
        let marker = this.drawer.drawDriverInMap(driver, map, this.startTracking());
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

            drawer.updateRemainingTime(self.calculateRemainingTime(driver));
        }

        this.drivers[driver.id] = driver; // Nos guardamos el repartidor. Igual creo que al final no lo usamos... :D

        // New
        // driver.run(updater); // Sino puedo hacer que corra después cuando el usuario selecciona el conductor mejor.

        // this.driversData.push({ // nuevo versión 2.0
        //     driver: driver,
        //     updater: updater
        // });

        this.driversData[driver.id] = updater; // nuevo versión 2.0

        console.log(`Driver ${driver.id} added.`);
    }

    // Para obtener la posición actual del repartidor... Ya no lo usamos pero lo dejo por si me equivoco y se rompe todo :D
    getCurrentPosition(driver_id) {
        return this.drivers[driver_id].currentPosition();
    }

    // Para seguir al repartidor con el mapa
    followDriver(driver_id) {
        this.selectedDriverId = driver_id;
    }

    // Para dejar de seguir al repartidor con el mapa
    resetMapView() {
        this.selectedDriverId = -1;
    }

    // Callback para empezar a trackear a un repartidor
    startTracking () {
        self = this;
        return function (driver) {
            self.selectedDriverId = driver.id;
            if (!self.isTracking) {
                self.isTracking = !self.isTracking;
                driver.run(self.getUpdater(driver.id));
                self.followDriver(driver.id);
            }
        }
    }

    // Devuelve la función del repartidor que actualiza su posición
    getUpdater(driver_id) {
        return this.driversData[driver_id];
    }

    calculateRemainingTime(driver) {
        return driver.positions.length - driver.currentIdx;
    }
}