import Link from "next/link";
import { theme } from "../lib/theme";
import { QuizCard } from "../components/QuizCard";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
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
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            <Link href="/experience" style={{ color: theme.colors.inkSoft }}>Expérience</Link>
            <Link href="/artists" style={{ color: theme.colors.inkSoft }}>Artistes</Link>
            <Link href="/about" style={{ color: theme.colors.inkSoft }}>À propos</Link>
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
          <QuizCard />
        </section>
      </div>
    </main>
  );
}
