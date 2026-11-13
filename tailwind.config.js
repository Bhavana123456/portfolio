/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F1EE",
        frame: "#101010",
        card: "#171717",
        line: "#303030",
        ink: "#F5F3ED",
        mute: "#A5A5A5",
        sage: "#8DA58A",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: { card: "1.5rem", frame: "2.25rem" },
    },
  },
  plugins: [],
};
