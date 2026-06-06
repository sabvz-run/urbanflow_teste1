(function () {
  // Mock de rotas: simula as respostas que uma API de mapas entregaria mais tarde.
  // Serve para validar a interface de distância, tempo, tráfego e rota alternativa sem depender de backend.
  const data = window.UrbanFlowData || {};
  const baseRoutes = [
    { mode: "walking", label: "A pe", speedFactor: 1, comfort: "media", icon: "AP" },
    { mode: "transit", label: "Transporte publico", speedFactor: 0.62, comfort: "alta", icon: "TP" },
    { mode: "drive", label: "Carro/app", speedFactor: 0.78, comfort: "media", icon: "CA" }
  ];

  const routes = (data.events || []).flatMap((event) => {
    const pois = (data.pois || []).filter((poi) => poi.eventId === event.id && ["stadium", "restaurant", "transport", "entrance", "hotel"].includes(poi.category));
    return pois.flatMap((poi, index) =>
      baseRoutes.map((profile) => {
        const distance = Number((event.context.userDistanceKm + index * 0.45).toFixed(1));
        const crowdBuffer = poi.crowded ? poi.waitMinutes : 0;
        const time = Math.round((distance * 12 + crowdBuffer) * profile.speedFactor);
        return {
          id: `${event.id}-${poi.id}-${profile.mode}`,
          eventId: event.id,
          destinationPoiId: poi.id,
          origin: "Minha localizacao",
          destination: poi.name,
          mode: profile.mode,
          modeLabel: profile.label,
          distanceKm: distance,
          estimatedMinutes: Math.max(8, time),
          trafficLevel: poi.crowded ? "alto" : index % 2 === 0 ? "medio" : "baixo",
          safety: event.context.simulatedHour >= "22:00" ? "vias iluminadas" : "rota direta",
          exposure: event.weather.rain ? "menor exposicao a chuva" : "exposicao normal",
          alternative: {
            title: poi.category === "entrance" ? "Entrada B ou C" : "Rota perimetral",
            distanceKm: Number((distance + 0.6).toFixed(1)),
            estimatedMinutes: Math.max(10, Math.round(time + 7)),
            benefit: poi.crowded ? "evita area de alta densidade" : "mantem fluxo mais estavel"
          },
          steps: [
            "Sair pelo eixo seguro mais proximo",
            event.weather.rain ? "Priorizar trecho coberto" : "Seguir pela avenida principal",
            poi.crowded ? "Usar desvio por fluxo moderado" : "Manter rota direta",
            `Chegar em ${poi.name}`
          ]
        };
      })
    );
  });

  window.UrbanFlowData = Object.assign(window.UrbanFlowData || {}, {
    routeModes: baseRoutes,
    routes
  });
})();
