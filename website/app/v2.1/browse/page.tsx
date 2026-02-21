"use client";

import { useState } from "react";
import { V21_ARTWORKS } from "../../../lib/v21-artworks";
import { ArtworkCard } from "../../../components/v21/ArtworkCard";
import { BrowseHeader } from "../../../components/v21/BrowseHeader";
import { ExplorerSearchBar } from "../../../components/v21/ExplorerSearchBar";
import { QuizLeadCard } from "../../../components/v21/QuizLeadCard";
import { QuizModalV21 } from "../../../components/v21/QuizModalV21";
import { IdentityRevealModal } from "../../../components/v21/IdentityRevealModal";

const QUIZ_LEAD_AFTER_INDEX = 2;

export default function BrowsePage() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [identityRevealOpen, setIdentityRevealOpen] = useState(false);

  const openQuiz = () => setQuizOpen(true);

  return (
    <>
      <BrowseHeader onOpenQuiz={openQuiz} />
      <ExplorerSearchBar onOpenQuiz={openQuiz} />
      <div style={{ paddingBottom: 24 }}>
        {V21_ARTWORKS.map((artwork, index) => (
          <div key={artwork.id}>
            <ArtworkCard artwork={artwork} />
            {index === QUIZ_LEAD_AFTER_INDEX && (
              <QuizLeadCard onOpenQuiz={openQuiz} />
            )}
          </div>
        ))}
      </div>

      <QuizModalV21
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={() => {
          setQuizOpen(false);
          setIdentityRevealOpen(true);
        }}
      />
      <IdentityRevealModal
        open={identityRevealOpen}
        onClose={() => setIdentityRevealOpen(false)}
      />
    </>
  );
}
