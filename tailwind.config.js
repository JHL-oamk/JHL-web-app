import colors from './src/config/colors.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        thirdly: colors.thirdly,
        highlight: colors.highlight,
        link: colors.link,
        lightGrey: colors.lightGrey,
        darkGrey: colors.darkGrey,
        cardBg: colors.cardBg,
        inputBg: colors.inputBg,
        muted: colors.darkGrey,
      }
    },
  },
  plugins: [],
}