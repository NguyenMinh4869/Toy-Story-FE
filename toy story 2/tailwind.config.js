/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ab0007',
          darkRed: '#af0000',
          brightRed: '#c40029',
          lightRed: '#ca002a',
          orange: '#ffa500',
          darkOrange: '#ff8c00',
        },
        text: {
          dark: '#2b0000',
          gray: 'rgba(0, 0, 0, 0.41)',
          lightGray: '#454040',
        }
      },
      fontFamily: {
        'tilt-warp': ['Tilt Warp', 'sans-serif'],
        'sansation': ['Sansation', 'Noto Sans', 'sans-serif'],
        'tienne': ['Tienne', 'serif'],
        'rowdies': ['Rowdies', 'sans-serif'],
        'tilt-neon': ['Tilt Neon', 'sans-serif'],
        'thasadith': ['Thasadith', 'sans-serif'],
        'red-hat': ['Red Hat Display', 'Noto Sans', 'sans-serif'],
        'varela': ['Varela', 'sans-serif'],
        'viga': ['Viga', 'sans-serif'],
        'archivo': ['Archivo Black', 'sans-serif'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


