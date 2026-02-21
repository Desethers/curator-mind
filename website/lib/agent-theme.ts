/**
 * Design tokens for the Curator agent layer (v3).
 * Reference: spec — do not change without design approval.
 */
export const agentTheme = {
  colors: {
    bg: "#FFFFFF",
    surface: "#F9F8F6",
    elevated: "#F2F0ED",
    border: "#E5E2DC",
    ink: "#1A1916",
    inkSoft: "#4A4740",
    inkMuted: "#8C8880",
    accent: "#C17B5E",
    accentSoft: "rgba(193,123,94,0.08)",
  },
  fonts: {
    serif: "'Instrument Serif', Georgia, serif",
    sans: "'Manrope', Helvetica Neue, sans-serif",
  },
} as const;
