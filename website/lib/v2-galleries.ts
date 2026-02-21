export interface VisitKitData {
  beforeEnter: string;
  phraseToSay: string;
  icebreaker: string;
}

export interface V2Gallery {
  id: string;
  name: string;
  neighborhood: string;
  exhibition: string;
  matchReason: string;
  address: string;
  arrondissement: string;
  metro: string;
  bullets: string[];
  monthlyVisitors?: number;
  visitKit?: VisitKitData;
}

export const V2_GALLERIES: Record<string, V2Gallery> = {
  perrotin: {
    id: "perrotin",
    name: "Galerie Perrotin",
    neighborhood: "Le Marais",
    exhibition: "Corps et Silence — Nouvelles acquisitions",
    monthlyVisitors: 12,
    visitKit: {
      beforeEnter:
        "Galerie blanche, lumineuse, pas de gardien à l'entrée. Juste un espace ouvert sur la rue.",
      phraseToSay:
        "Je découvre la galerie — je peux regarder l'exposition Corps et Silence ?",
      icebreaker:
        "Cette série, c'est récent dans le travail de Camille Renault ?",
    },
    matchReason:
      "Cette exposition travaille l'espace vide comme langage. Elle correspond à votre attrait pour le silence et la matière qui respire.",
    address: "76 rue de Turenne, 75003 Paris",
    arrondissement: "3e",
    metro: "Saint-Sébastien – Froissart (ligne 8)",
    bullets: [
      "Œuvres récentes d'artistes de la galerie autour du corps et du vide",
      "Sculptures et installations qui jouent avec l'échelle de l'espace",
      "Un accrochage épuré qui laisse la place au regard",
    ],
  },
  mennour: {
    id: "mennour",
    name: "Galerie Mennour",
    neighborhood: "Saint-Germain",
    exhibition: "Matière Première — 6 artistes émergents",
    monthlyVisitors: 8,
    visitKit: {
      beforeEnter:
        "Deux espaces distincts. Commencez par celui du fond — c'est là que les œuvres principales sont accrochées.",
      phraseToSay:
        "Je viens voir l'exposition Matière Première — je peux entrer ?",
      icebreaker:
        "Ces 6 artistes, c'est une première collaboration entre eux ?",
    },
    matchReason:
      "Abstraction brute et textures profondes : cette sélection d'artistes émergents résonne avec votre goût pour la matière et l'émotion physique.",
    address: "28 avenue Matignon, 75008 Paris",
    arrondissement: "8e",
    metro: "Franklin D. Roosevelt (lignes 1 et 9)",
    bullets: [
      "Six artistes émergents, peinture et sculpture",
      "Focus sur la matière et la gestuelle",
      "Dialogues entre figuration et abstraction",
    ],
  },
  templon: {
    id: "templon",
    name: "Galerie Templon",
    neighborhood: "Le Marais",
    exhibition: "Ce qui reste — Mémoire et présence",
    monthlyVisitors: 23,
    visitKit: {
      beforeEnter:
        "Grande enseigne visible depuis la rue. Espace industriel reconverti, plafonds hauts. Atmosphère détendue.",
      phraseToSay:
        "Je découvre votre programme — l'exposition Ce qui reste est encore visible ?",
      icebreaker:
        "Les œuvres de cette série, elles ont été créées spécialement pour cet espace ?",
    },
    matchReason:
      "Des œuvres qui posent des questions ouvertes et travaillent la mémoire : en phase avec votre rapport à l'émotion et à ce qui dure.",
    address: "30 rue Beaubourg, 75003 Paris",
    arrondissement: "3e",
    metro: "Rambuteau (ligne 11)",
    bullets: [
      "Œuvres autour de la mémoire et de la trace",
      "Photographie, peinture et installation",
      "Une réflexion sur la présence et l'absence",
    ],
  },
};

export const V2_GALLERY_IDS = ["perrotin", "mennour", "templon"] as const;
