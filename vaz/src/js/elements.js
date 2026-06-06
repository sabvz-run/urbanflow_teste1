(function () {
  // Pequenos utilitários de DOM e formatação, reunidos para evitar repetir
  // querySelector, escape de texto e formatação de data em todos os módulos.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(value) {
    const date = new Date(`${value}T12:00:00`);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatNumber(value) {
    return Number(value).toLocaleString("pt-BR");
  }

  namespace.Elements = {
    $,
    $$,
    byId,
    escapeHtml,
    formatDate,
    formatNumber
  };
})();
