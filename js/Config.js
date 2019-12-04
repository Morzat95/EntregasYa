urlNormalizador = 'https://servicios.usig.buenosaires.gob.ar/normalizar/?';
urlEntregasYa = 'https://entregasya.herokuapp.com/api';
urlRepartidores = '/deliverydrivers/';
urlPosiciones = '/positions/';
urlRequests = '/requests/';
urlIncidents = '/incidents/';
urlIncidentsTypes = '/incidenttypes/';
scoreIcon = '★';
ungsLocation = [-34.5221554, -58.7000067];  // Ubicación geográfica de la UNGS
driverUpdateFrequency = 1000;               // Frecuencia a la que se actualiza la posición del repartidor
driverZoom = 16;

addressMarkerOptions = function (address) {
  return {
    radius: 10,
    fillColor: address.addressType == AddressType.ORIGEN ? 'green' : 'red',
    color: "#DDD",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  };
};

incidentMarkerOptions = function (incident) {
  return {
    icon: this.getIncidentIcon(incident)
  };
}

driverMarkerOptions = function (driver) {
  return {
    icon: this.getDriverIcon(driver.id)
  };
}

const RequestStatus = {
  ENTREGADO: 'ENTREGADO',
  EN_CURSO: 'EN CURSO',
  EN_ESPERA: 'EN ESPERA',
  CANCELADO: 'CANCELADO',
  A_REASIGNAR: 'A REASIGNAR',
  PROGRAMADO: 'PROGRAMADO'
}

const AddressType = {
  ORIGEN: 'ORIGEN',
  DESTINO: 'DESTINO'
}

var Config = {
    urlNormalizador: urlNormalizador,
    urlEntregasYa: urlEntregasYa,
    urlRepartidores: urlRepartidores,
    urlPosiciones: urlPosiciones,
    urlRequests: urlRequests,
    urlIncidents: urlIncidents,
    urlIncidentsTypes: urlIncidentsTypes,
    scoreIcon: scoreIcon,
    ungsLocation: ungsLocation,
    driverUpdateFrequency: driverUpdateFrequency,
    RequestStatus: RequestStatus,
    AddressType: AddressType,
    driverZoom: driverZoom,
    addressMarkerOptions: addressMarkerOptions,
    incidentMarkerOptions: incidentMarkerOptions,
    driverMarkerOptions: driverMarkerOptions,


    // Iconos por driver
    getDriverIcon: function(driver_id) {
        if( driver_id == 600 ) {
          return L.icon({iconUrl: 'assets/images/vento.png', iconSize: [70,45]});
        }
        else if( driver_id == 105 ) {
          return L.icon({iconUrl: 'assets/images/futuro.png', iconSize: [70,30]});
        } else {
          return L.icon({iconUrl: 'assets/images/coche.png', iconSize: [70, 70]});
        }
      },

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
    },

    // Ícono Destino
    getDestinationIcon: function() {
      return L.icon({iconUrl: 'assets/images/destination.png', iconSize: [70, 45]});
    },

    // Ícono Destino
    getOriginIcon: function() {
      return L.icon({iconUrl: 'assets/images/origin.png', iconSize: [70, 45]});
    },

    getAddressIcon: function(type) {
      switch (type) {
        case AddressType.ORIGEN: return L.icon({iconUrl: 'assets/images/origin.png', iconSize: [70, 45]}); break;
        case AddressType.DESTINO: return L.icon({iconUrl: 'assets/images/destination.png', iconSize: [70, 45]}); break;
      }
    }
}