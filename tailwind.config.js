/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        josefinSans: ['Josefin Sans', 'sans-serif'],
      },
      backgroundImage: {
        check:
          'linear-gradient(to bottom right, hsl(192, 100%, 67%),hsl(280, 87%, 65%))',
      },
      colors: {
        // Primary

        brightBlue: 'hsl(220, 98%, 61%)',

        // Neutral

        // Light Theme

        veryLightGray: 'hsl(0, 0%, 98%)',
        veryLightGrayishBlue: 'hsl(236, 33%, 92%)',
        lightGrayishBlue: 'hsl(233, 11%, 84%)',
        darkGrayishBlue: 'hsl(236, 9%, 61%)',
        veryDarkGrayishBlue: 'hsl(235, 19%, 35%)',

        // Dark Theme

        veryDarkBlue: 'hsl(235, 21%, 11%)',
        veryDarkDesaturatedBlue: 'hsl(235, 24%, 19%)',
        lightGrayishBlueD: 'hsl(234, 39%, 85%)',
        lightGrayishBlueHover: 'hsl(236, 33%, 92%)',
        darkGrayishBlueD: 'hsl(234, 11%, 52%)',
        veryDarkGrayishBlueD1: 'hsl(233, 14%, 35%)',
        veryDarkGrayishBlueD2: 'hsl(237, 14%, 26%)',
      },
    },
  },
  plugins: [],
};
