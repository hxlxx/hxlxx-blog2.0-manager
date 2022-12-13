/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './src/**/*.{js,vue,ts}'],
  theme: {
    extend: {}
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
