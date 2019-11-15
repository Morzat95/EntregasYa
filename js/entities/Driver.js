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

}

// // Testeando
// // var data = JSON.parse({"name": "Pepe", "surname": "Argento", "Age": 45, "positions": [{"lat": 1, "lon": 2}, {"lat": 2, "lon": 3}, {"lat": 3, "lon": 4}]});

// var data = {"name": "Pepe", "surname": "Argento", "Age": 45, "positions": [{"lat": 1, "lon": 2}, {"lat": 2, "lon": 3}, {"lat": 3, "lon": 4}]};
// // var data = [{"lat": 1, "lon": 2}, {"lat": 2, "lon": 3}, {"lat": 3, "lon": 4}];
// driver = new Driver(data);

// console.log(driver);

// var Driver = function(data) {
//     this.name = data.name;
//     this.positions = data.positions;

//     var currentIdx = 0;

//     this.run = function(callback) {
//         var self = this;
//         setTimeout(function() {
//             callback(positions[currentIdx]);

//             currentIdx += 1;
//             if(currentIdx < positions.length) {
//                 self.run(callback);
//             }
//         }, 1000);
//     }
// };