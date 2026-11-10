/* Настройки применяются до CSS, чтобы избежать вспышки другой темы. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themes = ['auto', 'light', 'dark'];
  const densities = ['normal', 'compact'];
  const normalize = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;

  function readPreference(key, allowed, fallback) {
    try { return normalize(localStorage.getItem(key), allowed, fallback); }
    catch { return fallback; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); }
    catch { /* Интерфейс работает и при запрете хранилища. */ }
  }
  function applyTheme(choice) {
    const value = normalize(choice, themes, 'auto');
    if (value === 'auto') root.removeAttribute('data-theme');
    else root.dataset.theme = value;
    const select = document.querySelector('#theme-select');
    if (select) select.value = value;
  }
  function applyDensity(choice) {
    const value = normalize(choice, densities, 'normal');
    if (value === 'normal') root.removeAttribute('data-density');
    else root.dataset.density = value;
    const select = document.querySelector('#density-select');
    if (select) select.value = value;
  }

  applyTheme(readPreference('atlas-theme', themes, 'auto'));
  applyDensity(readPreference('atlas-density', densities, 'normal'));

  function initializeControls() {
    const themeSelect = document.querySelector('#theme-select');
    const densitySelect = document.querySelector('#density-select');
    applyTheme(readPreference('atlas-theme', themes, 'auto'));
    applyDensity(readPreference('atlas-density', densities, 'normal'));
    themeSelect.addEventListener('change', () => {
      const choice = normalize(themeSelect.value, themes, 'auto');
      applyTheme(choice);
      savePreference('atlas-theme', choice);
    });
    densitySelect.addEventListener('change', () => {
      const choice = normalize(densitySelect.value, densities, 'normal');
      applyDensity(choice);
      savePreference('atlas-density', choice);
    });
    const feedback = document.querySelector('#demo-feedback');
    document.querySelector('#demo-action').addEventListener('click', () => {
      feedback.textContent = 'Демонстрация: действие выполнено, новая заявка создана.';
    });
    document.querySelectorAll('[data-demo-message]').forEach(button => {
      button.addEventListener('click', () => { feedback.textContent = button.dataset.demoMessage; });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControls, { once: true });
  } else initializeControls();

  window.addEventListener('storage', event => {
    if (event.key === 'atlas-theme' || event.key === null) {
      applyTheme(readPreference('atlas-theme', themes, 'auto'));
    }
    if (event.key === 'atlas-density' || event.key === null) {
      applyDensity(readPreference('atlas-density', densities, 'normal'));
    }
  });
})();
