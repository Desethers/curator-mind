# Déploiement Vercel

L’app Next.js est à la **racine** du dépôt. Vercel détecte automatiquement le projet.

## Déclencher un déploiement

- **Push** sur la branche connectée (souvent `main`) :  
  `git push origin main`
- Ou dans l’onglet **Deployments**, cliquer sur **Redeploy** sur le dernier déploiement.

## Si tu vois une 404

- Vérifier que le **build** du dernier déploiement est **réussi** (vert).
- Si le build a échoué, ouvrir ce déploiement et consulter les **Build Logs**.

## Variables d’environnement

En production, dans **Settings → Environment Variables** :

- **`ANTHROPIC_API_KEY`** : ta clé API Anthropic (pour Curateur)

Sans cette clé, les appels à l’agent échoueront en prod.
