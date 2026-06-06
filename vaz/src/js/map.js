(function () {
  // Mapa visual: desenha as camadas e os marcadores a partir dos dados mockados.
  // O formato dos dados foi pensado para que, ao entrar um mapa real, as telas não precisem ser refeitas.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  const layerLabels = {
    stadiums: "Estadios",
    hospitals: "Hospitais",
    hotels: "Hoteis",
    restaurants: "Restaurantes",
    pharmacies: "Farmacias",
    bars: "Bares",
    transport: "Transporte",
    entrances: "Entradas",
    risks: "Areas de risco",
    crowd: "Areas cheias",
    alternativeRoutes: "Rotas alternativas"
  };

  const layerForCategory = {
    stadium: "stadiums",
    hospital: "hospitals",
    hotel: "hotels",
    restaurant: "restaurants",
    pharmacy: "pharmacies",
    bar: "bars",
    transport: "transport",
    entrance: "entrances",
    risk: "risks",
    crowd: "crowd"
  };

  // Cada categoria de local tem seu próprio ícone (SVG), usado dentro dos marcadores do mapa.
  const markerIcons = {
    stadium: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="3"></rect><path d="M8 5v14M16 5v14M4 12h16"></path></svg>',
    hospital: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"></rect><path d="M12 8v8M8 12h8"></path></svg>',
    hotel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18V7"></path><path d="M4 13h16v5"></path><path d="M8 13V9h5a3 3 0 0 1 3 3v1"></path></svg>',
    restaurant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16"></path><path d="M5 4v5a2 2 0 0 0 4 0V4"></path><path d="M16 4v16"></path><path d="M16 4c2 1 3 3 3 6v2h-3"></path></svg>',
    pharmacy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><path d="M12 8v8M8 12h8"></path></svg>',
    bar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10l-1 6a4 4 0 0 1-8 0L7 5Z"></path><path d="M12 15v4M9 19h6"></path></svg>',
    transport: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="14" rx="3"></rect><path d="M8 8h8M5 12h14M8 20h.01M16 20h.01"></path></svg>',
    entrance: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 20V5h9v15"></path><path d="M11 12h9M17 9l3 3-3 3"></path></svg>',
    risk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 20H3L12 4Z"></path><path d="M12 9v5"></path><path d="M12 17h.01"></path></svg>',
    crowd: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle><circle cx="16" cy="8" r="3"></circle><path d="M4 19c.7-3 2.2-5 4-5s3.3 2 4 5"></path><path d="M12 19c.7-3 2.2-5 4-5 1.4 0 2.6 1.2 3.4 3.2"></path></svg>',
    default: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>'
  };

  // Reaproveita os mesmos ícones dos marcadores nos controles de camada, mantendo a leitura consistente
  // entre o mapa e os filtros, sem depender de emojis ou de uma biblioteca externa.
  const layerIcons = {
    stadiums: markerIcons.stadium,
    hospitals: markerIcons.hospital,
    hotels: markerIcons.hotel,
    restaurants: markerIcons.restaurant,
    pharmacies: markerIcons.pharmacy,
    bars: markerIcons.bar,
    transport: markerIcons.transport,
    entrances: markerIcons.entrance,
    risks: markerIcons.risk,
    crowd: markerIcons.crowd,
    alternativeRoutes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17c4-8 10 0 14-8"></path><path d="M6 6h.01M18 18h.01"></path></svg>'
  };

  // Enquanto não há um provedor de mapa (Mapbox/HERE), os pontos usam coordenadas em porcentagem.
  // Assim a tela funciona para demonstração e mantém a lógica de "camadas + marcadores".
  function getCategoryMeta(category) {
    return (window.UrbanFlowData.poiCategories || []).find((item) => item.key === category) || { short: "PO", label: category };
  }

  function getMarkerIcon(category) {
    return markerIcons[category] || markerIcons.default;
  }

  function getLayerIcon(layer) {
    return layerIcons[layer] || markerIcons.default;
  }

  function renderLayerControls() {
    const target = UI.byId("layerControls");
    if (!target) return;
    target.innerHTML = Object.entries(layerLabels)
      .map(([key, label]) => {
        const checked = State.state.layers[key] ? "checked" : "";
        return `
          <label class="toggle-row">
            <span class="layer-icon">${getLayerIcon(key)}</span>
            <span class="layer-label">${UI.escapeHtml(label)}</span>
            <input type="checkbox" data-layer-toggle="${key}" ${checked} />
          </label>
        `;
      })
      .join("");
  }

  function isPoiVisible(poi) {
    const layer = layerForCategory[poi.category];
    return layer ? State.state.layers[layer] : true;
  }

  function renderMap() {
    const event = State.getSelectedEvent();
    const target = UI.byId("mapCanvas");
    const label = UI.byId("mapEventLabel");
    if (!target || !event) return;
    if (label) label.textContent = `${event.name} - ${event.city}`;

    const pois = State.getEventPOIs().filter(isPoiVisible);
    const crowdZones = State.getEventPOIs().filter((poi) => poi.category === "crowd" && State.state.layers.crowd);
    const riskZones = State.getEventPOIs().filter((poi) => poi.category === "risk" && State.state.layers.risks);
    const selectedRoute = namespace.Routes ? namespace.Routes.getSelectedRoute() : null;

    target.innerHTML = `
      <div class="map-grid"></div>
      <div class="map-district district-park"></div>
      <div class="map-district district-water"></div>
      <div class="map-district district-event"></div>
      <svg class="city-road-network" viewBox="0 0 1000 640" aria-hidden="true">
        <path class="road-major" d="M-40 372 C170 356 350 340 520 340 C690 340 835 323 1040 318" />
        <path class="road-major" d="M640 -40 C624 130 605 255 520 340 C455 405 425 505 392 690" />
        <path class="road-secondary" d="M-40 206 C160 264 328 305 520 340 C704 374 850 426 1040 478" />
        <path class="road-secondary" d="M85 150 C248 154 408 138 585 132 C730 128 865 146 1040 174" />
        <path class="road-secondary" d="M120 524 C252 468 386 406 520 340 C632 284 745 232 1040 246" />
        <path class="road-secondary" d="M780 54 C725 176 640 268 520 340 C420 401 328 486 242 574" />
        <path class="road-minor" d="M220 28 C244 164 300 270 392 354 C468 424 506 520 530 660" />
        <path class="road-minor" d="M95 432 C235 420 382 392 520 340" />
        <path class="road-minor" d="M700 248 C640 292 575 322 520 340" />
        <path class="road-minor" d="M-60 512 C140 486 322 430 520 340" />
        <circle class="road-node" cx="520" cy="340" r="7" />
        <circle class="road-node" cx="585" cy="132" r="6" />
        <circle class="road-node" cx="392" cy="354" r="6" />
        <circle class="road-node" cx="632" cy="284" r="6" />
      </svg>
      <span class="map-road-label label-central">Av. Central</span>
      <span class="map-road-label label-arena">Rua da Arena</span>
      <span class="map-road-label label-norte">Linha Norte</span>
      <span class="map-road-label label-acesso">Acesso B</span>
      ${State.state.layers.alternativeRoutes ? '<div class="route-overlay route-overlay-alt"></div>' : ""}
      ${selectedRoute ? '<div class="route-overlay route-overlay-main"></div>' : ""}
      ${crowdZones
        .map(
          (zone) => `<button class="density-zone" type="button" data-poi-id="${zone.id}" style="left:${zone.coordinates.x}%; top:${zone.coordinates.y}%;">Alta densidade</button>`
        )
        .join("")}
      ${riskZones
        .map(
          (zone) => `<button class="risk-zone" type="button" data-poi-id="${zone.id}" style="left:${zone.coordinates.x}%; top:${zone.coordinates.y}%;">Risco</button>`
        )
        .join("")}
      ${pois.map(renderMarker).join("")}
    `;
  }

  function renderMarker(poi) {
    const selected = State.state.selectedPoiId === poi.id ? " is-selected" : "";
    const crowded = poi.crowded ? " is-crowded" : "";
    return `
      <button class="map-marker marker-${poi.category}${selected}${crowded}" type="button" data-poi-id="${poi.id}" style="left:${poi.coordinates.x}%; top:${poi.coordinates.y}%;" title="${UI.escapeHtml(poi.name)}" aria-label="${UI.escapeHtml(poi.name)}">
        <span class="marker-icon">${getMarkerIcon(poi.category)}</span>
      </button>
    `;
  }

  function renderPoiDetails() {
    const target = UI.byId("poiDetails");
    if (!target) return;
    const poi = State.getSelectedPoi() || State.getEventPOIs().find((item) => item.category === "stadium");
    if (!poi) {
      target.innerHTML = '<div class="empty-state">Nenhum ponto selecionado.</div>';
      return;
    }
    const meta = getCategoryMeta(poi.category);
    target.innerHTML = `
      <span class="badge">${UI.escapeHtml(meta.label)}</span>
      <h2>${UI.escapeHtml(poi.name)}</h2>
      <p>${UI.escapeHtml(poi.address)}</p>
      <div class="mini-list">
        <span>Nota: ${poi.rating ? poi.rating.toFixed(1) : "N/A"}</span>
        <span>${poi.covered ? "Área coberta" : "Área aberta"}</span>
        <span>${poi.open ? "Aberto" : "Indisponível"}</span>
        <span>Fila: ${poi.waitMinutes} min</span>
      </div>
      ${poi.crowded ? '<div class="alert-inline">Alta densidade detectada. Entrada alternativa recomendada.</div>' : ""}
      <div class="stacked-actions">
        <button class="button button-primary" type="button" data-route-to-poi="${poi.id}">Rota até aqui</button>
        <button class="button button-secondary" type="button" data-open-rating-modal="${poi.id}">Avaliar local</button>
        <a class="button button-ghost" href="${poi.externalUrl}" target="_blank" rel="noreferrer" data-external-action="abrir endereço no mapa">Abrir endereço</a>
      </div>
    `;
  }

  function renderMapModule() {
    renderLayerControls();
    renderMap();
    renderPoiDetails();
  }

  namespace.Map = {
    renderMapModule,
    renderMap,
    renderPoiDetails,
    renderLayerControls
  };
})();
