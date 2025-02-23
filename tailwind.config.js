/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],

  theme: {
    extend: {
      colors: {
        'blue-premier': '#00255C',
        'green': '#5DAB2C',
        'blue-sky' : '#0093DD',
        'oren' : '#EBA500'

      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [require('preline/plugin'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
      });
    }
  ],
}

