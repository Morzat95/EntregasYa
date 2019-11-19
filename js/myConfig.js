urlNormalizador = 'https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=';
urlEntregasYa = 'https://entregasya.herokuapp.com/api';
urlRepartidores = '/deliverydrivers/';
urlPosiciones = '/positions/';
urlRequests = '/requests/';
urlIncidents = '/incidents/';
urlIncidentsTypes = '/incidenttypes/';
scoreIcon = '★';

var Config = {
    urlNormalizador: urlNormalizador,
    urlEntregasYa: urlEntregasYa,
    urlRepartidores: urlRepartidores,
    urlPosiciones: urlPosiciones,
    urlRequests: urlRequests,
    urlIncidents: urlIncidents,
    urlIncidentsTypes: urlIncidentsTypes,
    scoreIcon: scoreIcon,


    // Iconos por tipo de incidencia
    getIncidentIcon: function(incident){
        if( incident.type.description == "accident" ) {
            return L.icon({iconUrl: 'assets/images/accidente.png', iconSize: [35, 35]});
        }
        else if ( incident.type.description == "congestion" ) {
            return L.icon({iconUrl: 'assets/images/congestion.png', iconSize: [35, 35]});
        }
        else if( incident.type.description == "massive protest" ) {
            return L.icon({iconUrl: 'assets/images/manifestacion.png', iconSize: [35, 35]});
        }
    }
}