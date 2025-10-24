// Global theme controller for DevCheatHub
(function() {
  const STORAGE_KEY = 'theme';

  function isDark() {
    return document.body.classList.contains('dark-theme');
  }

  function updateToggleIcons() {
    const toggles = document.querySelectorAll('#theme-toggle-btn, #theme-toggle');
    toggles.forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (isDark()) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    updateToggleIcons();
  }

  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  function init() {
    // Initial theme
    const saved = localStorage.getItem(STORAGE_KEY) || 'light';
    applyTheme(saved);

    // Bind toggle buttons (supports both homepage and dynamic page IDs)
    const toggles = document.querySelectorAll('#theme-toggle-btn, #theme-toggle');
    toggles.forEach(btn => btn.addEventListener('click', toggleTheme));

    // Keep icons in sync when DOM changes (e.g., navigating between pages)
    document.addEventListener('DOMContentLoaded', updateToggleIcons);
  }

  // Initialize after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();