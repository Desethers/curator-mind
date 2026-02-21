import Link from "next/link";
import { theme } from "../lib/theme";
import { QuizSection } from "../components/QuizSection";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: theme.layout.maxWidth,
        }}
      >
        <header
          style={{
            marginBottom: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ fontWeight: 700, letterSpacing: 2, color: theme.colors.ink }}>
            CURATOR MIND
          </Link>
          <nav style={{ display: "flex", gap: 16, fontSize: 14, alignItems: "center" }}>
            <Link href="/selection" style={{ color: theme.colors.inkSoft }}>Œuvres</Link>
            <Link href="/collection" style={{ color: theme.colors.inkSoft }}>Ma collection</Link>
            <Link
              href="/experience"
              style={{
                color: "#F2EDE8",
                backgroundColor: "#0C0B0A",
                padding: "7px 16px",
                borderRadius: 999,
                fontWeight: 500,
                letterSpacing: "0.02em",
                fontSize: 13,
              }}
            >
              Curateur →
            </Link>
          </nav>
        </header>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.colors.inkMuted,
              marginBottom: 16,
            }}
          >
            Prêt à acheter une œuvre ? Trouvez celle qui vous correspond.
          </p>
          <QuizSection />

          <div style={{ marginTop: 48, width: "100%", maxWidth: 640 }}>
            <Link
              href="/experience"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#0C0B0A",
                borderRadius: 20,
                padding: "28px 32px",
                textDecoration: "none",
              }}
            >
              <div>
                <p style={{
                  fontFamily: theme.fonts.serif,
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "#F2EDE8",
                  margin: 0,
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}>
                  Rencontrez votre conseiller
                </p>
                <p style={{
                  fontSize: 13,
                  color: "rgba(242, 237, 232, 0.45)",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}>
                  Une conversation pour nommer ce que vous cherchez
                </p>
              </div>
              <span style={{
                fontFamily: theme.fonts.serif,
                fontStyle: "italic",
                fontSize: 28,
                color: "#D4A07A",
                marginLeft: 24,
                flexShrink: 0,
              }}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
