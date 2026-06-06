(function () {
  // Módulo central da aplicação: monta cada tela a partir do estado atual e dos dados mockados.
  // A interface já fica navegável, mas com pontos bem definidos para receber dados reais depois.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;
  const data = window.UrbanFlowData || {};

  function getCities(country) {
    // Monta a lista de cidades a partir do país escolhido, como faria uma consulta filtrada no servidor.
    return [...new Set((data.events || []).filter((event) => !country || event.country === country).map((event) => event.city))];
  }

  function getFilteredEvents() {
    // Busca local: combina o texto digitado com os filtros de país e cidade antes de renderizar os cards.
    const term = State.state.searchTerm.trim().toLowerCase();
    return (data.events || []).filter((event) => {
      const matchesCountry = !State.state.selectedCountry || event.country === State.state.selectedCountry;
      const matchesCity = !State.state.selectedCity || event.city === State.state.selectedCity;
      const searchable = `${event.name} ${event.city} ${event.state || ""} ${event.country} ${event.venue} ${event.type}`.toLowerCase();
      const matchesTerm = !term || searchable.includes(term);
      return matchesCountry && matchesCity && matchesTerm;
    });
  }

  function renderSelectOptions() {
    const countrySelect = UI.byId("homeCountrySelect");
    const citySelect = UI.byId("homeCitySelect");
    if (!countrySelect || !citySelect) return;
    countrySelect.innerHTML = data.countries.map((country) => `<option value="${country}">${country}</option>`).join("");
    countrySelect.value = State.state.selectedCountry;
    const cities = getCities(State.state.selectedCountry);
    citySelect.innerHTML = '<option value="">Todas</option>' + cities.map((city) => `<option value="${city}">${city}</option>`).join("");
    citySelect.value = State.state.selectedCity;
  }

  function renderEventCard(event) {
    // Card de evento: traz informação suficiente para o usuário decidir sem precisar abrir os detalhes.
    const selected = event.id === State.state.selectedEventId ? " is-selected" : "";
    const location = event.state ? `${event.city}, ${event.state}` : event.city;
    return `
      <article class="card event-card${selected}">
        <div class="card-topline">
          <span class="badge">${UI.escapeHtml(event.country)}</span>
          <span>${UI.escapeHtml(event.status)}</span>
        </div>
        <h3>${UI.escapeHtml(event.name)}</h3>
        <p>${UI.escapeHtml(event.summary)}</p>
        <div class="mini-list">
          <span>${UI.escapeHtml(location)} - ${UI.escapeHtml(event.venue)}</span>
          <span>${UI.formatDate(event.startDate)} até ${UI.formatDate(event.endDate)}</span>
          <span>${UI.formatNumber(event.attendance)} pessoas previstas</span>
        </div>
        <button class="button button-primary" type="button" data-select-event="${event.id}">Selecionar evento</button>
      </article>
    `;
  }

  function renderSelectedSummary() {
    const target = UI.byId("selectedEventSummary");
    const event = State.getSelectedEvent();
    if (!target || !event) return;
    const location = event.state ? `${event.city}, ${event.state}` : event.city;
    target.innerHTML = `
      <span class="badge badge-soft">Selecionado</span>
      <h2>${UI.escapeHtml(event.name)}</h2>
      <p>${UI.escapeHtml(event.summary)}</p>
      <div class="mini-list">
        <span>Tipo: ${UI.escapeHtml(event.type)}</span>
        <span>Cidade-sede: ${UI.escapeHtml(location)}</span>
        <span>Clima: ${UI.escapeHtml(event.weather.condition)}</span>
      </div>
      <button class="button button-secondary" type="button" data-screen-target="dashboard">Abrir dashboard</button>
    `;
  }

  function renderQuickStats(events) {
    const target = UI.byId("homeQuickStats");
    if (!target) return;
    const cities = new Set(events.map((event) => event.city)).size;
    const countries = new Set(events.map((event) => event.country)).size;
    target.innerHTML = `
      <div><strong>${events.length}</strong><span>eventos</span></div>
      <div><strong>${cities}</strong><span>cidades</span></div>
      <div><strong>${countries}</strong><span>países</span></div>
    `;
  }

  function renderEventDiscovery() {
    renderSelectOptions();
    const events = getFilteredEvents();
    UI.byId("eventList").innerHTML = events.length ? events.map(renderEventCard).join("") : '<div class="empty-state">Nenhum evento encontrado.</div>';
    UI.byId("eventCountLabel").textContent = `${events.length} resultado(s)`;
    renderQuickStats(events);
    renderSelectedSummary();
  }

  function renderCountryScreen() {
    const countriesTarget = UI.byId("countryButtons");
    const cityTarget = UI.byId("cityList");
    const eventTarget = UI.byId("countryEventList");
    const eventCount = UI.byId("countryEventCountLabel");
    if (!countriesTarget || !cityTarget || !eventTarget) return;
    countriesTarget.innerHTML = data.countries
      .map((country) => `<button class="country-button${country === State.state.selectedCountry ? " is-active" : ""}" type="button" data-country="${country}">${country}</button>`)
      .join("");
    const cities = getCities(State.state.selectedCountry);
    cityTarget.innerHTML = cities
      .map((city) => `<button class="city-button${city === State.state.selectedCity ? " is-active" : ""}" type="button" data-city="${city}">${city}</button>`)
      .join("");
    const events = getFilteredEvents();
    eventTarget.innerHTML = events.length ? events.map(renderEventCard).join("") : '<div class="empty-state">Escolha outro país ou cidade.</div>';
    eventCount.textContent = `${events.length} evento(s)`;
  }

  function renderDashboard() {
    // Dashboard: resume o evento e funciona como ponte para o mapa, o roteiro e as recomendações.
    const event = State.getSelectedEvent();
    const target = UI.byId("dashboardContent");
    if (!event || !target) return;
    UI.byId("dashboardTitle").textContent = event.name;
    const location = event.state ? `${event.city}, ${event.state}` : event.city;
    const alerts = namespace.Notifications.getDerivedAlerts(event).slice(0, 3);
    const mainPOIs = State.getEventPOIs().filter((poi) => ["stadium", "entrance", "transport", "hospital"].includes(poi.category)).slice(0, 4);
    target.innerHTML = `
      <article class="panel dashboard-main">
        <span class="badge">${UI.escapeHtml(event.type)}</span>
        <h2>${UI.escapeHtml(location)} - ${UI.escapeHtml(event.venue)}</h2>
        <p>${UI.escapeHtml(event.summary)}</p>
        <div class="metrics-grid">
          <div class="metric"><strong>${UI.escapeHtml(event.weather.condition)}</strong><span>Clima</span></div>
          <div class="metric"><strong>${UI.escapeHtml(event.context.crowdLevel)}</strong><span>Fluxo estimado</span></div>
          <div class="metric"><strong>${event.context.userDistanceKm} km</strong><span>Distância até destino</span></div>
          <div class="metric"><strong>${UI.formatNumber(event.attendance)}</strong><span>Público previsto</span></div>
        </div>
        <div class="action-grid">
          <button class="button button-primary" type="button" data-screen-target="map">Abrir mapa</button>
          <button class="button button-secondary" type="button" data-screen-target="itinerary">Planejar itinerário</button>
          <button class="button button-secondary" type="button" data-screen-target="recommendations">Ver recomendações</button>
          <button class="button button-secondary" type="button" data-screen-target="notifications">Ver alertas</button>
        </div>
      </article>
      <aside class="panel">
        <h2>Alertas principais</h2>
        <div class="alert-list">${alerts.map(namespace.Notifications.renderAlert).join("")}</div>
      </aside>
      <aside class="panel">
        <h2>Principais locais</h2>
        <div class="poi-card-list">
          ${mainPOIs
            .map(
              (poi) => `
            <article class="poi-card">
              <span class="badge badge-soft">${UI.escapeHtml(poi.category)}</span>
              <strong>${UI.escapeHtml(poi.name)}</strong>
              <small>${UI.escapeHtml(poi.address)}</small>
            </article>
          `
            )
            .join("")}
        </div>
      </aside>
      <aside class="panel">
        <h2>Handoff externo</h2>
        <div class="external-grid">
          <a class="button button-ghost" href="${event.externalLinks.hotel}" target="_blank" rel="noreferrer" data-external-action="reservar hotel">Reservar hotel</a>
          <a class="button button-ghost" href="${event.externalLinks.ticket}" target="_blank" rel="noreferrer" data-external-action="comprar ingresso">Comprar ingresso</a>
          <a class="button button-ghost" href="${event.externalLinks.restaurant}" target="_blank" rel="noreferrer" data-external-action="reservar restaurante">Reservar restaurante</a>
          <a class="button button-ghost" href="${event.externalLinks.transport}" target="_blank" rel="noreferrer" data-external-action="abrir transporte">Abrir transporte</a>
          <a class="button button-ghost" href="${event.externalLinks.official}" target="_blank" rel="noreferrer" data-external-action="abrir site oficial">Site oficial</a>
        </div>
      </aside>
    `;
  }

  function renderAudit() {
    // Auditoria: monta a tabela de logs em tela, demonstrando a rastreabilidade das ações do sistema.
    const target = UI.byId("logTableBody");
    if (!target) return;
    target.innerHTML = State.state.logs
      .map(
        (log) => `
        <tr>
          <td>${UI.escapeHtml(log.time)}</td>
          <td>${UI.escapeHtml(log.action)}</td>
          <td>${UI.escapeHtml(log.origin)}</td>
          <td><span class="status-pill">${UI.escapeHtml(log.status)}</span></td>
        </tr>
      `
      )
      .join("");
  }

  function renderHeader() {
    const event = State.getSelectedEvent();
    const label = UI.byId("headerEventLabel");
    if (label && event) label.textContent = `${event.city} - ${event.name}`;
  }

  function showToast(message) {
    const target = UI.byId("toastRegion");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    target.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function renderAll() {
    renderHeader();
    renderEventDiscovery();
    renderCountryScreen();
    renderDashboard();
    namespace.Map.renderMapModule();
    namespace.Routes.renderRoutes();
    namespace.Recommendations.renderContextStrip();
    namespace.Recommendations.renderRecommendations();
    namespace.Itinerary.renderItinerary();
    namespace.Ratings.renderRatings();
    namespace.Notifications.renderNotifications();
    namespace.Pdf.renderPdfPreview();
    renderAudit();
  }

  function init() {
    // Inicialização: define um destino padrão para as rotas e renderiza a primeira versão da interface.
    namespace.Itinerary.ensureItinerary();
    const event = State.getSelectedEvent();
    const firstPoi = State.getEventPOIs().find((poi) => poi.category === "stadium") || State.getEventPOIs()[0];
    if (firstPoi) State.state.route.destinationPoiId = firstPoi.id;
    if (event) State.addLog("aplicação UrbanFlow iniciada", "app", "ok");
    namespace.Events.bindAll();
    renderAll();
  }

  namespace.App = {
    init,
    renderAll,
    renderEventDiscovery,
    renderCountryScreen,
    renderAudit,
    showToast
  };

  document.addEventListener("DOMContentLoaded", init);
})();
