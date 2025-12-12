/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleur principale - Bleu foncé
        primary: {
          50: '#e6f0f5',
          100: '#cce1eb',
          200: '#99c3d7',
          300: '#66a5c3',
          400: '#3387af',
          500: '#0B4F6C', // Couleur de base
          600: '#094056',
          700: '#073041',
          800: '#05202b',
          900: '#021016',
          DEFAULT: '#0B4F6C',
          light: '#1976A5',
        },
        // Couleur secondaire - Orange
        secondary: {
          50: '#fff5e6',
          100: '#ffebcc',
          200: '#ffd699',
          300: '#ffc266',
          400: '#ffad33',
          500: '#FF8A00', // Couleur de base
          600: '#cc6e00',
          700: '#995300',
          800: '#663700',
          900: '#331c00',
          DEFAULT: '#FF8A00',
        },
        // Couleur d'accent - Teal
        accent: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688', // Couleur de base
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
          DEFAULT: '#009688',
        },
        // Couleurs de statut
        success: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2E7D32', // Couleur de base
          600: '#388e3c',
          700: '#2e7d32',
          800: '#1b5e20',
          900: '#0d3d12',
          DEFAULT: '#2E7D32',
        },
        warning: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#FFB300', // Couleur de base
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
          DEFAULT: '#FFB300',
        },
        danger: {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#D32F2F', // Couleur de base
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
          DEFAULT: '#D32F2F',
        },
        // Couleurs de surface et fond
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#ECEFF1', // Couleur de base
          DEFAULT: '#ECEFF1',
        },
        bg: {
          DEFAULT: '#F7FAFC',
          dark: '#EDF2F7',
          darker: '#E2E8F0',
        },
        text: {
          DEFAULT: '#263238',
          light: '#546E7A',
          lighter: '#78909C',
          muted: '#90A4AE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
