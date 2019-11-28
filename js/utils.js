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