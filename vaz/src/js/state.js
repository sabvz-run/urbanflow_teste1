(function () {
  // Estado global da aplicação: guarda as escolhas do usuário enquanto a página está aberta.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const data = window.UrbanFlowData || {};
  const defaultEvent = (data.events || [])[0] || null;

  // Como ainda não há login, API ou banco de dados, todo o estado vive em memória durante a sessão.
  // Quando o backend existir, este é o ponto natural para trocar os mocks por dados reais.
  const state = {
    currentScreen: "welcome",
    searchTerm: "",
    selectedCountry: defaultEvent ? defaultEvent.country : "Brasil",
    selectedCity: defaultEvent ? defaultEvent.city : "",
    selectedEventId: defaultEvent ? defaultEvent.id : null,
    selectedPoiId: null,
    locationConsent: null,
    route: {
      origin: "Minha localização",
      destinationPoiId: "",
      mode: "walking",
      selectedRouteId: ""
    },
    layers: {
      stadiums: true,
      hospitals: true,
      hotels: false,
      restaurants: true,
      pharmacies: true,
      bars: false,
      transport: true,
      entrances: true,
      risks: true,
      crowd: true,
      alternativeRoutes: true
    },
    itinerary: [],
    ratings: [],
    ratingDraft: 4,
    logs: [
      { time: "08:00", action: "tentativa de login via Google", origin: "auth/google", status: "simulado" },
      { time: "08:01", action: "falha na sincronização do calendário", origin: "calendarService", status: "pendente" }
    ]
  };

  function getSelectedEvent() {
    return (data.events || []).find((event) => event.id === state.selectedEventId) || defaultEvent;
  }

  function getEventPOIs() {
    const event = getSelectedEvent();
    return event ? (data.pois || []).filter((poi) => poi.eventId === event.id) : [];
  }

  function getSelectedPoi() {
    return getEventPOIs().find((poi) => poi.id === state.selectedPoiId) || null;
  }

  function addLog(action, origin, status) {
    const now = new Date();
    state.logs.unshift({
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      action,
      origin,
      status
    });
  }

  function selectEvent(eventId) {
    const event = (data.events || []).find((item) => item.id === eventId);
    if (!event) return;
    state.selectedEventId = event.id;
    state.selectedCountry = event.country;
    state.selectedCity = event.city;
    state.selectedPoiId = null;
    const eventPois = (data.pois || []).filter((poi) => poi.eventId === event.id);
    const destination = eventPois.find((poi) => poi.category === "stadium") || eventPois[0];
    state.route.destinationPoiId = destination ? destination.id : "";
    addLog("evento selecionado", "events.mock", "ok");
  }

  namespace.State = {
    state,
    getSelectedEvent,
    getEventPOIs,
    getSelectedPoi,
    addLog,
    selectEvent
  };
})();
