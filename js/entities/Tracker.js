class Tracker {
    constructor (map) {
        this.map = map;
        this.driversData = [];

        this.test = 0;
    }

    addDriver (driver) {
        //Creamos el layer en el mapa para ese runner
        var driverLayer = L.layerGroup().addTo(this.map);
        // Agregamos el layer al control
        this.map.layersControl.addOverlay(driverLayer, driver.name);

        var updater = function (newPosition) {
            console.log("Updating view for driver: " + driver.name + "!!");
            console.log(newPosition);

            driverLayer.addLayer(L.marker(newPosition).bindPopup(driver.name));
        }

        this.driversData.push({
            driver: driver,
            updater: updater
        });
    }

    start () {
        if (this.test == 0) {
            this.test += 1;
            this.driversData.forEach(function(data) {
                var driver = data.driver;
                driver.run(data.updater);
            });
        }
    }
}

// var Tracker = function(map) {
//     this.map = map;
//     this.driversData = [];

//     this.addDriver = function(driver) {
//         //Creamos el layer en el mapa para ese runner
//         var driverLayer = L.layerGroup().addTo(this.map);
//         // Agregamos el layer al control
//         this.map.layersControl.addOverlay(driverLayer, driver.name);

//         var updater = function(newPosition) {
//             console.log("Updating view for driver: " + driver.name + "!!");
//             console.log(newPosition);

//             driverLayer.addLayer(L.marker(newPosition).bindPopup(driver.name));
//         }

//         this.driversData.push({
//             driver: driver,
//             updater: updater
//         })
//     }

//     this.start = function() {
//         this.driversData.forEach(function(data) {
//             var driver = data.driver;
//             driver.run(data.updater);
//         });
//     }
// };