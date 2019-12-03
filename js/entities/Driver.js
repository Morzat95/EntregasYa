class Driver {

    currentIdx = 0;

    constructor (data) {
        Object.assign(this, data);
    }

    run (callback) {
        var self = this;
        setTimeout(function() {
            callback(self.positions[self.currentIdx]);

            self.currentIdx += 1;
            if(self.currentIdx < self.positions.length) {
                self.run(callback);
            }
        }, Config.driverUpdateFrequency);
    }

    currentPosition () {
        return this.positions[this.currentIdx];
    }

}

// Sobreescribimos el método toString
Driver.prototype.toString = function driverToString() {
    return `ID: ${this.id}<br>
            Nombre: ${this.name}<br>
            Score: ${scoreIcon.repeat(this.score)}<br>
            Vehículo<br>
            * Modelo: ${this.car.description}<br>
            * Patente: ${this.car.plateNumber}<br>
            * Color: ${this.car.color}<br>
            * Año: ${this.car.year}`;
}