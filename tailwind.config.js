const teal = {
  50: '#EEF6F4', 100: '#D5EAE6', 200: '#ACD5CD', 300: '#4F9E93', 400: '#00796B', 500: '#00796B',
  600: '#00695D', 700: '#00594F', 800: '#004A42', 900: '#003A34', 950: '#00261F',
};
const violet = {
  50: '#F1F1FA', 100: '#E2E3F4', 200: '#C7C9EA', 300: '#8A8ED2', 400: '#5B62A7', 500: '#5B62A7',
  600: '#4F5596', 700: '#434982', 800: '#3B406D', 900: '#2E3255', 950: '#1D2036',
};

// Status text written for the old dark theme used the light 200-400 shades,
// which fall below 4.5:1 on paper. Only those shades are darkened; tinted
// backgrounds (500/10 etc.) keep Tailwind's defaults through the deep merge.
const statusText = (color) => ({ 200: color, 300: color, 400: color });
const success = statusText('#1F6E42');
const danger = statusText('#A8261F');
const caution = statusText('#7A5200');

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
        // Legacy account/workspace screens still use Tailwind's blue and purple
        // families. Remap them onto the engineering teal and violet so those
        // screens share the palette; 400/500 are dark enough for text on paper.
        blue: teal,
        sky: teal,
        indigo: violet,
        purple: violet,
        violet,
        green: success,
        emerald: success,
        red: danger,
        rose: danger,
        amber: caution,
        yellow: caution,
        orange: caution,
        cyan: statusText('#00666F'),
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