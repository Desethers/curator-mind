export interface SocialProof {
  saves: number;
  weeklyViews: number;
  similarProfiles: number;
}

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  gallery: string;
  galleryId: string;
  price: string;
  keywords: string[];
  palette: [string, string, string, string];
  socialProof?: SocialProof;
}

export const V21_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Corps Céleste #3",
    artist: "Camille Renault",
    gallery: "Galerie Perrotin",
    galleryId: "perrotin",
    price: "1 800 – 3 200 €",
    keywords: ["silence", "abstraction", "espace"],
    palette: ["#E8D5C4", "#C17B5E", "#2C1810", "#8B5A3E"],
    socialProof: { saves: 12, weeklyViews: 7, similarProfiles: 4 },
  },
  {
    id: 2,
    title: "Void #17",
    artist: "Yuki Tanaka",
    gallery: "Galerie Mennour",
    galleryId: "mennour",
    price: "2 200 – 4 500 €",
    keywords: ["minimalisme", "vide", "photographie"],
    palette: ["#1A1A2E", "#16213E", "#0F3460", "#E8E8E8"],
    socialProof: { saves: 7, weeklyViews: 23, similarProfiles: 18 },
  },
  {
    id: 3,
    title: "Racines Nomades",
    artist: "Aïcha Diallo",
    gallery: "Galerie Templon",
    galleryId: "templon",
    price: "4 500 – 8 000 €",
    keywords: ["matière", "mémoire", "textile"],
    palette: ["#D4764E", "#8B4513", "#F4A460", "#FAEBD7"],
    socialProof: { saves: 23, weeklyViews: 4, similarProfiles: 9 },
  },
  {
    id: 4,
    title: "Equilibrio VII",
    artist: "Léo Marchetti",
    gallery: "Galerie Perrotin",
    galleryId: "perrotin",
    price: "950 – 2 000 €",
    keywords: ["géométrie", "tension", "abstraction"],
    palette: ["#8B7B8E", "#2D2A3E", "#C4B8C8", "#E8E0EC"],
    socialProof: { saves: 4, weeklyViews: 18, similarProfiles: 31 },
  },
  {
    id: 5,
    title: "Lumière Fossile",
    artist: "Marie Cros",
    gallery: "Galerie Mennour",
    galleryId: "mennour",
    price: "3 000 – 5 500 €",
    keywords: ["temps", "lumière", "mémoire"],
    palette: ["#F5E6C8", "#C4A35A", "#8B6914", "#2C1F0E"],
    socialProof: { saves: 18, weeklyViews: 31, similarProfiles: 7 },
  },
  {
    id: 6,
    title: "Territoire Intime",
    artist: "Jonas Park",
    gallery: "Galerie Templon",
    galleryId: "templon",
    price: "1 200 – 2 800 €",
    keywords: ["corps", "émotion", "figuration"],
    palette: ["#8B9B8E", "#4A5E4D", "#C4D4B0", "#1C2B1E"],
    socialProof: { saves: 9, weeklyViews: 12, similarProfiles: 23 },
  },
  {
    id: 7,
    title: "Between Breaths",
    artist: "Yuki Tanaka",
    gallery: "Galerie Mennour",
    galleryId: "mennour",
    price: "3 800 – 6 000 €",
    keywords: ["silence", "vide", "minimalisme"],
    palette: ["#F5F5F5", "#CCCCCC", "#888888", "#333333"],
    socialProof: { saves: 31, weeklyViews: 9, similarProfiles: 12 },
  },
  {
    id: 8,
    title: "Ce qui reste",
    artist: "Camille Renault",
    gallery: "Galerie Perrotin",
    galleryId: "perrotin",
    price: "2 400 – 4 000 €",
    keywords: ["mémoire", "espace", "abstraction"],
    palette: ["#8B6F5E", "#D4A574", "#F2E6D9", "#3D2B1F"],
    socialProof: { saves: 12, weeklyViews: 4, similarProfiles: 18 },
  },
];
