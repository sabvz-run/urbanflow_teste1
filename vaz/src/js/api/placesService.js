(function () {
  // Camada de lugares: ponto de entrada para o Foursquare ou outro provedor de pontos de interesse.
  const api = (window.UrbanFlowApi = window.UrbanFlowApi || {});

  // Serviço preparado para o Foursquare (ou API semelhante de lugares próximos).
  // Por enquanto, apenas filtra os pontos de interesse mockados do evento selecionado.
  api.placesService = {
    provider: "mock-ready",
    searchNearby(eventId, categories) {
      return (window.UrbanFlowData.pois || []).filter((poi) => {
        return poi.eventId === eventId && (!categories || categories.includes(poi.category));
      });
    },
    getIntegrationHint() {
      return {
        preferredProvider: "Foursquare",
        futureMethods: ["placesSearch", "placePhotos", "placeCategories", "placeTips"]
      };
    }
  };
})();
