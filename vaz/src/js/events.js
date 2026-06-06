(function () {
  // Eventos de interface: cliques, filtros, navegação, formulários e ações simuladas.
  // Fica separado do app.js para não misturar a renderização com o comportamento do usuário.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  function navigate(screen) {
    // Troca de tela (navegação single-page): esconde as seções e atualiza o menu e a barra flutuante do mobile.
    if (!screen) return;
    State.state.currentScreen = screen;
    UI.$$(".screen").forEach((item) => item.classList.toggle("is-active", item.dataset.screen === screen));
    UI.$$(".nav-link").forEach((item) => item.classList.toggle("is-active", item.dataset.screenTarget === screen));
    UI.$$(".floating-action").forEach((item) => item.classList.toggle("is-active", item.dataset.screenTarget === screen));
    UI.byId("primaryNav").classList.remove("is-open");
    UI.byId("menuToggle").setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindNavigation() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-screen-target]");
      if (!target) return;
      event.preventDefault();
      navigate(target.dataset.screenTarget);
    });

    UI.byId("menuToggle").addEventListener("click", () => {
      const nav = UI.byId("primaryNav");
      const next = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", next);
      UI.byId("menuToggle").setAttribute("aria-expanded", String(next));
    });
  }

  function bindFilters() {
    // Filtros de evento: mantêm país, cidade e campo de busca trabalhando em conjunto.
    UI.byId("eventSearchInput").addEventListener("input", (event) => {
      State.state.searchTerm = event.target.value;
      namespace.App.renderEventDiscovery();
    });

    UI.byId("homeCountrySelect").addEventListener("change", (event) => {
      State.state.selectedCountry = event.target.value;
      State.state.selectedCity = "";
      namespace.App.renderEventDiscovery();
      namespace.App.renderCountryScreen();
    });

    UI.byId("homeCitySelect").addEventListener("change", (event) => {
      State.state.selectedCity = event.target.value;
      namespace.App.renderEventDiscovery();
      namespace.App.renderCountryScreen();
    });

    document.addEventListener("click", (event) => {
      const country = event.target.closest("[data-country]");
      if (country) {
        State.state.selectedCountry = country.dataset.country;
        State.state.selectedCity = "";
        namespace.App.renderEventDiscovery();
        namespace.App.renderCountryScreen();
      }

      const city = event.target.closest("[data-city]");
      if (city) {
        State.state.selectedCity = city.dataset.city;
        namespace.App.renderEventDiscovery();
        namespace.App.renderCountryScreen();
      }

      const eventButton = event.target.closest("[data-select-event]");
      if (eventButton) {
        State.selectEvent(eventButton.dataset.selectEvent);
        namespace.App.renderAll();
        navigate("dashboard");
      }
    });
  }

  function bindMapAndRoutes() {
    // Interações do mapa: alternar camadas, selecionar pontos e abrir uma rota a partir do marcador clicado.
    document.addEventListener("change", (event) => {
      const layer = event.target.closest("[data-layer-toggle]");
      if (!layer) return;
      State.state.layers[layer.dataset.layerToggle] = layer.checked;
      State.addLog("camada do mapa alterada", "map", "ok");
      namespace.Map.renderMapModule();
    });

    document.addEventListener("click", (event) => {
      const poiMarker = event.target.closest("[data-poi-id]");
      if (poiMarker) {
        State.state.selectedPoiId = poiMarker.dataset.poiId;
        namespace.Map.renderMapModule();
      }

      const focusPoi = event.target.closest("[data-poi-focus]");
      if (focusPoi) {
        State.state.selectedPoiId = focusPoi.dataset.poiFocus;
        namespace.Map.renderMapModule();
        navigate("map");
      }

      const routeToPoi = event.target.closest("[data-route-to-poi]");
      if (routeToPoi) {
        State.state.route.destinationPoiId = routeToPoi.dataset.routeToPoi;
        State.state.route.mode = "walking";
        State.state.route.selectedRouteId = "";
        State.addLog("rota aberta a partir do mapa", "map", "ok");
        namespace.Routes.renderRoutes();
        navigate("routes");
      }
    });

    UI.byId("routeForm").addEventListener("submit", (event) => {
      event.preventDefault();
      namespace.Routes.setRouteFromForm();
      namespace.Routes.renderRoutes();
      namespace.Map.renderMapModule();
      namespace.App.showToast("Rota simulada atualizada.");
    });
  }

  function bindItinerary() {
    // Ações do roteiro: adicionar, remover, reordenar paradas e ajustar a duração, recalculando o cronograma na tela.
    document.addEventListener("click", (event) => {
      const add = event.target.closest("[data-add-itinerary]");
      if (add) {
        namespace.Itinerary.addItem(add.dataset.addItinerary);
        namespace.Itinerary.renderItinerary();
        namespace.Pdf.renderPdfPreview();
      }

      const remove = event.target.closest("[data-remove-itinerary]");
      if (remove) {
        namespace.Itinerary.removeItem(Number(remove.dataset.removeItinerary));
        namespace.Itinerary.renderItinerary();
        namespace.Pdf.renderPdfPreview();
      }

      const move = event.target.closest("[data-move-itinerary]");
      if (move) {
        namespace.Itinerary.moveItem(Number(move.dataset.moveItinerary), Number(move.dataset.direction));
        namespace.Itinerary.renderItinerary();
        namespace.Pdf.renderPdfPreview();
      }

      const duration = event.target.closest("[data-duration-itinerary]");
      if (duration) {
        namespace.Itinerary.changeDuration(Number(duration.dataset.durationItinerary), Number(duration.dataset.delta));
        namespace.Itinerary.renderItinerary();
        namespace.Pdf.renderPdfPreview();
      }
    });

    UI.byId("savePreferencesButton").addEventListener("click", () => {
      State.addLog("preferências de itinerário salvas", "itinerary", "simulado");
      namespace.App.showToast("Preferências salvas no front-end simulado.");
      namespace.App.renderAudit();
    });
  }

  function bindRatingsAndActions() {
    document.addEventListener("click", (event) => {
      const star = event.target.closest("[data-rating-value]");
      if (star) {
        State.state.ratingDraft = Number(star.dataset.ratingValue);
        namespace.Ratings.renderRatings();
      }

      const openRating = event.target.closest("[data-open-rating-modal]");
      if (openRating) {
        namespace.Ratings.openRatingModal(openRating.dataset.openRatingModal);
      }

      const external = event.target.closest("[data-external-action]");
      if (external) {
        State.addLog(external.dataset.externalAction || "redirecionamento externo", "handoff", "simulado");
        namespace.App.renderAudit();
      }
    });

    UI.byId("submitRatingButton").addEventListener("click", () => {
      namespace.Ratings.submitRating();
      namespace.Ratings.renderRatings();
      namespace.App.renderAudit();
      namespace.App.showToast("Avaliação registrada.");
    });

    UI.byId("closeRatingModalButton").addEventListener("click", namespace.Ratings.closeRatingModal);
  }

  function bindConsentAndPdf() {
    // Consentimento, PDF e calendário ficam simulados, pois dependem de integrações que virão depois.
    UI.byId("acceptConsentButton").addEventListener("click", () => {
      State.state.locationConsent = true;
      UI.byId("consentModal").classList.remove("is-visible");
      State.addLog("consentimento de localização aceito", "privacy", "ok");
      namespace.App.renderAudit();
    });

    UI.byId("declineConsentButton").addEventListener("click", () => {
      State.state.locationConsent = false;
      UI.byId("consentModal").classList.remove("is-visible");
      State.addLog("consentimento de localização recusado", "privacy", "ok");
      namespace.App.renderAudit();
    });

    document.addEventListener("click", (event) => {
      if (event.target.id === "exportPdfButton") {
        namespace.Pdf.exportPdf();
        namespace.App.renderAudit();
        namespace.App.showToast("Exportação em PDF simulada.");
      }
      if (event.target.id === "saveCalendarButton") {
        window.UrbanFlowApi.calendarService.saveItinerary();
        State.addLog("sucesso na sincronização do calendário", "calendarService", "simulado");
        namespace.App.renderAudit();
        namespace.App.showToast("Calendário sincronizado de forma simulada.");
      }
      if (event.target.id === "shareItineraryButton") {
        State.addLog("roteiro compartilhado", "share", "simulado");
        namespace.App.renderAudit();
        namespace.App.showToast("Link de compartilhamento simulado.");
      }
    });
  }

  function bindAll() {
    bindNavigation();
    bindFilters();
    bindMapAndRoutes();
    bindItinerary();
    bindRatingsAndActions();
    bindConsentAndPdf();
  }

  namespace.Events = {
    bindAll,
    navigate
  };
})();
