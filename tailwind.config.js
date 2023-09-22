/** @type {import('tailwindcss').Config} */
{import('tw-elements-react/dist/plugin.cjs')}
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: ['tw-elements-react/dist/plugin.cjs'],
}

