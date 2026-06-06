(function () {
  // Mock de pontos de interesse: cada evento recebe os mesmos tipos de local, para exercitar as camadas do mapa.
  // As coordenadas x/y são percentuais, já que o mapa ainda é apenas visual e não georreferenciado.
  const data = window.UrbanFlowData || {};
  const templates = [
    { key: "arena", category: "stadium", name: "{venue}", address: "Portão principal", rating: 4.8, x: 50, y: 45, covered: false, open: true, crowded: true, density: "alta", waitMinutes: 18 },
    { key: "hospital", category: "hospital", name: "Hospital de Apoio", address: "Avenida de serviço 120", rating: 4.5, x: 18, y: 26, covered: true, open: true, crowded: false, density: "media", waitMinutes: 4 },
    { key: "hotel", category: "hotel", name: "Hotel Central Urban", address: "Rua das Delegações 88", rating: 4.4, x: 74, y: 22, covered: true, open: true, crowded: false, density: "baixa", waitMinutes: 2 },
    { key: "restaurant", category: "restaurant", name: "Mercado Gastronômico", address: "Boulevard do Evento 45", rating: 4.6, x: 70, y: 62, covered: true, open: true, crowded: true, density: "alta", waitMinutes: 20 },
    { key: "pharmacy", category: "pharmacy", name: "Farmácia 24h", address: "Rua Norte 310", rating: 4.2, x: 30, y: 72, covered: true, open: true, crowded: false, density: "baixa", waitMinutes: 3 },
    { key: "bar", category: "bar", name: "Bar do Entorno", address: "Travessa Leste 17", rating: 4.1, x: 83, y: 77, covered: false, open: true, crowded: true, density: "media", waitMinutes: 12 },
    { key: "transport-a", category: "transport", name: "Transporte Oficial A", address: "Terminal integrado", rating: 4.7, x: 17, y: 80, covered: true, open: true, crowded: false, density: "media", waitMinutes: 8 },
    { key: "transport-b", category: "transport", name: "Embarque Expresso B", address: "Corredor exclusivo", rating: 4.8, x: 87, y: 35, covered: true, open: true, crowded: false, density: "baixa", waitMinutes: 5 },
    { key: "entrance-a", category: "entrance", name: "Entrada A", address: "Acesso norte", rating: 4.0, x: 44, y: 18, covered: false, open: true, crowded: true, density: "alta", waitMinutes: 24 },
    { key: "entrance-b", category: "entrance", name: "Entrada B", address: "Acesso leste", rating: 4.6, x: 64, y: 37, covered: true, open: true, crowded: false, density: "media", waitMinutes: 9 },
    { key: "risk", category: "risk", name: "Área de risco operacional", address: "Interdição temporária", rating: 0, x: 35, y: 42, covered: false, open: false, crowded: false, density: "alta", waitMinutes: 0 },
    { key: "crowd", category: "crowd", name: "Área de alta densidade", address: "Setor norte", rating: 0, x: 52, y: 26, covered: false, open: true, crowded: true, density: "alta", waitMinutes: 22 }
  ];

  const labelsByCity = {
    "Rio de Janeiro": ["Maracanã", "Tijuca", "Quinta"],
    "São Paulo": ["Anhembi", "Santana", "Tietê"],
    Salvador: ["Fonte Nova", "Dique", "Barra"],
    "Feira de Santana": ["Centro", "Getúlio", "São João"],
    "New York": ["Central", "Midtown", "Hudson"],
    "Los Angeles": ["Expo Park", "Figueroa", "Metro"],
    "Mexico City": ["Norte", "Centro", "Reforma"],
    Toronto: ["BMO", "Waterfront", "Liberty"],
    Vancouver: ["Harbour", "Granville", "Central"],
    Beijing: ["Olympic", "Chaoyang", "Datun"],
    Shanghai: ["Riverside", "Pudong", "Bund"]
  };

  const pois = (data.events || []).flatMap((event) => {
    const cityLabels = labelsByCity[event.city] || [event.city, "Centro", "Evento"];
    return templates.map((template, index) => ({
      id: `${event.id}-${template.key}`,
      eventId: event.id,
      category: template.category,
      name: template.name.replace("{venue}", event.venue).replace("Urban", cityLabels[0]),
      address: `${template.address} - ${cityLabels[index % cityLabels.length]}`,
      rating: template.rating,
      coordinates: {
        x: Math.max(8, Math.min(92, template.x + ((index % 3) - 1) * 2)),
        y: Math.max(10, Math.min(88, template.y + (index % 2 === 0 ? 1 : -1)))
      },
      covered: template.covered,
      open: template.open,
      crowded: template.crowded,
      density: template.density,
      waitMinutes: template.waitMinutes,
      externalUrl: `https://example.com/urbanflow/poi/${event.id}/${template.key}`
    }));
  });

  const categories = [
    { key: "stadium", label: "Estádios", layerKey: "stadiums", short: "ST" },
    { key: "hospital", label: "Hospitais", layerKey: "hospitals", short: "HP" },
    { key: "hotel", label: "Hotéis", layerKey: "hotels", short: "HT" },
    { key: "restaurant", label: "Restaurantes", layerKey: "restaurants", short: "RS" },
    { key: "pharmacy", label: "Farmácias", layerKey: "pharmacies", short: "FM" },
    { key: "bar", label: "Bares", layerKey: "bars", short: "BR" },
    { key: "transport", label: "Transporte", layerKey: "transport", short: "TR" },
    { key: "entrance", label: "Entradas", layerKey: "entrances", short: "EN" },
    { key: "risk", label: "Áreas de risco", layerKey: "risks", short: "RI" },
    { key: "crowd", label: "Áreas cheias", layerKey: "crowd", short: "FL" }
  ];

  window.UrbanFlowData = Object.assign(window.UrbanFlowData || {}, {
    pois,
    poiCategories: categories
  });
})();
