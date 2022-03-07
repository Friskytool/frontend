export default {
  plugins: [],
    theme: {
      extend: {},
      colors: {
      current: "currentColor",
      "white": "#ffffff",
      "manilla":"#f5f7fe",
      "black": "#000000",
        "grey": {
          50: "#F9FAFB",
          100: "#1f2023",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#111111",
          800: "#1F2937",
          900: "#111827"
      },
      "orange": "#ff8b58",
      "purple": "#642ad6",
      "green": "#34d69f",
    }
  },
  content: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: "class", // or 'media' or 'class'
}