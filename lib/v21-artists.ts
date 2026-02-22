/**
 * Artistes dérivés des œuvres v2.1, enrichis pour la recherche
 * (nom, medium, localisation, bio, statement, matchReasons, titres œuvres).
 */

export interface Artist {
  id: string;
  name: string;
  medium: string;
  location: string;
  bio: string;
  statement: string;
  matchReasons: string[];
  artworkTitles: string[];
  /** Prix min en nombre pour tri "cadeau" / "premier achat" */
  minPriceNum: number;
  /** Catégorie de format pour correspondance "salon", "bureau", etc. */
  sizeCategory: "petit" | "moyen" | "grand";
}

export const V21_ARTISTS: Artist[] = [
  {
    id: "camille-renault",
    name: "Camille Renault",
    medium: "Peinture, installation",
    location: "Paris",
    bio: "Artiste plasticienne, travaille le silence et l'espace vide comme langage.",
    statement: "Le silence et la lumière définissent l'espace. Je cherche la matière qui respire.",
    matchReasons: [
      "Cette exposition travaille l'espace vide comme langage. Elle correspond à votre attrait pour le silence et la matière qui respire.",
    ],
    artworkTitles: ["Corps Céleste #3", "Ce qui reste"],
    minPriceNum: 1800,
    sizeCategory: "grand",
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    medium: "Photographie",
    location: "Berlin",
    bio: "Photographe minimaliste, travaille le vide et la lumière.",
    statement: "Le vide et le minimalisme. Une lumière sobre qui invite au silence.",
    matchReasons: [
      "Abstraction et vide : une sensibilité qui résonne avec votre goût pour l'épure.",
    ],
    artworkTitles: ["Void #17", "Between Breaths"],
    minPriceNum: 2200,
    sizeCategory: "moyen",
  },
  {
    id: "aicha-diallo",
    name: "Aïcha Diallo",
    medium: "Textile, sculpture",
    location: "Paris",
    bio: "Artiste textile et sculpture, matière et mémoire.",
    statement: "La matière et la mémoire. Des textures que l'on veut toucher.",
    matchReasons: [
      "Matière et mémoire : résonne avec votre attrait pour les textures et l'émotion physique.",
    ],
    artworkTitles: ["Racines Nomades"],
    minPriceNum: 4500,
    sizeCategory: "grand",
  },
  {
    id: "leo-marchetti",
    name: "Léo Marchetti",
    medium: "Peinture",
    location: "Lyon",
    bio: "Peintre abstrait, géométrie et tension.",
    statement: "Géométrie et tension. Une abstraction vibrante.",
    matchReasons: [
      "Abstraction géométrique et tension : pour un intérieur moderne et affirmé.",
    ],
    artworkTitles: ["Equilibrio VII"],
    minPriceNum: 950,
    sizeCategory: "moyen",
  },
  {
    id: "marie-cros",
    name: "Marie Cros",
    medium: "Peinture",
    location: "Bordeaux",
    bio: "Peintre, lumière et temps.",
    statement: "La lumière fossile et le temps. Une peinture qui apaise.",
    matchReasons: [
      "Lumière et temps : une œuvre qui apaise, parfaite pour un salon ou un bureau.",
    ],
    artworkTitles: ["Lumière Fossile"],
    minPriceNum: 3000,
    sizeCategory: "grand",
  },
  {
    id: "jonas-park",
    name: "Jonas Park",
    medium: "Peinture",
    location: "Paris",
    bio: "Peintre figuratif, corps et émotion.",
    statement: "Le corps et l'émotion. Une figuration intime et puissante.",
    matchReasons: [
      "Figuration intime : correspond à votre goût pour l'émotion et la présence.",
    ],
    artworkTitles: ["Territoire Intime"],
    minPriceNum: 1200,
    sizeCategory: "moyen",
  },
];

export function getArtistById(id: string): Artist | undefined {
  return V21_ARTISTS.find((a) => a.id === id);
}

export function getArtistByName(name: string): Artist | undefined {
  return V21_ARTISTS.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );
}
