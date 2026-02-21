import Link from "next/link";
import { theme } from "../../lib/theme";

export default function ArtistsPage() {
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
            Artistes
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 18, color: theme.colors.ink }}>
            Un focus sur des artistes contemporains choisis avec soin.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: theme.colors.inkSoft, marginBottom: 24 }}>
            Curator Mind met en avant un nombre limité d&apos;artistes pour préserver une vraie ligne éditoriale : des démarches claires,
            des œuvres cohérentes, et un accompagnement sérieux sur la mise en relation.
          </p>
        </section>
      </div>
    </main>
  );
}

