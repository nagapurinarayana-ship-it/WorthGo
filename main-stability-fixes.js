/* WorthGo production stability fixes: keep core app logic intact, correct edge cases after render. */
(() => {
  'use strict';

  const hardMatches = () => {
    let places = getPlaces();
    if (state.intent === 'hidden') places = places.filter(p => (p.classification || []).includes('hiddenGem'));
    if (state.filters.budget) places = places.filter(p => (p.budget?.min ?? Infinity) <= state.filters.budget);
    if (state.filters.time) places = places.filter(p => (p.duration?.min ?? Infinity) <= state.filters.time);
    if (state.filters.area && state.filters.area !== 'Any area') places = places.filter(p => p.area === state.filters.area);
    if (state.filters.venue) places = places.filter(p => p._normalized?.venueType === state.filters.venue);
    if (state.filters.food) places = places.filter(p => (p._normalized?.foodCategories || []).includes(state.filters.food));
    if (state.filters.meal) places = places.filter(p => (p._normalized?.mealTimes || []).includes(state.filters.meal));
    if (state.filters.experience) places = places.filter(p => (p._normalized?.experienceTags || []).includes(state.filters.experience));
    return places;
  };

  const showNoMatches = () => {
    const host = document.querySelector('.discover .cards');
    const discover = document.querySelector('.discover');
    if (!host || !discover) return;
    const active = !!(state.intent === 'hidden' || state.filters.budget || state.filters.time || state.filters.area && state.filters.area !== 'Any area' || state.filters.venue || state.filters.food || state.filters.meal || state.filters.experience);
    if (!active) return;
    const matches = hardMatches();
    if (matches.length) return;
    host.innerHTML = '<div class="wg-no-matches" role="status"><strong>No exact matches yet.</strong><p>Try clearing one filter or choosing a nearby option. WorthGo will not replace your choices with unrelated places.</p><button type="button" class="light-btn" data-wg-clear-all>↺ Clear filters</button></div>';
    const title = discover.querySelector('.section-intro h2');
    if (title) title.textContent = 'No exact matches';
    host.querySelector('[data-wg-clear-all]')?.addEventListener('click', () => window.resetFilters?.());
  };

  const install = () => {
    if (window.__WORTHGO_STABILITY_FIXES__) return;
    window.__WORTHGO_STABILITY_FIXES__ = true;

    const originalRender = window.renderRecommendations;
    if (typeof originalRender === 'function') {
      window.renderRecommendations = function (...args) {
        originalRender.apply(this, args);
        requestAnimationFrame(() => showNoMatches());
      };
    }

    // Correct the historical Dubai area typo wherever the dynamic quick sheet renders it.
    const normalizeDubaiAreaLabels = () => {
      document.querySelectorAll('.quick-options button, .advanced-filter option').forEach(el => {
        if (el.textContent.trim() === 'Bur Bur Dubai') {
          el.textContent = 'Bur Dubai';
          if ('value' in el) el.value = 'Bur Dubai';
        }
      });
    };
    normalizeDubaiAreaLabels();
    new MutationObserver(normalizeDubaiAreaLabels).observe(document.body, {childList:true, subtree:true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
