(function () {
  // Camada de mapa: concentra num único lugar a futura integração com Mapbox ou HERE.
  const api = (window.UrbanFlowApi = window.UrbanFlowApi || {});

  // A tela já consome este contrato com dados mockados; depois ele pode passar a chamar Mapbox/HERE
  // sem que as telas precisem mudar.
  api.mapService = {
    provider: "mock-ready",
    getProviderHint() {
      return {
        preferredProviders: ["Mapbox", "HERE Maps"],
        futureMethods: ["renderMap", "geocode", "calculateRoute", "trafficLayer"],
        currentMode: "Visualizacao simulada com coordenadas percentuais"
      };
    },
    getPOIsByEvent(eventId) {
      return (window.UrbanFlowData.pois || []).filter((poi) => poi.eventId === eventId);
    },
    getCategories() {
      return window.UrbanFlowData.poiCategories || [];
    }
  };
})();
