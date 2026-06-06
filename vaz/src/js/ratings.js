(function () {
  // Avaliação de locais: fluxo simples de nota e comentário para representar o feedback dos pontos de interesse.
  const namespace = (window.UrbanFlow = window.UrbanFlow || {});
  const UI = namespace.Elements;
  const State = namespace.State;

  function renderPoiSelect() {
    const select = UI.byId("ratingPoiSelect");
    if (!select) return;
    const pois = State.getEventPOIs().filter((poi) => !["risk", "crowd"].includes(poi.category));
    select.innerHTML = pois.map((poi) => `<option value="${poi.id}">${UI.escapeHtml(poi.name)}</option>`).join("");
    if (State.state.selectedPoiId && pois.some((poi) => poi.id === State.state.selectedPoiId)) {
      select.value = State.state.selectedPoiId;
    }
  }

  function renderStars() {
    const target = UI.byId("ratingStars");
    if (!target) return;
    target.innerHTML = Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const active = value <= State.state.ratingDraft ? " is-active" : "";
      return `<button class="star-button${active}" type="button" data-rating-value="${value}" aria-label="${value} estrelas">*</button>`;
    }).join("");
  }

  function renderRatingsList() {
    const target = UI.byId("ratingsList");
    if (!target) return;
    if (!State.state.ratings.length) {
      target.innerHTML = '<div class="empty-state">Nenhuma avaliação enviada ainda.</div>';
      return;
    }
    target.innerHTML = State.state.ratings
      .map(
        (rating) => `
        <article class="rating-card">
          <div>
            <strong>${UI.escapeHtml(rating.poiName)}</strong>
            <span>${"*".repeat(rating.score)}${".".repeat(5 - rating.score)}</span>
          </div>
          <p>${UI.escapeHtml(rating.comment || "Sem comentário")}</p>
        </article>
      `
      )
      .join("");
  }

  function submitRating() {
    const poiId = UI.byId("ratingPoiSelect").value;
    const comment = UI.byId("ratingCommentInput").value.trim();
    const poi = State.getEventPOIs().find((item) => item.id === poiId);
    if (!poi) return;
    State.state.ratings.unshift({
      id: `${poiId}-${Date.now()}`,
      poiId,
      poiName: poi.name,
      score: State.state.ratingDraft,
      comment
    });
    UI.byId("ratingCommentInput").value = "";
    State.addLog("avaliação de local enviada", "ratings", "ok");
  }

  function openRatingModal(poiId) {
    const poi = State.getEventPOIs().find((item) => item.id === poiId);
    const modal = UI.byId("ratingModal");
    const text = UI.byId("ratingModalText");
    const title = UI.byId("ratingModalTitle");
    if (!poi || !modal) return;
    State.state.selectedPoiId = poi.id;
    if (title) title.textContent = poi.name;
    if (text) text.textContent = `${poi.address}. Nota atual ${poi.rating || "N/A"}.`;
    modal.classList.add("is-visible");
  }

  function closeRatingModal() {
    const modal = UI.byId("ratingModal");
    if (modal) modal.classList.remove("is-visible");
  }

  function renderRatings() {
    renderPoiSelect();
    renderStars();
    renderRatingsList();
  }

  namespace.Ratings = {
    renderRatings,
    submitRating,
    openRatingModal,
    closeRatingModal
  };
})();
