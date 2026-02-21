import Link from "next/link";
import { theme } from "../../lib/theme";

export default function AboutPage() {
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
            <Link href="/selection" style={{ color: theme.colors.inkSoft }}>Œuvres</Link>
            <Link href="/collection" style={{ color: theme.colors.inkSoft }}>Ma collection</Link>
          </nav>
        </header>

        <section>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: theme.colors.inkMuted, marginBottom: 12 }}>
            À propos
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 18, color: theme.colors.ink }}>
            Curator Mind est né d&apos;une question simple : comment décider face à tant d&apos;œuvres possibles ?
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: theme.colors.inkSoft, marginBottom: 24 }}>
            L&apos;outil est conçu comme un assistant de réflexion plutôt qu&apos;un simple catalogue. Il structure vos intuitions, vous
            aide à formuler ce que vous aimez, et prépare un échange plus riche avec les galeristes et les artistes.
          </p>
        </section>
      </div>
    </main>
  );
}

