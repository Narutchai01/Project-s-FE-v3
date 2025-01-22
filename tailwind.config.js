/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        Bittersweet: '#FF6F61',
        Quartz: '#4A4A4A',
        Snow: '#FCFAFD',
        Black: '#000000',
        White: '#FFFFFF',
        LightSilver: '#D9D9D9',
        BrightGray: '#EAEAEA ',
        OldSilver: '#848484'
      },
    },
  },
  plugins: [],
}