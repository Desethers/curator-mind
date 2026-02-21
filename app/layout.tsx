import type { ReactNode } from "react";
import "../styles/globals.css";
import { theme } from "../lib/theme";

export const metadata = {
  title: "Curator Mind",
  description: "Trouvez l'œuvre qui vous correspond.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: theme.colors.bg,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.sans,
        }}
      >
        {children}
      </body>
    </html>
  );
}

