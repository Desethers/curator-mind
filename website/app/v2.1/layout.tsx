import type { ReactNode } from "react";
import "../../styles/globals.css";
import "../../styles/v21.css";
import { AppStateProviderV21 } from "../../context/AppStateContextV21";
import { V21Header } from "../../components/v21/V21Header";
import { AgentFloatingLayer } from "../../components/v21/AgentFloatingLayer";

export const metadata = {
  title: "Curator Mind — Les œuvres qui vous correspondent",
  description:
    "Les œuvres qui vous correspondent. Les galeries qui vous attendent.",
};

export default function V21Layout({ children }: { children: ReactNode }) {
  return (
    <AppStateProviderV21>
      <div className="v21-app">
        <main className="v21-main" style={{ padding: "48px 24px" }}>
          <V21Header />
          {children}
        </main>
        <AgentFloatingLayer />
      </div>
    </AppStateProviderV21>
  );
}
