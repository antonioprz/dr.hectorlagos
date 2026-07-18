/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error-container": "#93000a",
        "on-secondary": "#ffffff",
        "on-background": "#1b1c1c",
        "surface-dim": "#dbd9d9",
        "inverse-surface": "#303030",
        "inverse-on-surface": "#f2f0f0",
        "tertiary-fixed-dim": "#c9c6c1",
        "on-primary-fixed-variant": "#364c3c",
        "surface-tint": "#4d6453",
        "tertiary-fixed": "#e5e2dc",
        "inverse-primary": "#b4cdb8",
        "outline": "#737973",
        "surface-container-low": "#f5f3f3",
        "surface": "#fbf9f8",
        "primary-container": "#1b3022",
        "error-container": "#ffdad6",
        "on-tertiary-container": "#95938e",
        "tertiary-container": "#2c2c28",
        "primary": "#061b0e",
        "surface-container-highest": "#e4e2e2",
        "primary-fixed": "#d0e9d4",
        "error": "#ba1a1a",
        "secondary-fixed": "#ffdeaa",
        "background": "#fbf9f8",
        "secondary-container": "#fdd79b",
        "surface-container-high": "#eae8e7",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#e5c186",
        "on-tertiary": "#ffffff",
        "surface-variant": "#e4e2e2",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#271900",
        "on-secondary-container": "#785c2b",
        "on-primary-fixed": "#0b2013",
        "on-error": "#ffffff",
        "outline-variant": "#c3c8c1",
        "on-surface": "#1b1c1c",
        "surface-container": "#efeded",
        "on-secondary-fixed-variant": "#5b4214",
        "on-surface-variant": "#434843",
        "surface-bright": "#fbf9f8",
        "on-tertiary-fixed": "#1c1c18",
        "on-primary-container": "#819986",
        "secondary": "#755a29",
        "primary-fixed-dim": "#b4cdb8",
        "tertiary": "#171814",
        "on-tertiary-fixed-variant": "#474743"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-max": "1200px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        base: "8px"
      },
      fontFamily: {
        "headline-lg": ["Playfair Display", "serif"],
        "body-md": ["Work Sans", "sans-serif"],
        "label-sm": ["Work Sans", "sans-serif"],
        "body-lg": ["Work Sans", "sans-serif"],
        "headline-lg-mobile": ["Playfair Display", "serif"],
        "display-lg": ["Playfair Display", "serif"],
        "headline-md": ["Playfair Display", "serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }]
      },
      keyframes: {
        "whatsapp-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" }
        }
      },
      animation: {
        "whatsapp-pulse": "whatsapp-pulse 1.8s ease-out infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")]
};
