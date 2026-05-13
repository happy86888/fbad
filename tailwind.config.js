/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 確保所有 dynamic color classes 都被保留
  safelist: [
    'text-green-400', 'text-amber-400', 'text-red-400',
    'bg-green-400', 'bg-amber-400', 'bg-red-400',
    {
      pattern: /(text|bg|border)-(green|amber|red|pink|blue|orange|zinc|lime)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
}
