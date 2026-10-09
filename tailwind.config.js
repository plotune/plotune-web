/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00796B',
        'primary-dark': '#00796B',
        secondary: '#5B62A7',
        ink: '#1C242B',
        'dark-bg': 'rgb(var(--color-paper) / <alpha-value>)',
        'dark-surface': 'rgb(var(--color-surface) / <alpha-value>)',
        'dark-card': 'rgb(var(--color-panel) / <alpha-value>)',
        'dark-text': 'rgb(var(--color-ink) / <alpha-value>)',
        'light-text': 'rgb(var(--color-ink) / <alpha-value>)',
        'gray-text': 'rgb(var(--color-muted) / <alpha-value>)',
      },
      boxShadow: {
        custom: '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        custom: '8px',
      },
    },
  },
  plugins: [],
}