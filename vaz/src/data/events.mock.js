(function () {
  // Mock de eventos: representa o que futuramente viria do backend próprio.
  // A lista de países é propositalmente reduzida ao recorte do projeto, para tornar a busca previsível na demonstração.
  const countries = ["Brasil", "EUA", "México", "Canadá", "China"];

  const events = [
    {
      id: "rio-final-2027",
      name: "Final Continental 2027",
      type: "Esportivo",
      country: "Brasil",
      city: "Rio de Janeiro",
      venue: "Estádio Maracanã",
      startDate: "2027-07-12",
      endDate: "2027-07-12",
      coordinates: { lat: -22.9122, lng: -43.2302 },
      attendance: 72000,
      status: "Alta procura",
      weather: { condition: "Chuva leve", temperature: 24, rain: true, heat: false },
      context: { simulatedHour: "22:30", userDistanceKm: 4.8, crowdLevel: "alta", outdoors: true },
      summary: "Operação urbana para chegada ao estádio, Fan Zone e retornos por transporte oficial.",
      alerts: [
        { type: "rain", title: "Chuva leve prevista", severity: "medium", message: "Rotas cobertas e pontos internos foram priorizados." },
        { type: "crowd", title: "Alta densidade no setor norte", severity: "high", message: "Entrada B tem fluxo mais estável neste momento." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-rio",
        ticket: "https://example.com/urbanflow/ingressos-rio",
        restaurant: "https://example.com/urbanflow/restaurantes-rio",
        transport: "https://example.com/urbanflow/transporte-rio",
        official: "https://example.com/urbanflow/final-continental"
      }
    },
    {
      id: "sao-paulo-mobility-2027",
      name: "Expo Mobilidade Urbana",
      type: "Tecnologia",
      country: "Brasil",
      city: "São Paulo",
      venue: "Distrito Anhembi",
      startDate: "2027-05-04",
      endDate: "2027-05-07",
      coordinates: { lat: -23.5157, lng: -46.6383 },
      attendance: 38000,
      status: "Credenciamento aberto",
      weather: { condition: "Nublado", temperature: 21, rain: false, heat: false },
      context: { simulatedHour: "18:40", userDistanceKm: 2.1, crowdLevel: "média", outdoors: false },
      summary: "Feira com pavilhões, trilhas técnicas e rotas de conexão com metrô e corredores de ônibus.",
      alerts: [
        { type: "traffic", title: "Tráfego intenso na chegada", severity: "medium", message: "Transporte público reduz o tempo estimado até o pavilhão." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-sp",
        ticket: "https://example.com/urbanflow/credencial-sp",
        restaurant: "https://example.com/urbanflow/restaurantes-sp",
        transport: "https://example.com/urbanflow/transporte-sp",
        official: "https://example.com/urbanflow/expo-mobilidade"
      }
    },
    {
      id: "salvador-fanfest-2027",
      name: "Festival Arena Salvador",
      type: "Cultural",
      country: "Brasil",
      state: "Bahia",
      city: "Salvador",
      venue: "Arena Fonte Nova",
      startDate: "2027-08-20",
      endDate: "2027-08-22",
      coordinates: { lat: -12.9789, lng: -38.5044 },
      attendance: 52000,
      status: "Operação Bahia",
      weather: { condition: "Calor úmido", temperature: 29, rain: false, heat: true },
      context: { simulatedHour: "21:10", userDistanceKm: 3.2, crowdLevel: "alta", outdoors: true },
      summary: "Festival urbano em Salvador com fluxo no entorno da Arena Fonte Nova, pontos de apoio e transporte oficial.",
      alerts: [
        { type: "heat", title: "Calor no entorno da arena", severity: "medium", message: "Pontos de hidratação e locais cobertos foram priorizados." },
        { type: "crowd", title: "Fluxo alto no Dique", severity: "high", message: "Entrada B reduz caminhada em área cheia." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-salvador",
        ticket: "https://example.com/urbanflow/ingressos-salvador",
        restaurant: "https://example.com/urbanflow/restaurantes-salvador",
        transport: "https://example.com/urbanflow/transporte-salvador",
        official: "https://example.com/urbanflow/festival-salvador"
      }
    },
    {
      id: "feira-mobility-2027",
      name: "Conecta Mobilidade Feira",
      type: "Tecnologia",
      country: "Brasil",
      state: "Bahia",
      city: "Feira de Santana",
      venue: "Centro de Convenções",
      startDate: "2027-09-14",
      endDate: "2027-09-16",
      coordinates: { lat: -12.2664, lng: -38.9663 },
      attendance: 18000,
      status: "Inscrições abertas",
      weather: { condition: "Parcialmente nublado", temperature: 27, rain: false, heat: false },
      context: { simulatedHour: "17:40", userDistanceKm: 2.6, crowdLevel: "média", outdoors: false },
      summary: "Evento acadêmico e tecnológico em Feira de Santana com rotas entre centro, hotéis e transporte oficial.",
      alerts: [
        { type: "traffic", title: "Avenida principal movimentada", severity: "medium", message: "Rota alternativa pelo eixo leste aparece como opção mais estável." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-feira",
        ticket: "https://example.com/urbanflow/inscricao-feira",
        restaurant: "https://example.com/urbanflow/restaurantes-feira",
        transport: "https://example.com/urbanflow/transporte-feira",
        official: "https://example.com/urbanflow/conecta-feira"
      }
    },
    {
      id: "nyc-marathon-2026",
      name: "Maratona Global NYC",
      type: "Esportivo",
      country: "EUA",
      city: "New York",
      venue: "Central Park Finish",
      startDate: "2026-11-01",
      endDate: "2026-11-01",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      attendance: 55000,
      status: "Rotas publicadas",
      weather: { condition: "Frio seco", temperature: 11, rain: false, heat: false },
      context: { simulatedHour: "07:20", userDistanceKm: 6.5, crowdLevel: "alta", outdoors: true },
      summary: "Evento de rua com bloqueios progressivos, áreas de torcida e pontos de suporte médico.",
      alerts: [
        { type: "route", title: "Bloqueios no trajeto", severity: "medium", message: "Use os pontos de transporte oficial ao norte do parque." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-nyc",
        ticket: "https://example.com/urbanflow/runner-pass-nyc",
        restaurant: "https://example.com/urbanflow/restaurantes-nyc",
        transport: "https://example.com/urbanflow/transporte-nyc",
        official: "https://example.com/urbanflow/maratona-nyc"
      }
    },
    {
      id: "los-angeles-2028",
      name: "Jogos de Verão 2028",
      type: "Multiesportivo",
      country: "EUA",
      city: "Los Angeles",
      venue: "LA Memorial Coliseum",
      startDate: "2028-07-14",
      endDate: "2028-07-30",
      coordinates: { lat: 34.0141, lng: -118.2879 },
      attendance: 90000,
      status: "Planejamento",
      weather: { condition: "Calor", temperature: 33, rain: false, heat: true },
      context: { simulatedHour: "15:10", userDistanceKm: 8.2, crowdLevel: "média", outdoors: true },
      summary: "Operação com arenas múltiplas, bolsão de transporte e recomendações por calor extremo.",
      alerts: [
        { type: "heat", title: "Calor elevado", severity: "high", message: "Pontos de hidratação foram destacados no mapa." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-la",
        ticket: "https://example.com/urbanflow/ingressos-la",
        restaurant: "https://example.com/urbanflow/restaurantes-la",
        transport: "https://example.com/urbanflow/transporte-la",
        official: "https://example.com/urbanflow/jogos-verao"
      }
    },
    {
      id: "mexico-fanzone-2026",
      name: "Festival Fan Zone Norte",
      type: "Cultural",
      country: "México",
      city: "Mexico City",
      venue: "Plaza Norte",
      startDate: "2026-09-18",
      endDate: "2026-09-20",
      coordinates: { lat: 19.4326, lng: -99.1332 },
      attendance: 46000,
      status: "Programação ativa",
      weather: { condition: "Chuva forte", temperature: 20, rain: true, heat: false },
      context: { simulatedHour: "21:45", userDistanceKm: 3.4, crowdLevel: "alta", outdoors: true },
      summary: "Festival urbano com shows, praça gastronômica e acessos monitorados por densidade.",
      alerts: [
        { type: "rain", title: "Chuva forte no entorno", severity: "high", message: "Locais cobertos aparecem no topo das recomendações." },
        { type: "crowd", title: "Superlotação na praça central", severity: "high", message: "Entrada C reduz o tempo em fila." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-mexico",
        ticket: "https://example.com/urbanflow/ingressos-mexico",
        restaurant: "https://example.com/urbanflow/restaurantes-mexico",
        transport: "https://example.com/urbanflow/transporte-mexico",
        official: "https://example.com/urbanflow/fanzone-norte"
      }
    },
    {
      id: "toronto-cities-2026",
      name: "Copa das Cidades 2026",
      type: "Esportivo",
      country: "Canadá",
      city: "Toronto",
      venue: "BMO Field",
      startDate: "2026-06-12",
      endDate: "2026-07-18",
      coordinates: { lat: 43.6332, lng: -79.4186 },
      attendance: 45000,
      status: "Ingressos em lotes",
      weather: { condition: "Parcialmente nublado", temperature: 19, rain: false, heat: false },
      context: { simulatedHour: "19:20", userDistanceKm: 5.1, crowdLevel: "média", outdoors: true },
      summary: "Partidas, Fan Zones e conexões por trem urbano com pontos de apoio no waterfront.",
      alerts: [
        { type: "traffic", title: "Chegada distribuída", severity: "low", message: "Transporte oficial segue como melhor opção." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-toronto",
        ticket: "https://example.com/urbanflow/ingressos-toronto",
        restaurant: "https://example.com/urbanflow/restaurantes-toronto",
        transport: "https://example.com/urbanflow/transporte-toronto",
        official: "https://example.com/urbanflow/copa-cidades"
      }
    },
    {
      id: "vancouver-winter-2027",
      name: "Summit Esportes de Inverno",
      type: "Conferência",
      country: "Canadá",
      city: "Vancouver",
      venue: "Harbour Centre",
      startDate: "2027-02-08",
      endDate: "2027-02-11",
      coordinates: { lat: 49.2846, lng: -123.1115 },
      attendance: 12000,
      status: "Inscrições abertas",
      weather: { condition: "Chuva leve", temperature: 7, rain: true, heat: false },
      context: { simulatedHour: "20:05", userDistanceKm: 1.8, crowdLevel: "baixa", outdoors: false },
      summary: "Conferência compacta com hotéis próximos, áreas cobertas e conexão por SkyTrain.",
      alerts: [
        { type: "rain", title: "Chuva no centro", severity: "medium", message: "Trajetos internos e passagens cobertas estão destacados." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-vancouver",
        ticket: "https://example.com/urbanflow/inscricao-vancouver",
        restaurant: "https://example.com/urbanflow/restaurantes-vancouver",
        transport: "https://example.com/urbanflow/transporte-vancouver",
        official: "https://example.com/urbanflow/winter-summit"
      }
    },
    {
      id: "beijing-smartcity-2027",
      name: "Fórum Cidades Inteligentes",
      type: "Tecnologia",
      country: "China",
      city: "Beijing",
      venue: "National Convention Center",
      startDate: "2027-04-22",
      endDate: "2027-04-25",
      coordinates: { lat: 39.9957, lng: 116.3898 },
      attendance: 28000,
      status: "Pavilhões definidos",
      weather: { condition: "Seco", temperature: 17, rain: false, heat: false },
      context: { simulatedHour: "09:15", userDistanceKm: 2.9, crowdLevel: "média", outdoors: false },
      summary: "Fórum com trilhas técnicas, delegações internacionais e integração futura com APIs urbanas.",
      alerts: [
        { type: "route", title: "Entrada oeste recomendada", severity: "low", message: "Acesso com menor fila para credenciamento." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-beijing",
        ticket: "https://example.com/urbanflow/forum-beijing",
        restaurant: "https://example.com/urbanflow/restaurantes-beijing",
        transport: "https://example.com/urbanflow/transporte-beijing",
        official: "https://example.com/urbanflow/smartcity-forum"
      }
    },
    {
      id: "shanghai-port-2026",
      name: "Festival Portuário Shanghai",
      type: "Cultural",
      country: "China",
      city: "Shanghai",
      venue: "Riverside Expo Park",
      startDate: "2026-10-03",
      endDate: "2026-10-05",
      coordinates: { lat: 31.2304, lng: 121.4737 },
      attendance: 51000,
      status: "Rotas em revisão",
      weather: { condition: "Úmido", temperature: 27, rain: false, heat: false },
      context: { simulatedHour: "22:20", userDistanceKm: 7.4, crowdLevel: "alta", outdoors: true },
      summary: "Festival noturno no waterfront com áreas cheias, embarque oficial e restaurantes próximos.",
      alerts: [
        { type: "crowd", title: "Passarela central cheia", severity: "high", message: "Caminho alternativo pelo eixo leste." }
      ],
      externalLinks: {
        hotel: "https://example.com/urbanflow/hotel-shanghai",
        ticket: "https://example.com/urbanflow/ingressos-shanghai",
        restaurant: "https://example.com/urbanflow/restaurantes-shanghai",
        transport: "https://example.com/urbanflow/transporte-shanghai",
        official: "https://example.com/urbanflow/festival-portuario"
      }
    }
  ];

  window.UrbanFlowData = Object.assign(window.UrbanFlowData || {}, {
    countries,
    events
  });
})();
