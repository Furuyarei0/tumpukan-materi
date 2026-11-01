/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F3EBD8",
        paper: "#FBF6E9",
        forest: "#3F5B3A",
        leaf: "#6E8B4E",
        wood: "#8A6A43",
        ink: "#2B2A24",
        mustard: "#D9A441",
        terracotta: "#C4674A",
        "dusty-blue": "#7A9BB5",
        sage: "#A9BFA0",
        "paper-sage": "#C7D4BE",
        "paper-mustard": "#E6CA82",
        "paper-terracotta": "#E0AD98",
        "paper-blue": "#B6CBD9",
      },
      fontFamily: {
        display: ["Fraunces Variable", "Georgia", "serif"],
        sans: ["DM Sans Variable", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        "elev-1": "0 1px 1px rgb(40 28 12 / .28), 0 3px 6px -1px rgb(40 28 12 / .22), 0 8px 16px -6px rgb(40 28 12 / .18)",
        "elev-2": "0 1px 2px rgb(40 28 12 / .30), 0 6px 10px -2px rgb(40 28 12 / .24), 0 16px 28px -10px rgb(40 28 12 / .28)",
        "elev-3": "0 2px 3px rgb(40 28 12 / .32), 0 12px 18px -4px rgb(40 28 12 / .26), 0 28px 44px -14px rgb(40 28 12 / .34)",
      },
      backgroundImage: {
        "paper-light": "linear-gradient(135deg, rgb(255 255 255 / .55), transparent 40%), var(--noise)",
        "paper-grid": "linear-gradient(135deg, rgb(255 255 255 / .55), transparent 40%), linear-gradient(0deg, rgb(120 90 40 / .10), transparent 35%), var(--noise), linear-gradient(#806e4b18 1px, transparent 1px), linear-gradient(90deg, #806e4b18 1px, transparent 1px)",
        "paper-task": "linear-gradient(135deg, rgb(255 255 255 / .55), transparent 40%), var(--noise), linear-gradient(#71654c26 1px, transparent 1px), linear-gradient(90deg, #71654c26 1px, transparent 1px)",
        "paper-surface": "linear-gradient(135deg, rgb(255 255 255 / .58), transparent 40%), linear-gradient(0deg, rgb(120 90 40 / .10), transparent 35%), var(--noise)",
        "wood-table": "repeating-linear-gradient(0deg, #55391c19 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, transparent 0 184px, #68472634 185px 187px, transparent 188px 374px), repeating-linear-gradient(90deg, #f8e1b016 0 2px, transparent 2px 39px), var(--noise), linear-gradient(135deg, #c59a6b, #b48452 50%, #c49a6d)",
        "board-grid": "var(--noise), linear-gradient(#dce7d536 1px, transparent 1px), linear-gradient(90deg, #dce7d536 1px, transparent 1px), linear-gradient(#dce7d516 1px, transparent 1px), linear-gradient(90deg, #dce7d516 1px, transparent 1px)",
        "deck-ground": "var(--noise), linear-gradient(#8a6a4318 1px, transparent 1px), linear-gradient(90deg, #8a6a4318 1px, transparent 1px), radial-gradient(#8a6a4314 1px, transparent 1px)",
        vignette: "radial-gradient(120% 90% at 50% 40%, transparent 58%, rgb(20 12 4 / .24))",
      },
    },
  },
  plugins: [],
};