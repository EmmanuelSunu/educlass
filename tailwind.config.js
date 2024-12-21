/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage : {
        'login': "url(/src/assets/images/login.jpeg)",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Add Poppins font
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }], // Heading 1
        h2: ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        h3: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        h4: ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }],
        h5: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        h6: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        p: ['1rem', { lineHeight: '1rem', fontWeight: '400' }],
        span: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // For spans or small text
      },
      colors: {
        primary: '#2A9F06',
        secondary: '#64748B',
        accent: '#D97706',
        dark: '#364a63',
        muted: '#6B7280', // For less prominent text
      },
  },
  plugins: [],
}
};
