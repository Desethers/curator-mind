import Link from "next/link";
import { theme } from "../../lib/theme";

export default function ContactPage() {
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
            Contact
          </p>
          <h1 style={{ fontSize: 30, lineHeight: 1.2, marginBottom: 18, color: theme.colors.ink }}>
            Discutons de la façon dont Curator Mind peut s&apos;intégrer à votre pratique.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.colors.inkSoft, marginBottom: 24 }}>
            Laissez quelques mots sur votre contexte (collection privée, galerie, lieu culturel…) et la façon dont vous imaginez utiliser
            l&apos;outil. Nous reviendrons vers vous avec une proposition concrète.
          </p>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 520,
            }}
          >
            <label style={{ fontSize: 14, color: theme.colors.ink }}>
              Nom
              <input
                type="text"
                required
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${theme.colors.accentBorder}`,
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ fontSize: 14, color: theme.colors.ink }}>
              Email
              <input
                type="email"
                required
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${theme.colors.accentBorder}`,
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ fontSize: 14, color: theme.colors.ink }}>
              Message
              <textarea
                required
                rows={5}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${theme.colors.accentBorder}`,
                  fontSize: 14,
                  resize: "vertical",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: "12px 22px",
                borderRadius: 999,
                border: "none",
                backgroundColor: theme.colors.ink,
                color: theme.colors.white,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Envoyer
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

