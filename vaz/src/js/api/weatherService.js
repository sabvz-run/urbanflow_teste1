(function () {
  // Camada de clima: isola das telas a futura chamada ao OpenWeather.
  const api = (window.UrbanFlowApi = window.UrbanFlowApi || {});

  // Mantido à parte para que a futura troca pelo OpenWeather não afete o restante da interface.
  api.weatherService = {
    provider: "mock-ready",
    getCurrentWeather(event) {
      return event.weather;
    },
    getIntegrationHint() {
      return {
        preferredProvider: "OpenWeather",
        futureMethods: ["currentWeather", "shortForecast", "weatherAlerts"]
      };
    }
  };
})();
