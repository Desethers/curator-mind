export const v2Theme = {
  bg: "#0C0B0A",
  surface: "#141312",
  elevated: "#1C1B19",
  ink: "#F2EDE8",
  inkSoft: "#B8B0A6",
  inkMuted: "#7A7268",
  accent: "#D4A07A",
  accentSoft: "rgba(212,160,122,0.12)",
  border: "#252320",
  green: "#8EBF9A",
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Manrope', Helvetica Neue, sans-serif",
} as const;

export type V2Theme = typeof v2Theme;
