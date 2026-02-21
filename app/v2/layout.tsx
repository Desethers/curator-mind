import type { ReactNode } from "react";
import "../../styles/globals.css";
import "../../styles/v2.css";
import { AppStateProvider } from "../../context/AppStateContext";
import { V2Header } from "../../components/v2/V2Header";

export const metadata = {
  title: "Curator Mind — Vos galeries parisiennes",
  description:
    "Votre premier pas dans les galeries parisiennes. Découvrez votre profil de collectionneur.",
};

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <div className="v2-app">
        <main className="v2-main" style={{ padding: "48px 24px" }}>
          <V2Header />
          {children}
        </main>
      </div>
    </AppStateProvider>
  );
}
