// React and ReactDOM imports
const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useEffect } = React;

// Theme Toggle Component
function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return React.createElement(
    'div',
    { className: 'theme-toggle' },
    React.createElement(
      'button',
      { 
        onClick: toggleTheme,
        className: 'theme-toggle-btn',
        'aria-label': darkMode ? 'Switch to light mode' : 'Switch to dark mode',
        title: darkMode ? 'Switch to light mode' : 'Switch to dark mode'
      },
      React.createElement('i', { 
        className: darkMode ? 'fas fa-sun' : 'fas fa-moon' 
      })
    )
  );
}

// Mount the ThemeToggle component when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleContainer = document.getElementById('theme-toggle-container');
  if (themeToggleContainer) {
    ReactDOM.render(
      React.createElement(ThemeToggle, null),
      themeToggleContainer
    );
  }
});