# Curator Mind — Design & CSS (référence pour prompts)

À coller ou référencer dans les futurs prompts pour garder la cohérence visuelle du site.

---

## Design tokens (site principal & v2.1)

Source : `lib/theme.ts`. Utiliser ces tokens pour tout nouveau composant (couleurs, polices, espacements, rayons).

### Couleurs
| Token | Valeur | Usage |
|-------|--------|--------|
| `colors.bg` | `#FFFFFF` | Fond de page |
| `colors.surface` | `#FFFFFF` | Surfaces (cartes, inputs) |
| `colors.elevated` | `#FFFFFF` | Surfaces surélevées (modales, dropdowns) |
| `colors.ink` | `#201A15` | Texte principal |
| `colors.inkSoft` | `#6A5C4E` | Texte secondaire |
| `colors.inkMuted` | `#9B8B7B` | Labels, hints, texte discret |
| `colors.accent` | `#D4A07A` | CTA, liens, pill identité |
| `colors.accentSoft` | `rgba(212,160,122,0.12)` | Fond des zones accent (pills, cartes quiz) |
| `colors.accentBorder` | `rgba(212,160,122,0.25)` | Bordures légères, séparateurs |
| `colors.green` | `#8EBF9A` | Succès, validation |
| `colors.white` | `#FFFFFF` | Texte sur fond sombre (boutons) |
| `colors.border` | `#252320` | Bordures fortes si besoin |

### Typographie
| Token | Valeur |
|-------|--------|
| `fonts.serif` | `'Instrument Serif', Georgia, serif` — titres, identité, citations |
| `fonts.sans` | `'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — UI, corps de texte |

### Espacements
| Token | Valeur (px) |
|-------|-------------|
| `spacing.xs` | 4 |
| `spacing.sm` | 8 |
| `spacing.md` | 12 |
| `spacing.lg` | 16 |
| `spacing.xl` | 24 |
| `spacing.xxl` | 32 |

### Rayons (border-radius)
| Token | Valeur |
|-------|--------|
| `radius.sm` | 10 |
| `radius.md` | 14 |
| `radius.lg` | 18 |
| `radius.xl` | 24 |
| `radius.pill` | 999 (boutons pill, badges) |

### Layout
| Token | Valeur | Usage |
|-------|--------|--------|
| `layout.maxWidth` | 960 | Largeur max du contenu (site v2 et v2.1) |

---

## Structure globale (site web)

- **Fond** : blanc (`#FFFFFF`).
- **Contenu** : centré, `max-width: 960px`, padding horizontal 24px (ex. `padding: 48px 24px` sur le main).
- **Polices** : Manrope par défaut, Instrument Serif pour titres et accroches.
- **Pas de thème sombre** sur le site actuel (v2 et v2.1) ; le thème sombre (`v2-theme.ts`) existe pour une éventuelle version app mobile.

---

## Patterns CSS récurrents

### Bouton principal (CTA)
- `backgroundColor: theme.colors.ink`
- `color: theme.colors.white`
- `padding: 16px 24px`, `borderRadius: 12`
- `fontWeight: 600`, `fontSize: 15 ou 16`

### Bouton secondaire / outline
- `border: 1px solid theme.colors.accentBorder`
- `color: theme.colors.ink`
- `backgroundColor: transparent` ou `theme.colors.surface`
- `padding: 16px 24px`, `borderRadius: 12`

### Cartes (cartes œuvres, galeries, quiz lead)
- `border: 1px solid theme.colors.accentBorder`
- `borderRadius: 16` (ou `theme.radius.xl`)
- `padding: 20px ou 24px`
- Fond : `theme.colors.surface` ou `theme.colors.accentSoft` pour la carte quiz

### Labels / petites majuscules
- `fontSize: 10 ou 11`
- `letterSpacing: 0.1em à 0.14em`
- `textTransform: uppercase`
- `color: theme.colors.inkMuted` ou `theme.colors.accent`

### Titres
- Serif : `fontFamily: theme.fonts.serif`, `fontSize: 18–26`, `color: theme.colors.ink`
- Sous-titres en italique : `fontStyle: 'italic'`

### Barre de recherche (type Airbnb)
- Conteneur : `backgroundColor: white`, `borderRadius: 24`, `boxShadow: 0 4px 24px rgba(0,0,0,0.08)`, `border: 1px solid theme.colors.accentBorder`
- Colonnes séparées par `borderRight: 1px solid theme.colors.accentBorder`
- Label au-dessus du contenu : petites majuscules, `inkMuted`

### Modales / bottom sheets
- Fond overlay : `rgba(0,0,0,0.6)` avec `backdropFilter: blur(4px)`
- Panneau : `borderTopLeftRadius: 24`, `borderTopRightRadius: 24`, `backgroundColor: theme.colors.surface`, `boxShadow: 0 -8px 32px rgba(0,0,0,0.4)`
- Animation : slide up (`transform: translateY(100%)` → `translateY(0)`)

---

## Fichiers à utiliser

- **Tokens** : `lib/theme.ts` — importer `theme` et utiliser `theme.colors.xxx`, `theme.fonts.xxx`, etc.
- **Layout site** : `styles/v21.css` (v2.1) ou `styles/v2.css` (v2) — classes `.v21-app` / `.v21-main` ou `.v2-app` / `.v2-main`.
- **Thème sombre (si besoin)** : `lib/v2-theme.ts` — `v2Theme` (bg #0C0B0A, surface #141312, ink #F2EDE8, accent #D4A07A).

---

## Récap une phrase

Fond blanc, ink #201A15, accent #D4A07A, Instrument Serif + Manrope, max-width 960px, bordures et pills en accentBorder/accentSoft, rayons 12–24px.
