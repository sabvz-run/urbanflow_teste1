(function () {
  // Camada de calendário: marca onde o Google Calendar será conectado.
  const api = (window.UrbanFlowApi = window.UrbanFlowApi || {});

  // Serviço preparado para o Google Calendar; por ora devolve uma resposta simulada, mantendo o fluxo da tela.
  api.calendarService = {
    provider: "mock-ready",
    saveItinerary() {
      return {
        ok: true,
        status: "simulado",
        futureProvider: "Google Calendar"
      };
    },
    getIntegrationHint() {
      return {
        preferredProvider: "Google Calendar",
        futureMethods: ["createEvent", "syncAgenda", "auditCalendarResult"]
      };
    }
  };
})();
