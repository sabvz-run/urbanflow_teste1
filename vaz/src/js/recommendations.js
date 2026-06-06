(function () {
  // Recomendações: transformam as regras de negócio em cards visuais para o usuário.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  function buildRecommendations() {
    const event = State.getSelectedEvent();
    const pois = State.getEventPOIs();
    if (!event) return [];

    const cards = [];
    const covered = pois.filter((poi) => poi.covered && poi.open && ["restaurant", "pharmacy", "hotel", "transport"].includes(poi.category));
    const transport = pois.filter((poi) => poi.category === "transport");
    const entrances = pois.filter((poi) => poi.category === "entrance" && !poi.crowded);
    const quietPlaces = pois.filter((poi) => !poi.crowded && ["restaurant", "bar", "hotel", "pharmacy"].includes(poi.category));
    const crowded = pois.filter((poi) => poi.crowded || poi.density === "alta");

    // Regras de recomendação: combinam clima, horário, densidade e distância para sugerir locais e ações,
    // reproduzindo a lógica de decisão do app sem depender, por enquanto, de uma API externa.
    if (event.weather.rain) {
      covered.slice(0, 3).forEach((poi) => {
        cards.push({
          tag: "Chuva",
          title: poi.name,
          body: "Local coberto recomendado para reduzir exposição à chuva.",
          action: "Ver no mapa",
          poiId: poi.id
        });
      });
      cards.push({
        tag: "Conforto",
        title: "Rota com menor exposição",
        body: "A rota alternativa prioriza passagens cobertas e pontos de abrigo.",
        action: "Abrir rotas",
        screen: "routes"
      });
    }

    if (event.context.simulatedHour >= "22:00" && event.context.userDistanceKm > 0.5) {
      transport.slice(0, 2).forEach((poi) => {
        cards.push({
          tag: "22h+",
          title: poi.name,
          body: "Ponto oficial sugerido para deslocamento noturno por vias iluminadas.",
          action: "Abrir rota",
          poiId: poi.id,
          screen: "routes"
        });
      });
    }

    if (event.context.crowdLevel === "alta" || crowded.length) {
      const entrance = entrances[0];
      if (entrance) {
        cards.push({
          tag: "Fluxo",
          title: entrance.name,
          body: "Entrada alternativa com fila menor e melhor distribuição de pessoas.",
          action: "Ver entrada",
          poiId: entrance.id
        });
      }
      cards.push({
        tag: "Superlotação",
        title: "Buffer no cronograma",
        body: "Locais cheios recebem tempo extra no itinerário para evitar atrasos.",
        action: "Editar roteiro",
        screen: "edit"
      });
    }

    if (event.context.userDistanceKm > 3) {
      cards.push({
        tag: "Distância",
        title: "Melhor horário de saída",
        body: `Saia cerca de ${Math.max(20, Math.round(event.context.userDistanceKm * 8))} min antes do horário alvo.`,
        action: "Ver roteiro",
        screen: "final"
      });
    }

    quietPlaces.slice(0, 3).forEach((poi) => {
      cards.push({
        tag: "Menos movimento",
        title: poi.name,
        body: "Boa opção próxima com fluxo mais estável no momento.",
        action: "Detalhes",
        poiId: poi.id
      });
    });

    return cards.slice(0, 9);
  }

  function renderContextStrip() {
    const event = State.getSelectedEvent();
    const target = UI.byId("contextStrip");
    if (!target || !event) return;
    target.innerHTML = `
      <span class="context-pill">Clima: ${UI.escapeHtml(event.weather.condition)}</span>
      <span class="context-pill">Horário: ${UI.escapeHtml(event.context.simulatedHour)}</span>
      <span class="context-pill">Distância: ${event.context.userDistanceKm} km</span>
      <span class="context-pill">Fluxo: ${UI.escapeHtml(event.context.crowdLevel)}</span>
    `;
  }

  function renderRecommendations() {
    const target = UI.byId("recommendationList");
    if (!target) return;
    const cards = buildRecommendations();
    target.innerHTML = cards.length
      ? cards
          .map(
            (card) => `
        <article class="card recommendation-card">
          <span class="badge badge-soft">${UI.escapeHtml(card.tag)}</span>
          <h3>${UI.escapeHtml(card.title)}</h3>
          <p>${UI.escapeHtml(card.body)}</p>
          <button class="button button-secondary" type="button" ${card.poiId ? `data-poi-focus="${card.poiId}"` : ""} ${card.screen ? `data-screen-target="${card.screen}"` : ""}>${UI.escapeHtml(card.action)}</button>
        </article>
      `
          )
          .join("")
      : '<div class="empty-state">Nenhuma recomendação no contexto atual.</div>';
  }

  namespace.Recommendations = {
    buildRecommendations,
    renderContextStrip,
    renderRecommendations
  };
})();
