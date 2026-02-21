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
}

export const V2_GALLERIES: Record<string, V2Gallery> = {
  perrotin: {
    id: "perrotin",
    name: "Galerie Perrotin",
    neighborhood: "Le Marais",
    exhibition: "Corps et Silence — Nouvelles acquisitions",
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
