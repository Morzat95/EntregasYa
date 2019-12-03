class Tracker {

    constructor (map, drawer) {
        this.map = map;
        this.drawer = drawer;
        this.drivers = {}           // Para mapear los repartidores (no lo usamos al final)
        this.selectedDriverId = -1; // Para centrar la vista del mapa en el repartidor
        this.driversData = {};      // Para mapear la id de los repartidores con sus respectivos 'updaters'
        this.isTracking = false;    // Para saber si está trackeando a un repartidor y no volver a llamar a 'updater'
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

            let remainingTime = self.calculateRemainingTime(driver);
            drawer.updateRemainingTime(remainingTime);

            if (self.requestDelivered(remainingTime))
                drawer.updateRequestStatus('ENTREGADO');
            else
                drawer.updateRequestStatus('EN CURSO'); // No me gusta que siempre se llame con lo mismo. Sacarlo del updater de alguna forma. tal vez onclick marker en drawer.js
        }

        this.drivers[driver.id] = driver;       // Nos guardamos el repartidor. Igual creo que al final no lo usamos... :D

        this.driversData[driver.id] = updater;  // Guardamos una referencia al 'updater' del repartidor

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
            self.followDriver(driver.id);
            if (!self.isTracking) { // Para evitar que se vuelva a llamar a 'updater' cuando ya está corriendo
                self.isTracking = !self.isTracking;
                driver.run(self.getUpdater(driver.id));                
            }
        }
    }

    // Devuelve la función del repartidor que actualiza su posición
    getUpdater(driver_id) {
        return this.driversData[driver_id];
    }

    calculateRemainingTime(driver) {
        return driver.positions.length - (driver.currentIdx + 1);   // Le sumo 1 para corregir el desfasaje por la falta de llamada cuando el índice es igual al largo del arreglo
    }

    requestDelivered(remainingTime) {
        return remainingTime == 0;
    }
}