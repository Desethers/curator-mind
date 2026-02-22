/**
 * Logique de recherche artistes avec synonymes et mapping espace/format.
 * Recherche dans : nom, medium, localisation, bio, statement, titres œuvres, matchReasons.
 */

import type { Artist } from "./v21-artists";
import { V21_ARTISTS } from "./v21-artists";

/** Synonymes : un terme de la query peut matcher ces mots dans le contenu */
const SYNONYMS: Record<string, string[]> = {
  calme: ["calme", "silence", "lumière", "apaise", "sérénité", "épuré", "vide", "minimalisme"],
  vibrant: ["vibrant", "tension", "couleur", "énergie", "vif"],
  mystérieux: ["mystérieux", "mystère", "mémoire", "trace", "ombre", "vide"],
  joyeux: ["joyeux", "couleur", "lumière", "vivant"],
  intime: ["intime", "corps", "émotion", "figuration", "présence"],
  puissant: ["puissant", "tension", "grand", "affirmé", "corps"],
  textures: ["textures", "matière", "sculpture", "textile", "toucher", "tactile"],
  cadeau: [], // géré par prix bas
  "premier achat": [], // géré par prix bas
  moderne: ["moderne", "abstraction", "géométrie", "minimalisme", "contemporain"],
  salon: [], // géré par sizeCategory
  bureau: [], // géré par sizeCategory
  chambre: [], // géré par sizeCategory
  entrée: [], // géré par sizeCategory
  cuisine: [], // géré par sizeCategory
};

/** Espaces → catégorie de format (pour œuvres de taille adaptée) */
const SPACE_TO_SIZE: Record<string, "petit" | "moyen" | "grand"> = {
  salon: "grand",
  bureau: "moyen",
  chambre: "moyen",
  entrée: "petit",
  cuisine: "moyen",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function textContains(haystack: string, needle: string): boolean {
  const n = normalize(haystack);
  const p = normalize(needle);
  return n.includes(p);
}

function expandQueryTerms(query: string): string[] {
  const q = normalize(query);
  const terms = q.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();
  for (const t of terms) {
    expanded.add(t);
    const syns = SYNONYMS[t];
    if (syns) for (const s of syns) expanded.add(s);
  }
  return Array.from(expanded);
}

function artistSearchText(a: Artist): string {
  const parts = [
    a.name,
    a.medium,
    a.location,
    a.bio,
    a.statement,
    ...a.matchReasons,
    ...a.artworkTitles,
  ];
  return parts.join(" ").toLowerCase();
}

function matchesQuery(artist: Artist, query: string): { match: boolean; reason: string | null } {
  const nq = normalize(query);
  const terms = nq.split(/\s+/).filter(Boolean);
  const searchText = artistSearchText(artist);
  const expandedTerms = expandQueryTerms(query);

  // Match direct (nom, phrase complète)
  if (textContains(artist.name, query) || textContains(artist.statement, query)) {
    return { match: true, reason: artist.matchReasons[0] ?? null };
  }

  // Match par synonymes dans le texte
  for (const term of expandedTerms) {
    if (term.length < 2) continue;
    if (searchText.includes(normalize(term))) {
      return { match: true, reason: artist.matchReasons[0] ?? null };
    }
  }

  // Cadeau / premier achat → prix les plus bas (on trie par minPriceNum ailleurs, ici on inclut les artistes "abordables")
  const lowPriceTerms = ["cadeau", "premier achat", "premier"];
  if (terms.some((t) => lowPriceTerms.some((l) => normalize(l).includes(t) || t.includes(normalize(l))))) {
    const threshold = 2500;
    if (artist.minPriceNum <= threshold) {
      return { match: true, reason: "Prix accessibles pour un premier achat ou un cadeau." };
    }
  }

  // Espace → taille
  for (const [space, size] of Object.entries(SPACE_TO_SIZE)) {
    if (terms.includes(space) && artist.sizeCategory === size) {
      return { match: true, reason: `Format adapté à un ${space}.` };
    }
  }

  return { match: false, reason: null };
}

export function searchArtists(query: string): { artists: Artist[]; reasonByArtist: Map<string, string | null> } {
  const q = query.trim();
  const reasonByArtist = new Map<string, string | null>();
  const matched: Artist[] = [];

  for (const artist of V21_ARTISTS) {
    const { match, reason } = matchesQuery(artist, q);
    if (match) {
      matched.push(artist);
      reasonByArtist.set(artist.id, reason);
    }
  }

  // Pour "cadeau" / "premier achat", trier par prix croissant
  const isGiftQuery =
    /\b(cadeau|premier\s*achat|premier)\b/i.test(q);
  if (isGiftQuery) {
    matched.sort((a, b) => a.minPriceNum - b.minPriceNum);
  }

  return { artists: matched, reasonByArtist };
}

/** Tranches de budget pour les filtres (minPriceNum) */
export const BUDGET_RANGES = [
  { id: "under2", label: "Moins de 2 000 €", max: 2000 },
  { id: "2-5", label: "2 000 – 5 000 €", min: 2000, max: 5000 },
  { id: "5-10", label: "5 000 – 10 000 €", min: 5000, max: 10000 },
  { id: "over10", label: "Plus de 10 000 €", min: 10000 },
] as const;

export type BudgetRangeId = (typeof BUDGET_RANGES)[number]["id"];

export interface ArtAdvisorFilters {
  query?: string;
  medium?: string;
  budgetRangeId?: BudgetRangeId;
  location?: string;
}

function inBudgetRange(artist: Artist, rangeId: BudgetRangeId): boolean {
  const range = BUDGET_RANGES.find((r) => r.id === rangeId);
  if (!range) return true;
  if ("max" in range && !("min" in range)) return artist.minPriceNum < range.max;
  if ("min" in range && !("max" in range)) return artist.minPriceNum >= range.min;
  if ("min" in range && "max" in range)
    return artist.minPriceNum >= range.min && artist.minPriceNum < range.max;
  return true;
}

export function filterArtists(filters: ArtAdvisorFilters): {
  artists: Artist[];
  reasonByArtist: Map<string, string | null>;
} {
  const { query = "", medium, budgetRangeId, location } = filters;
  const hasQuery = query.trim().length > 0;
  const { artists: searchMatches, reasonByArtist } = hasQuery
    ? searchArtists(query)
    : { artists: [...V21_ARTISTS], reasonByArtist: new Map<string, string | null>() };

  let filtered = searchMatches;
  const reasonMap = new Map(reasonByArtist);

  if (medium?.trim()) {
    const m = medium.toLowerCase();
    filtered = filtered.filter((a) => a.medium.toLowerCase().includes(m));
  }
  if (budgetRangeId) {
    filtered = filtered.filter((a) => inBudgetRange(a, budgetRangeId));
  }
  if (location?.trim()) {
    const loc = location.toLowerCase();
    filtered = filtered.filter((a) => a.location.toLowerCase().includes(loc));
  }

  return { artists: filtered, reasonByArtist: reasonMap };
}
