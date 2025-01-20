/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'text-shimmer': 'text-shimmer 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'text-fade': 'text-fade 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'glitch-skew': 'glitch-skew 1s infinite linear alternate-reverse',
        'glitch-movement': 'glitch-movement 0.4s infinite',
        'glitch-color': 'glitch-color 0.8s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'text-shimmer': {
          '0%, 100%': {
            'background-position': '0% center',
            'opacity': '1'
          },
          '50%': {
            'background-position': '-200% center',
            'opacity': '0.8'
          }
        },
        'text-fade': {
          '0%': {
            'opacity': '0',
            'transform': 'translateY(10px)'
          },
          '100%': {
            'opacity': '1',
            'transform': 'translateY(0)'
          }
        },
        'glitch-skew': {
          '0%': { transform: 'skew(0deg)' },
          '20%': { transform: 'skew(2deg)' },
          '40%': { transform: 'skew(-2deg)' },
          '60%': { transform: 'skew(1deg)' },
          '80%': { transform: 'skew(-1deg)' },
          '100%': { transform: 'skew(0deg)' }
        },
        'glitch-movement': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        'glitch-color': {
          '0%, 100%': { 
            textShadow: '-2px 0 #ff00ea, 2px 2px #00ffff',
            transform: 'translate(0)'
          },
          '25%': { 
            textShadow: '2px 0 #ff00ea, -2px -2px #00ffff',
            transform: 'translate(-2px, 1px)'
          },
          '50%': {
            textShadow: '-2px 0 #ff00ea, 1px 2px #00ffff',
            transform: 'translate(1px, -1px)'
          },
          '75%': {
            textShadow: '2px 0 #ff00ea, -2px -2px #00ffff',
            transform: 'translate(-1px, 2px)'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // You can add custom colors here
      },
    },
  },
  plugins: [],
}
