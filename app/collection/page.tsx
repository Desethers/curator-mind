import Link from "next/link";
import { theme } from "../../lib/theme";

export default function CollectionPage() {
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
          <Link href="/" style={{ fontWeight: 700, letterSpacing: 2, color: theme.colors.ink }}>
            CURATOR MIND
          </Link>
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            <Link href="/selection" style={{ color: theme.colors.inkSoft }}>Œuvres</Link>
            <Link href="/collection" style={{ color: theme.colors.ink }}>Ma collection</Link>
          </nav>
        </header>

        <section>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: theme.colors.inkMuted, marginBottom: 12 }}>
            Ma collection
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 18, color: theme.colors.ink }}>
            Vos œuvres sauvegardées
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: theme.colors.inkSoft, marginBottom: 24 }}>
            Cet espace est le vôtre. Sauvegardez les œuvres qui vous parlent lors de vos recherches pour les retrouver ici et construire votre collection.
          </p>
          <div
            style={{
              padding: 32,
              borderRadius: 24,
              border: `1px solid ${theme.colors.inkSoft}`,
              backgroundColor: theme.colors.white,
              textAlign: "center",
              color: theme.colors.inkMuted,
              fontSize: 14,
            }}
          >
            Aucune œuvre sauvegardée pour le moment. Parcourez les <Link href="/selection" style={{ color: theme.colors.ink, textDecoration: "underline" }}>œuvres</Link> et enregistrez celles qui vous intéressent.
          </div>
        </section>
      </div>
    </main>
  );
}
