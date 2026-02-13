# Guide de Migration vers Neon (PostgreSQL)

Voici les étapes pour configurer et migrer votre base de données vers **Neon**.

## 1. Créer un projet sur Neon

1.  Allez sur [Neon Console](https://console.neon.tech/).
2.  Créez un nouveau projet (ex: `fulsel-admin`).
3.  Dans le tableau de bord ("Dashboard"), récupérez votre **chaîne de connexion** (Connection String).
4.  Assurez-vous de sélectionner l'option **Pooled connection** si vous utilisez Prisma dans un environnement serverless (comme Vercel), ou **Direct connection** pour les migrations locales.
    *   *Note :* Pour `prisma migrate` ou `prisma db push`, utilisez la connexion directe (souvent port 5432). Pour le runtime de l'application, la connexion poolée (port 6543) est recommandée.

## 2. Configurer `.env`

J'ai déjà préparé votre fichier `.env`. Vous devez remplacer la valeur placeholder par votre chaîne de connexion Neon.

Ouvrez `.env` et modifiez la ligne suivante :

```env
# Remplacez ceci par votre URL Neon
DATABASE_URL="postgresql://user:password@ep-random-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## 3. Mettre à jour le Schéma Prisma

J'ai déjà configuré `prisma/schema.prisma` pour utiliser `postgresql`.

## 4. Appliquer le Schéma (Migration de Structure)

Une fois la connexion configurée, lancez la commande suivante pour créer les tables dans votre nouvelle base de données Neon :

```bash
npx prisma db push
```
*Cette commande synchronise votre schéma Prisma avec la base de données sans créer de fichier de migration historique (idéal pour le prototypage/développement).*

Ou si vous voulez gérer les migrations proprement :

```bash
npx prisma migrate dev --name init_neon
```

## 5. Régénérer le Client Prisma

Après la migration, régénérez le client pour que TypeScript prenne en compte les changements :

```bash
npx prisma generate
```

## 6. Migration des Données (Optionnel)

Si vous avez des données existantes dans MySQL que vous devez transférer vers Neon (PostgreSQL), ce n'est pas automatique avec Prisma. Vous devrez utiliser un outil tiers comme **pgloader** ou faire un script d'export/import.

Exemple avec `pgloader` (outil en ligne de commande) :

```bash
pgloader mysql://user:pass@localhost/db_name postgresql://user:pass@host/db_name
```

## En résumé

1.  Obtenez l'URL de connexion sur Neon.
2.  Mettez-la dans `.env`.
3.  Lancez `npx prisma db push`.
4.  Lancez `npx prisma generate`.
