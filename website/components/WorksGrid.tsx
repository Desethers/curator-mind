import Image from "next/image";
import { theme } from "../lib/theme";

// Contenu inspiré de la première page artsy.net — images dans public/artworks
const WORKS = [
  {
    title: "90s mirror",
    artist: "France-Lise McGurn",
    medium: "Peinture",
    year: "2023",
    gallery: "Margot Samel",
    image: "/artworks/work-1.jpg",
  },
  {
    title: "Solitary Running Horse Silhouetted against Blue Mountain",
    artist: "Mitchell Funk",
    medium: "Photographie",
    year: "1979",
    image: "/artworks/work-2.jpg",
  },
  {
    title: "Rags, #18-42",
    artist: "Patrick Alston",
    medium: "Peinture",
    year: "2025",
    image: "/artworks/work-3.jpg",
  },
  {
    title: "The Bride (Mommy's Wedding Day)",
    artist: "Stephanie Hughes",
    medium: "Peinture",
    year: "2025",
    image: "/artworks/work-4.jpg",
  },
  {
    title: "Untitled",
    artist: "Wallace Berman",
    medium: "Œuvre sur papier",
    year: "1968",
    image: "/artworks/work-5.jpg",
  },
  {
    title: "New work",
    artist: "David Lynch",
    medium: "Peinture",
    image: "/artworks/work-6.jpg",
  },
  {
    title: "Composition",
    artist: "Guim Tió Zarraluki",
    medium: "Peinture",
    image: "/artworks/work-7.jpg",
  },
  {
    title: "Untitled",
    artist: "Danny Fox",
    medium: "Peinture",
    image: "/artworks/work-8.jpg",
  },
  {
    title: "Portrait",
    artist: "Amy Sherald",
    medium: "Peinture",
    image: "/artworks/work-9.jpg",
  },
  {
    title: "Interior",
    artist: "Hilary Pecis",
    medium: "Peinture",
    image: "/artworks/work-10.jpg",
  },
  {
    title: "Sculpture",
    artist: "Klára Hosnedlová",
    medium: "Textile / Sculpture",
    image: "/artworks/work-11.jpg",
  },
  {
    title: "New work",
    artist: "Louis Fratino",
    medium: "Peinture",
    image: "/artworks/work-12.jpg",
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
          key={`${w.artist}-${w.title}`}
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
              overflow: "hidden",
              position: "relative",
              height: 160,
              marginBottom: 8,
              backgroundColor: theme.colors.accentSoft,
            }}
          >
            <Image
              src={w.image}
              alt={w.title}
              fill
              sizes="(max-width: 640px) 50vw, 300px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.ink }}>
            {w.title}
          </div>
          <div style={{ fontSize: 12, color: theme.colors.inkMuted }}>
            {w.artist}
          </div>
          <div style={{ fontSize: 11, color: theme.colors.inkSoft }}>
            {w.medium}
            {w.year ? `, ${w.year}` : ""}
          </div>
          {w.gallery && (
            <div style={{ fontSize: 10, color: theme.colors.inkMuted }}>
              {w.gallery}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
