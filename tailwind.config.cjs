/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './src/**/*.{js,vue,ts}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        'cus-in-out': 'cubic-bezier(0,.3,1,.7)'
      }
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
