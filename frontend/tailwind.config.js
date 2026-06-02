/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(15, 23, 42, 0.4)",
        'glass-inset': 'inset 0 1px 1px rgba(255,255,255,0.1)',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        'pulse-glow': "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
};
