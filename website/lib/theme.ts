export const theme = {
  colors: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    elevated: "#FFFFFF",
    hover: "#FFFFFF",
    ink: "#201A15",
    inkSoft: "#6A5C4E",
    inkMuted: "#9B8B7B",
    accent: "#D4A07A",
    accentSoft: "rgba(212,160,122,0.12)",
    accentBorder: "rgba(212,160,122,0.25)",
    green: "#8EBF9A",
    greenSoft: "rgba(142,191,154,0.12)",
    border: "#252320",
    white: "#FFFFFF",
    black: "#000000",
    background: "#FFFFFF",
    textPrimary: "#201A15",
    textSecondary: "#6A5C4E",
    success: "#8EBF9A",
  },
  fonts: {
    serif: "'Instrument Serif', Georgia, serif",
    sans: "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 },
  layout: { maxWidth: 960 },
} as const;

export type WebTheme = typeof theme;

