# Guide de Déploiement Docker (Neon & Next.js)

## ⚠️ Important : Build sur Windows

Le mode `standalone` de Next.js nécessite des **privilèges administrateur sur Windows** pour créer des liens symboliques.

### Options :

1. **Développement local (Windows)** : Gardez `output: "standalone"` commenté dans `next.config.mjs` pour pouvoir builder localement.
2. **Build Docker** : Le build se fera **dans le conteneur Docker** (Linux), donc pas de problème de permissions. Vous n'avez pas besoin de faire `pnpm run build` localement.
3. **CI/CD** : Si vous utilisez GitHub Actions, GitLab CI, ou autre, le build se fera sur Linux automatiquement.

## Prérequis

1.  Avoir **Docker** installé sur votre serveur.
2.  Avoir votre base de données **Neon** configurée (voir `NEON_GUIDE.md`).
3.  Avoir les identifiants `.env` prêts.

## 1. Préparer l'environnement

Pour le déploiement Docker, **décommentez** `output: "standalone"` dans `next.config.mjs` :

```javascript
output: "standalone",
```

## 2. Construire l'image Docker

Sur votre machine locale ou votre serveur CI/CD :

```bash
docker build -t fulsel-admin .
```

Si vous êtes sur Windows et que vous voulez déployer sur Linux (VPS), utilisez :

```bash
docker build --platform linux/amd64 -t fulsel-admin .
```

**Note :** Le build se fait **dans le conteneur** (Linux), donc pas de problème de symlinks Windows.

## 3. Lancer le conteneur

Sur votre serveur de production, créez un fichier `.env.local` ou passez les variables d'environnement directement.

**Attention :** Pour Neon, assurez-vous d'utiliser l'URL **Pooled** pour le runtime (port 6543) pour éviter d'épuiser les connexions.

```bash
docker run -d \
  --name fulsel-admin \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require" \
  -e JWT_SECRET="votre_super_secret_production" \
  -e UPLOADTHING_SECRET="..." \
  -e UPLOADTHING_APP_ID="..." \
  -e UPLOADTHING_TOKEN="..." \
  fulsel-admin
```

## 4. Maintenance / Mises à jour

Lors d'une mise à jour du code :
1.  `git pull`
2.  `docker build -t fulsel-admin .`
3.  `docker stop fulsel-admin`
4.  `docker rm fulsel-admin`
5.  Relancez la commande `docker run` ci-dessus.

## 5. Alternative : Build sans Docker (pour tests locaux Windows)

Si vous voulez tester le build localement sur Windows **sans Docker** :

1. Commentez `output: "standalone"` dans `next.config.mjs`
2. Lancez `pnpm run build`
3. Lancez `pnpm run start`

Cela créera un build classique (non-standalone) qui fonctionne sans symlinks.

## Notes Importantes

*   Le conteneur tourne sur le port `3000`. Vous aurez probablement besoin d'un reverse proxy (Nginx/Apache) devant pour gérer le SSL (HTTPS) et rediriger le port 80/443 vers le port 3000.
*   Les migrations de base de données (`prisma db push` ou `migrate`) doivent idéalement être faites **avant** de lancer le nouveau conteneur, via une tache CI/CD séparée, ou manuellement.
*   **Pour le déploiement en production**, décommentez `output: "standalone"` et utilisez Docker. Le build se fera dans le conteneur Linux sans problème de permissions.
