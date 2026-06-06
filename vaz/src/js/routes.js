(function () {
  // Rotas: seleciona a melhor rota mockada até o destino e exibe uma alternativa de deslocamento.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  // As rotas mockadas seguem o mesmo formato de uma futura resposta de API:
  // origem, destino, modo, distância, tempo e alternativa.
  function getRoutesForEvent() {
    const event = State.getSelectedEvent();
    if (!event) return [];
    return (window.UrbanFlowData.routes || []).filter((route) => route.eventId === event.id);
  }

  function getSelectedRoute() {
    const routeState = State.state.route;
    const routes = getRoutesForEvent();
    return (
      routes.find((route) => route.id === routeState.selectedRouteId) ||
      routes.find((route) => route.destinationPoiId === routeState.destinationPoiId && route.mode === routeState.mode) ||
      routes[0] ||
      null
    );
  }

  function renderDestinationOptions() {
    const select = UI.byId("routeDestinationSelect");
    if (!select) return;
    const pois = State.getEventPOIs().filter((poi) => ["stadium", "restaurant", "transport", "entrance", "hotel", "pharmacy"].includes(poi.category));
    if (!State.state.route.destinationPoiId && pois[0]) {
      State.state.route.destinationPoiId = pois[0].id;
    }
    select.innerHTML = pois.map((poi) => `<option value="${poi.id}">${UI.escapeHtml(poi.name)}</option>`).join("");
    select.value = State.state.route.destinationPoiId;
  }

  function renderRouteResult() {
    const target = UI.byId("routeResult");
    const originInput = UI.byId("routeOriginInput");
    const modeSelect = UI.byId("routeModeSelect");
    if (!target) return;
    const route = getSelectedRoute();
    if (originInput) originInput.value = State.state.route.origin;
    if (modeSelect) modeSelect.value = State.state.route.mode;

    if (!route) {
      target.innerHTML = '<div class="empty-state">Selecione um evento para gerar rotas.</div>';
      return;
    }

    target.innerHTML = `
      <article class="panel route-result">
        <div class="route-head">
          <span class="route-mode">${UI.escapeHtml(route.modeLabel)}</span>
          <div>
            <h2>${UI.escapeHtml(route.destination)}</h2>
            <p>Origem: ${UI.escapeHtml(State.state.route.origin || route.origin)}</p>
          </div>
        </div>
        <div class="metrics-grid">
          <div class="metric"><strong>${route.distanceKm} km</strong><span>Distância</span></div>
          <div class="metric"><strong>${route.estimatedMinutes} min</strong><span>Tempo</span></div>
          <div class="metric"><strong>${UI.escapeHtml(route.trafficLevel)}</strong><span>Tráfego</span></div>
          <div class="metric"><strong>${UI.escapeHtml(route.safety)}</strong><span>Segurança</span></div>
        </div>
        <div class="route-line">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="route-details">
          <h3>Detalhes da rota</h3>
          <ol>
            ${route.steps.map((step) => `<li>${UI.escapeHtml(step)}</li>`).join("")}
          </ol>
        </div>
        <article class="alternative-route">
          <span class="badge">Alternativa</span>
          <h3>${UI.escapeHtml(route.alternative.title)}</h3>
          <p>${route.alternative.distanceKm} km - ${route.alternative.estimatedMinutes} min - ${UI.escapeHtml(route.alternative.benefit)}</p>
        </article>
      </article>
    `;
  }

  function renderRoutes() {
    renderDestinationOptions();
    renderRouteResult();
  }

  function setRouteFromForm() {
    const origin = UI.byId("routeOriginInput").value.trim() || "Minha localização";
    const destinationPoiId = UI.byId("routeDestinationSelect").value;
    const mode = UI.byId("routeModeSelect").value;
    const selected = getRoutesForEvent().find((route) => route.destinationPoiId === destinationPoiId && route.mode === mode);
    State.state.route = {
      origin,
      destinationPoiId,
      mode,
      selectedRouteId: selected ? selected.id : ""
    };
    State.addLog("rota simulada gerada", "routes.mock", "ok");
  }

  namespace.Routes = {
    getRoutesForEvent,
    getSelectedRoute,
    renderRoutes,
    setRouteFromForm
  };
})();
