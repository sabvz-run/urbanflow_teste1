# UrbanFlow

UrbanFlow é um protótipo de front-end voltado à mobilidade urbana durante grandes eventos. O objetivo desta versão é apresentar, de ponta a ponta, o fluxo de uso do aplicativo, da escolha do evento ao roteiro final, mesmo sem um backend implementado e sem uma API de mapas definida. Toda a aplicação roda no navegador, a partir de HTML, CSS e JavaScript puros (sem dependências externas).

## Funcionalidades demonstradas

A interface cobre a jornada completa do usuário:

- Busca e seleção de evento por texto, país e cidade.
- Dashboard com resumo do evento, alertas contextuais e ações principais.
- Mapa simulado com camadas de pontos de interesse, áreas de alta densidade, zonas de risco e rota alternativa.
- Tela de rotas com origem, destino, modo de deslocamento, distância e tempo estimado.
- Recomendações geradas a partir de clima, horário, densidade e distância.
- Planejamento, edição e resumo final do itinerário, com recálculo do cronograma em tela.
- Avaliação de locais por estrelas e comentário.
- Prévia visual do PDF do roteiro.
- Registro de logs para auditoria e rastreabilidade.
- Aviso de consentimento para uso de localização.

## Estrutura do projeto

```
index.html          Estrutura das telas e ponto de entrada da aplicação
src/css/            Camada de apresentação
  global.css        Tokens de design (cores, tipografia, raios, sombras) e base
  layout.css        Grades e estruturas de página (cabeçalho, menu, telas)
  components.css    Componentes reutilizáveis (botões, cards, badges, alertas)
  pages.css         Estilos específicos de cada tela
src/js/             Camada de comportamento
  state.js          Estado da aplicação em memória
  app.js            Renderização das telas a partir do estado
  events.js         Tratamento de eventos de interface
  elements.js       Utilitários de DOM e formatação
  map.js, routes.js, recommendations.js, itinerary.js,
  ratings.js, notifications.js, pdf.js  Módulos por área funcional
src/js/api/         Camadas de integração preparadas para provedores externos
src/data/           Dados mockados que sustentam a demonstração
src/assets/         Imagens e ícones da identidade visual
```

## Arquitetura e decisões de projeto

A aplicação adota uma separação clara de responsabilidades. O estado vive de forma centralizada em `state.js`; `app.js` apenas lê esse estado e renderiza as telas; `events.js` concentra o tratamento das interações do usuário. Essa divisão evita misturar renderização com comportamento e facilita a manutenção.

A camada de dados (`src/data`) e a camada de API (`src/js/api`) foram desenhadas para que a substituição dos mocks por serviços reais seja localizada. Os módulos de API expõem contratos estáveis (mesmos métodos e formatos de retorno previstos para o futuro), de modo que a conexão com Mapbox ou HERE (mapa), OpenWeather (clima), Foursquare (lugares), Google Calendar (agenda) e o backend próprio possa ocorrer sem reescrever as telas.

O mapa é renderizado de forma visual, com coordenadas em porcentagem em vez de georreferenciamento, o suficiente para validar a lógica de camadas e marcadores antes da integração com um provedor real.

## Observação

As camadas de API ainda não realizam requisições reais, de forma intencional: elas funcionam como pontos de encaixe para os provedores externos e para o backend próprio, a serem definidos na etapa seguinte do projeto.
