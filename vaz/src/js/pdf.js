(function () {
  // Prévia de PDF: mostra como ficará o documento exportável quando a geração no backend existir.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  function renderPdfPreview() {
    const target = UI.byId("pdfPreview");
    if (!target) return;
    const event = State.getSelectedEvent();
    const schedule = namespace.Itinerary ? namespace.Itinerary.calculateSchedule() : [];
    const weather = event.weather;
    const selectedRoute = namespace.Routes ? namespace.Routes.getSelectedRoute() : null;
    target.innerHTML = `
      <div class="pdf-layout">
        <article class="panel pdf-actions">
          <h2>Exportação preparada</h2>
          <p>A geração real pode ser ligada ao backend depois. Por enquanto, este bloco simula a prévia e o gatilho visual.</p>
          <button class="button button-primary" type="button" id="exportPdfButton">Exportar PDF</button>
          <button class="button button-secondary" type="button" data-screen-target="final">Voltar ao roteiro</button>
        </article>
        <article class="pdf-document">
          <header>
            <span>UrbanFlow</span>
            <strong>${UI.escapeHtml(event.name)}</strong>
          </header>
          <section>
            <h2>Resumo do itinerário</h2>
            ${schedule
              .map(
                (item) => `
              <div class="pdf-row">
                <span>${item.arrival}</span>
                <strong>${UI.escapeHtml(item.title)}</strong>
                <small>Saída ${item.leave}</small>
              </div>
            `
              )
              .join("")}
          </section>
          <section class="pdf-map">
            <h2>Mapa do trajeto</h2>
            <div class="mini-map-preview">
              <span>Origem</span>
              <span>Evento</span>
              <span>Retorno</span>
            </div>
          </section>
          <section class="pdf-columns">
            <div>
              <h2>Tempo</h2>
              <p>${UI.escapeHtml(weather.condition)} - ${weather.temperature}C</p>
            </div>
            <div>
              <h2>Rota</h2>
              <p>${selectedRoute ? `${selectedRoute.distanceKm} km - ${selectedRoute.estimatedMinutes} min` : "Rota não selecionada"}</p>
            </div>
            <div class="qr-preview" aria-label="QR Code simulado">QR</div>
          </section>
        </article>
      </div>
    `;
  }

  function exportPdf() {
    State.addLog("geração de PDF", "pdf", "simulado");
  }

  namespace.Pdf = {
    renderPdfPreview,
    exportPdf
  };
})();
