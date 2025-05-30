// Self-invoking function to encapsulate the dark mode logic
(function() {
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  // Apply initial theme
  if (currentTheme) {
    applyTheme(currentTheme);
  } else {
    applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
  }

  // Listener for system preference changes (only if no theme is stored)
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { // Only react if no user preference is set
      applyTheme(e.matches ? 'dark' : 'light');
      const themeToggle = document.getElementById('darkModeSwitch');
      if (themeToggle) {
        themeToggle.checked = e.matches;
      }
    }
  });

  // Wait for fragments to be loaded before trying to access #darkModeSwitch
  document.addEventListener("fragmentsLoaded", () => {
    const themeToggleLoaded = document.getElementById('darkModeSwitch');

    if (themeToggleLoaded) {
      // Set initial state of the toggle based on the currently applied theme
      themeToggleLoaded.checked = document.documentElement.getAttribute('data-theme') === 'dark';

      // Add listener for user interaction with the toggle
      themeToggleLoaded.addEventListener('change', function () {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme); // Apply theme to the document
        localStorage.setItem('theme', newTheme); // Store user preference
      });
    }
  });
})();
