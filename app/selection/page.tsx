import Link from "next/link";
import { theme } from "../../lib/theme";
import { WorksGrid } from "../../components/WorksGrid";
import { SelectionHeader } from "../../components/SelectionHeader";

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
            <Link href="/selection" style={{ color: theme.colors.ink }}>Œuvres</Link>
            <Link href="/collection" style={{ color: theme.colors.inkSoft }}>Ma collection</Link>
          </nav>
        </header>

        <SelectionHeader />

        <WorksGrid />
      </div>
    </main>
  );
}

