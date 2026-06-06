(function () {
  // Alertas contextuais: combinam os alertas mockados com regras simples de clima, horário e densidade.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  const severityLabel = {
    low: "Baixo",
    medium: "Médio",
    high: "Alto"
  };

  function getDerivedAlerts(event) {
    const alerts = [...(event.alerts || [])];
    if (event.weather.heat) {
      alerts.push({
        type: "heat",
        title: "Calor extremo",
        severity: "high",
        message: "Pontos de hidratação e locais cobertos aparecem no painel."
      });
    }
    if (event.context.simulatedHour >= "22:00" && event.context.userDistanceKm > 0.5) {
      alerts.push({
        type: "security",
        title: "Rota noturna segura",
        severity: "medium",
        message: "Rotas por vias iluminadas e transporte oficial foram priorizados."
      });
    }
    if (event.context.crowdLevel === "alta") {
      alerts.push({
        type: "crowd",
        title: "Densidade elevada",
        severity: "high",
        message: "Considere Entrada B ou caminho perimetral para reduzir espera."
      });
    }
    return alerts;
  }

  function renderAlert(alert) {
    return `
      <article class="alert-card alert-${alert.severity} alert-type-${alert.type}">
        <div>
          <span class="badge">${severityLabel[alert.severity] || alert.severity}</span>
          <h3>${UI.escapeHtml(alert.title)}</h3>
          <p>${UI.escapeHtml(alert.message)}</p>
        </div>
      </article>
    `;
  }

  function renderNotifications() {
    const event = State.getSelectedEvent();
    const target = UI.byId("notificationList");
    if (!target || !event) return;
    const alerts = getDerivedAlerts(event);
    target.innerHTML = alerts.map(renderAlert).join("");
  }

  namespace.Notifications = {
    getDerivedAlerts,
    renderAlert,
    renderNotifications
  };
})();
