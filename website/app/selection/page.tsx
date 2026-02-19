import Link from "next/link";
import { theme } from "../../lib/theme";
import { WorksGrid } from "../../components/WorksGrid";

export default function SelectionPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px 80px",
      }}
    >
      <div style={{ width: "100%", maxWidth: theme.layout.maxWidth }}>
        <header style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontWeight: 700, letterSpacing: 2 }}>
            CURATOR MIND
          </Link>
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            <Link href="/experience">Expérience</Link>
            <Link href="/artists">Artistes</Link>
            <Link href="/about">À propos</Link>
          </nav>
        </header>

        <section style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: theme.colors.inkMuted, marginBottom: 10 }}>
            Sélection d&apos;œuvres
          </p>
          <h1 style={{ fontSize: 30, lineHeight: 1.2, marginBottom: 10, color: theme.colors.ink }}>
            Une première proposition construite à partir de vos réponses.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: theme.colors.inkSoft }}>
            Voici un exemple de grille telle que pourrait la générer Curator Mind après le quizz. Les œuvres sont illustratives : dans la
            version produit, elles seraient reliées à de vrais artistes et à votre profil.
          </p>
        </section>

        <WorksGrid />
      </div>
    </main>
  );
}

