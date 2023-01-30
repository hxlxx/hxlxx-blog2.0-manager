/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './src/**/*.{js,vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionTimingFunction: {
        'cus-in-out': 'cubic-bezier(0,.3,1,.7)'
      }
    },
    boxShadow: {
      'round-lg': '0 0 10px 2px rgba(0, 0, 0, 0.1)',
      'round-lg-dark': '0 0 10px 2px rgba(255, 255, 255, 0.1)'
    }
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,val(--el-color-white))'
        }
      })
    }
  ]
}
