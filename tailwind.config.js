/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: "#F5F3EC",
          paper: "#FAF8F5",
          surface: "#F0F0F0",
          border: "#CCCCCC",
          borderDark: "#111111",
          primary: "#00FF00",
          primaryHover: "#22FF22",
          textPrimary: "#333333",
          textSecondary: "#666666",
          dark: "#1A1A1A",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "Silkscreen", "monospace"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        retro: "2px 2px 0px #000000",
        "retro-sm": "1px 1px 0px #000000",
        "retro-md": "3px 3px 0px #000000",
        "retro-lg": "4px 4px 0px #000000",
        "retro-green": "0 0 10px rgba(0, 255, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
