import Link from "next/link";
import { theme } from "../../lib/theme";

export default function ExperiencePage() {
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
        <header style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontWeight: 700, letterSpacing: 2 }}>
            CURATOR MIND
          </Link>
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            <Link href="/experience">Expérience</Link>
            <Link href="/artists">Artistes</Link>
            <Link href="/about">À propos</Link>
          </nav>
        </header>

        <section>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: theme.colors.inkMuted, marginBottom: 12 }}>
            Expérience
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 18, color: theme.colors.ink }}>
            Une conversation guidée pour clarifier ce que vous aimez vraiment.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: theme.colors.inkSoft, marginBottom: 24 }}>
            L&apos;app vous pose quelques questions sur ce qui vous attire dans une œuvre, vos univers de prédilection et votre budget.
            À partir de ces signaux, Curator Mind vous propose une sélection d&apos;œuvres cohérente, comme le ferait un curateur qui vous
            connaît bien.
          </p>
        </section>
      </div>
    </main>
  );
}

