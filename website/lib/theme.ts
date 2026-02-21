export const theme = {
  colors: {
    bg: "#FFFFFF",
    surface: "#F9F8F6",
    elevated: "#F2F0ED",
    hover: "#F9F8F6",
    ink: "#1A1916",
    inkSoft: "#4A4740",
    inkMuted: "#8C8880",
    accent: "#C17B5E",
    accentSoft: "rgba(193,123,94,0.08)",
    accentBorder: "rgba(193,123,94,0.2)",
    green: "#4A7C59",
    greenSoft: "rgba(74,124,89,0.08)",
    border: "#E5E2DC",
    white: "#FFFFFF",
    black: "#000000",
    background: "#FFFFFF",
    textPrimary: "#1A1916",
    textSecondary: "#4A4740",
    success: "#4A7C59",
  },
  fonts: {
    serif: "'Instrument Serif', Georgia, serif",
    sans: "'Manrope', Helvetica Neue, sans-serif",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 },
  layout: { maxWidth: 960 },
} as const;

export type WebTheme = typeof theme;

