import { theme } from "../lib/theme";

const WORKS = [
  {
    title: "Chromatique I",
    artist: "Artiste A",
    medium: "Acrylique sur toile",
  },
  {
    title: "Silence minéral",
    artist: "Artiste B",
    medium: "Photographie argentique",
  },
  {
    title: "Figure en suspens",
    artist: "Artiste C",
    medium: "Huile sur toile",
  },
  {
    title: "Lignes d'horizon",
    artist: "Artiste D",
    medium: "Encre sur papier",
  },
];

export function WorksGrid() {
  return (
    <section
      id="quiz-results-grid"
      style={{
        marginTop: 28,
        borderRadius: 24,
        padding: 18,
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.accentBorder}`,
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
      }}
    >
      {WORKS.map((w) => (
        <div
          key={w.title}
          style={{
            borderRadius: 18,
            padding: 12,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.accentBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(212,160,122,0.4), rgba(142,191,154,0.4))",
              height: 96,
              marginBottom: 8,
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.ink }}>{w.title}</div>
          <div style={{ fontSize: 12, color: theme.colors.inkMuted }}>{w.artist}</div>
          <div style={{ fontSize: 11, color: theme.colors.inkSoft }}>{w.medium}</div>
        </div>
      ))}
    </section>
  );
}

