import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "horror-bg":    "#050505",
        "horror-bg2":   "#120000",
        "horror-bg3":   "#1a0000",
        "horror-red":   "#ff1a1a",
        "horror-glow":  "#ff3333",
        "horror-text":  "#ff4444",
        "horror-light": "#ffe0e0",
      },
      fontFamily: {
        pixel: ["var(--font-vt323)", "monospace"],
      },
      keyframes: {
        flicker: {
          "0%, 93%, 100%": { opacity: "1" },
          "94%":            { opacity: "0.82" },
          "96%":            { opacity: "0.96" },
          "98%":            { opacity: "0.78" },
          "99%":            { opacity: "0.94" },
        },
        blink: {
          "0%, 49%":  { borderColor: "#ff4444" },
          "50%, 100%":{ borderColor: "transparent" },
        },
        scanMove: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glitch1: {
          "0%":       { clipPath: "inset(80% 0 10% 0)", transform: "translate(-3px,0)" },
          "20%":      { clipPath: "inset(10% 0 70% 0)", transform: "translate(3px,0)"  },
          "40%":      { clipPath: "inset(50% 0 30% 0)", transform: "translate(-2px,0)" },
          "60%":      { clipPath: "inset(30% 0 50% 0)", transform: "translate(2px,0)"  },
          "80%, 100%":{ clipPath: "inset(0 0 0 0)",     transform: "translate(0,0)"    },
        },
        glitch2: {
          "0%":       { clipPath: "inset(20% 0 60% 0)", transform: "translate(3px,0)",  color: "#ff0055" },
          "25%":      { clipPath: "inset(60% 0 20% 0)", transform: "translate(-3px,0)", color: "#ff4400" },
          "50%":      { clipPath: "inset(5%  0 80% 0)", transform: "translate(2px,0)",  color: "#ff1a1a" },
          "75%, 100%":{ clipPath: "inset(0 0 0 0)",     transform: "translate(0,0)",    color: "inherit" },
        },
      },
      animation: {
        flicker:  "flicker 9s infinite",
        blink:    "blink 1s step-end infinite",
        scanMove: "scanMove 5s linear infinite",
        glitch1:  "glitch1 4s infinite",
        glitch2:  "glitch2 4s infinite 0.08s",
      },
    },
  },
  plugins: [],
};

export default config;
