import type { Config } from "tailwindcss";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ws: withAlpha("--c-ws"),
        surface: withAlpha("--c-surface"),
        surface2: withAlpha("--c-surface2"),
        line: withAlpha("--c-line"),
        fg: withAlpha("--c-fg"),
        muted: withAlpha("--c-muted"),
        accent: withAlpha("--c-accent"),
        "accent-fg": withAlpha("--c-accent-fg"),
        danger: withAlpha("--c-danger"),
        warn: withAlpha("--c-warn"),
        pastel: {
          pink: "#FBE8F7",
          lavender: "#E8DDFD",
          sky: "#DCEBFF",
          pinkSoft: "#FDF5FC",
          lavenderSoft: "#F4EFFE",
          skySoft: "#EFF5FF",
        },
        navy: {
          DEFAULT: "#11172B",
          950: "#090D1A",
          900: "#11172B",
          850: "#171F38",
          800: "#1D284B",
          700: "#2B3C6E",
          600: "#3F5496",
          500: "#5B71B5",
          400: "#8699CE",
          300: "#B4C2E4",
          200: "#D7DFF2",
          100: "#EBF0FA",
          50: "#F5F8FD",
        },
        emerald: {
          DEFAULT: "#079B73",
          accent: "#079B73",
          dark: "#057A5B",
          light: "#E6F6F2",
          border: "#A1E3D2",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "'Outfit'",
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        'pastel-sm': '0 4px 20px -2px rgba(232, 221, 253, 0.45), 0 2px 6px -1px rgba(17, 23, 43, 0.04)',
        'pastel-md': '0 12px 36px -4px rgba(232, 221, 253, 0.4), 0 4px 12px -2px rgba(17, 23, 43, 0.05)',
        'pastel-lg': '0 20px 50px -6px rgba(220, 235, 255, 0.55), 0 8px 24px -4px rgba(17, 23, 43, 0.07)',
        'input-focus': '0 0 0 4px rgba(232, 221, 253, 0.65), 0 12px 30px -5px rgba(17, 23, 43, 0.08)',
        'card': '0 10px 30px -5px rgba(17, 23, 43, 0.05), 0 1px 3px 0 rgba(17, 23, 43, 0.03)',
        'device': '0 25px 60px -15px rgba(17, 23, 43, 0.16), 0 10px 20px -5px rgba(17, 23, 43, 0.08)',
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
