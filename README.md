# Curator Mind

## Lancer en local

```bash
cd /Users/raphael/Travail/Web/curator-mind
npm install
npm run dev
```

Puis ouvre **http://localhost:3000** dans le navigateur. Tu seras redirigé vers l’app v2.1 (onboarding puis fil d’œuvres).

## Si ça ne marche pas

1. **`npm run dev` ne démarre pas**  
   Vérifie que Node est installé : `node -v` (v18 ou plus récent).

2. **Erreur de modules**  
   Supprime puis réinstalle :  
   `rm -rf node_modules .next && npm install && npm run dev`

3. **Page blanche ou 404**  
   Va directement sur http://localhost:3000/v2.1 ou http://localhost:3000/v2.1/browse

4. **Variables d’environnement**  
   Pour l’agent Curateur, crée un fichier `.env.local` à la racine avec :  
   `ANTHROPIC_API_KEY=ta_cle_api`
