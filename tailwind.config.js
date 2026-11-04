// The legacy blue/sky/indigo/purple/violet classes now resolve to a neutral graphite scale:
// the site has one action colour (graphite), and the Plotune indigo lives in --brand only.
const graphite = {
  50: '#F7F8F9', 100: '#F0F1F4', 200: '#E5E7EB', 300: '#B9BEC8', 400: '#16171B', 500: '#16171B',
  600: '#16171B', 700: '#34363D', 800: '#2A2C33', 900: '#1B1C20', 950: '#101113',
};
const teal = graphite;
const violet = graphite;

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
        primary: '#16171B',
        'primary-dark': '#34363D',
        secondary: '#5D626C',
        ink: '#16171B',
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
        cyan: statusText('#3B6EA8'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        custom: '0 1px 2px rgba(16, 18, 24, .04), 0 4px 14px rgba(16, 18, 24, .05)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
        custom: '10px',
      },
    },
  },
  plugins: [],
}