/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",  
  ],
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
      fontSize: {
        'heading': ['2.1875rem', { fontWeight: '600' }], /* 35px */
        'Heading3': ['1.375rem', { fontWeight: '600' }], /* 22px */
        'label4': ['0.9375rem', { fontWeight: '500' }], /* 15px */
        'label6': ['0.625rem', { fontWeight: '500' }], /* 10px */
        'label12': ['0.5625rem', { fontWeight: '300' }], /* 9px */
      },
    },
  },
  plugins: [],
}