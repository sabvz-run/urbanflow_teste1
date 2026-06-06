(function () {
  // Itinerário: monta, edita e recalcula o cronograma do usuário.
  // O foco é mostrar o impacto visual de cada escolha antes de existir persistência real.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  function minutesToTime(total) {
    const normalized = ((total % 1440) + 1440) % 1440;
    const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
    const minutes = String(normalized % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function timeToMinutes(value) {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Roteiro inicial montado para representar uma chegada real ao evento:
  // entrada, ponto principal, pausa e retorno por transporte.
  function defaultItinerary() {
    const event = State.getSelectedEvent();
    const pois = State.getEventPOIs();
    if (!event) return [];
    const entrance = pois.find((poi) => poi.category === "entrance" && !poi.crowded) || pois.find((poi) => poi.category === "entrance");
    const stadium = pois.find((poi) => poi.category === "stadium");
    const restaurant = pois.find((poi) => poi.category === "restaurant");
    const transport = pois.find((poi) => poi.category === "transport");
    return [entrance, stadium, restaurant, transport].filter(Boolean).map((poi, index) => ({
      id: `${poi.id}-${Date.now()}-${index}`,
      poiId: poi.id,
      title: poi.name,
      duration: index === 1 ? 120 : index === 2 ? 75 : 25,
      travel: index === 0 ? 35 : index === 1 ? 12 : 18,
      cost: index === 2 ? 85 : index === 3 ? 18 : 0,
      crowdedBuffer: poi.crowded ? poi.waitMinutes : 0
    }));
  }

  function ensureItinerary() {
    if (!State.state.itinerary.length) {
      State.state.itinerary = defaultItinerary();
    }
  }

  function getAgendaPOIs() {
    return State.getEventPOIs().filter((poi) => ["stadium", "restaurant", "pharmacy", "bar", "hotel", "transport", "entrance"].includes(poi.category));
  }

  function calculateSchedule() {
    ensureItinerary();
    let current = timeToMinutes("18:00");
    // Locais lotados ganham um tempo extra no cronograma, representando a regra de superlotação.
    return State.state.itinerary.map((item, index) => {
      current += item.travel || (index === 0 ? 35 : 15);
      const arrival = current;
      const buffer = item.crowdedBuffer || 0;
      const leave = arrival + item.duration + buffer;
      current = leave;
      return {
        ...item,
        arrival: minutesToTime(arrival),
        leave: minutesToTime(leave),
        buffer
      };
    });
  }

  function renderAgenda() {
    const target = UI.byId("agendaList");
    const count = UI.byId("agendaCountLabel");
    if (!target) return;
    const pois = getAgendaPOIs();
    if (count) count.textContent = `${pois.length} locais`;
    target.innerHTML = pois
      .map(
        (poi) => `
      <article class="agenda-item">
        <div>
          <strong>${UI.escapeHtml(poi.name)}</strong>
          <span>${UI.escapeHtml(poi.address)}</span>
        </div>
        <button class="button button-secondary" type="button" data-add-itinerary="${poi.id}">Adicionar</button>
      </article>
    `
      )
      .join("");
  }

  function renderBuilder() {
    const target = UI.byId("itineraryBuilder");
    if (!target) return;
    const schedule = calculateSchedule();
    const totalCost = schedule.reduce((sum, item) => sum + item.cost, 0);
    target.innerHTML = `
      <div class="itinerary-summary">
        <div class="metric"><strong>R$ ${totalCost}</strong><span>Custo estimado</span></div>
        <div class="metric"><strong>${schedule.length}</strong><span>Paradas</span></div>
      </div>
      <div class="itinerary-list">
        ${schedule.map(renderItineraryItem).join("")}
      </div>
    `;
  }

  function renderItineraryItem(item, index) {
    return `
      <article class="itinerary-item">
        <div class="time-chip">${item.arrival}</div>
        <div>
          <h3>${UI.escapeHtml(item.title)}</h3>
          <p>Permanência: ${item.duration} min${item.buffer ? ` + ${item.buffer} min de segurança` : ""}</p>
          <span>Saída prevista: ${item.leave}</span>
        </div>
        <div class="item-actions">
          <button class="icon-control" type="button" data-move-itinerary="${index}" data-direction="-1" aria-label="Subir">Up</button>
          <button class="icon-control" type="button" data-move-itinerary="${index}" data-direction="1" aria-label="Descer">Dn</button>
          <button class="icon-control" type="button" data-duration-itinerary="${index}" data-delta="-15" aria-label="Diminuir tempo">-</button>
          <button class="icon-control" type="button" data-duration-itinerary="${index}" data-delta="15" aria-label="Aumentar tempo">+</button>
          <button class="icon-control danger" type="button" data-remove-itinerary="${index}" aria-label="Remover">X</button>
        </div>
      </article>
    `;
  }

  function renderEditor() {
    const target = UI.byId("itineraryEditor");
    if (!target) return;
    const schedule = calculateSchedule();
    target.innerHTML = `
      <div class="panel">
        <div class="impact-strip">
          <span>Recálculo visual ativo</span>
          <span>${schedule.length} pontos</span>
          <span>Retorno ${schedule.length ? schedule[schedule.length - 1].leave : "00:00"}</span>
        </div>
        <div class="itinerary-list">
          ${schedule.map(renderItineraryItem).join("")}
        </div>
      </div>
    `;
  }

  function renderFinal() {
    const target = UI.byId("finalItinerary");
    if (!target) return;
    const event = State.getSelectedEvent();
    const schedule = calculateSchedule();
    const departure = "18:00";
    target.innerHTML = `
      <div class="final-layout">
        <article class="panel final-card">
          <span class="badge">Saída: ${departure}</span>
          <h2>${UI.escapeHtml(event.name)}</h2>
          <div class="timeline">
            ${schedule
              .map(
                (item) => `
              <div class="timeline-row">
                <time>${item.arrival}</time>
                <div>
                  <strong>${UI.escapeHtml(item.title)}</strong>
                  <span>Permanência ${item.duration} min - saída ${item.leave}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="stacked-actions">
            <button class="button button-primary" type="button" id="exportPdfButton">Exportar PDF</button>
            <button class="button button-secondary" type="button" id="saveCalendarButton">Salvar no calendário</button>
            <button class="button button-secondary" type="button" data-screen-target="routes">Abrir rota</button>
            <button class="button button-ghost" type="button" id="shareItineraryButton">Compartilhar roteiro</button>
            <button class="button button-ghost" type="button" data-screen-target="edit">Voltar para edição</button>
          </div>
        </article>
      </div>
    `;
  }

  function addItem(poiId) {
    const poi = State.getEventPOIs().find((item) => item.id === poiId);
    if (!poi) return;
    ensureItinerary();
    State.state.itinerary.push({
      id: `${poi.id}-${Date.now()}`,
      poiId: poi.id,
      title: poi.name,
      duration: poi.category === "restaurant" ? 75 : 30,
      travel: 15,
      cost: poi.category === "restaurant" ? 80 : poi.category === "transport" ? 18 : 0,
      crowdedBuffer: poi.crowded ? poi.waitMinutes : 0
    });
    State.addLog("local adicionado ao itinerário", "itinerary", "ok");
  }

  function removeItem(index) {
    State.state.itinerary.splice(index, 1);
    State.addLog("alteração no itinerário", "itinerary", "ok");
  }

  function moveItem(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= State.state.itinerary.length) return;
    const [item] = State.state.itinerary.splice(index, 1);
    State.state.itinerary.splice(nextIndex, 0, item);
    State.addLog("ordem do roteiro alterada", "itinerary", "ok");
  }

  function changeDuration(index, delta) {
    const item = State.state.itinerary[index];
    if (!item) return;
    item.duration = Math.max(15, item.duration + delta);
    State.addLog("tempo de permanência atualizado", "itinerary", "ok");
  }

  function renderItinerary() {
    ensureItinerary();
    renderAgenda();
    renderBuilder();
    renderEditor();
    renderFinal();
  }

  namespace.Itinerary = {
    renderItinerary,
    calculateSchedule,
    addItem,
    removeItem,
    moveItem,
    changeDuration,
    ensureItinerary
  };
})();
