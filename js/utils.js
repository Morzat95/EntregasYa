// Mapear pedidos
var mapearPedidos = function (requests) {
    return mapearObjetos(requests, 'id');
}

// Mapear direcciones
var mapearDirecciones = function (addresses) {
    return mapearObjetos(addresses, 'cod_calle');
}

function mapearObjetos(objects, key) {
    return objects.reduce(function(map, obj) {
        map[obj[key]] = obj;
        return map;
    }, {});
}

// Agregando formato para mostrar el tiempo restante
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return hours+':'+minutes+':'+seconds;
}