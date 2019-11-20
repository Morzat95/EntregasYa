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
        }, 1000);
    }

    currentPosition () {
        return this.positions[this.currentIdx];
    }

}