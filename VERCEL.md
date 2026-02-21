# Déploiement Vercel

## Checklist pour que le site s’affiche

### 1. Projet Vercel

- [ ] Va sur [vercel.com](https://vercel.com) → ton projet
- [ ] **Settings → General** : **Root Directory** doit être **vide** ou **`.`** (pas `website`)
- [ ] **Settings → Git** : la branche connectée est bien celle que tu push (souvent `main`)

### 2. Déploiement

- [ ] **Deployments** : clique sur le dernier déploiement
- [ ] Le **Build** doit être **vert** (Ready). Si c’est rouge, ouvre les **Build Logs** et note l’erreur
- [ ] Une fois le build vert, ouvre l’**URL de production** (ex. `https://ton-projet.vercel.app`)

### 3. Si le build échoue

- Ouvre le déploiement → **Building** → **View build logs**
- Erreur **"Cannot find module"** → vérifier que tout est bien à la racine du repo (plus de dossier `website`)
- Erreur **"Command failed"** → dans **Settings → General**, vérifier que **Build Command** est `npm run build` (ou vide pour auto)
- Erreur **Node / npm** → dans **Settings → General**, **Node.js Version** : 18.x ou 20.x

### 4. Si le build réussit mais la page est blanche ou 404

- Teste directement : `https://ton-projet.vercel.app/v2.1`
- Vérifier qu’il n’y a pas de **redirect** ou **rewrite** qui casse (on a une redirect `/` → `/v2.1` dans `next.config.mjs`)

### 5. Variables d’environnement

Dans **Settings → Environment Variables** :

- **`ANTHROPIC_API_KEY`** : ta clé API Anthropic (pour l’agent Curateur en prod)

Sans cette clé, le site s’affiche mais les appels à Curateur échouent.

---

## Déclencher un nouveau déploiement

- **Push** sur la branche connectée : `git push origin main`
- Ou **Deployments** → **Redeploy** sur le dernier déploiement
