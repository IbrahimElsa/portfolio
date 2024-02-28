/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: {
    content: ['./**/*.html', './**/*.js'],
  },
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
}