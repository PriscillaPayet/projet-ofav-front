module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: { Collection: '0px 0px 15px 5px rgba(0,0,0,0.5)' },
  },
  plugins: [require('@tailwindcss/forms')],
};
