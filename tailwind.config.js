/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        backgroundColor: 'rgb(var(--background-color))',
        foreground: 'rgb(var(--foreground))',
        light: 'rgba(var(--foreground), 0.05)',
      },
      borderColor: {
        DEFAULT: 'rgba(var(--foreground), 0.1)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)']
      },
    },
  },
  plugins: [],
}

