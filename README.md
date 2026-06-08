# App Rigos

Application web de gestion des cartes de service du personnel RIGOS.

## Stack

- Next.js 15 avec App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- QRCode
- jsPDF et html2canvas

## Installation locale

1. Copier `.env.example` en `.env`
2. Renseigner `DATABASE_URL`, `NEXTAUTH_URL` et `NEXTAUTH_SECRET`
3. Installer et initialiser :

```bash
npm install
npx prisma db push
npm run dev
```

`prisma generate` est execute automatiquement apres `npm install`.

## Routes principales

- `/login` : page de connexion
- `/dashboard` : tableau de bord
- `/agents` : liste des agents
- `/agents/new` : creation d'un agent avec import photo passeport
- `/agents/[id]` : fiche agent
- `/cards` : liste rapide des cartes imprimables
- `/cards/[id]` : apercu carte de service au format PVC
- `/profile/[id]` : page publique de verification par QR code

## Deploiement Vercel

Le projet est pret pour Vercel. Les fichiers importants sont :

- `vercel.json` : indique a Vercel d'utiliser Next.js et `npm run build`
- `.nvmrc` : force Node.js 20
- `package.json` : lance `prisma generate` apres l'installation

Dans Vercel, ajouter ces variables d'environnement :

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require"
NEXTAUTH_URL="https://votre-domaine.vercel.app"
NEXTAUTH_SECRET="une_valeur_longue_et_aleatoire"
ADMIN_EMAIL="admin@app-rigos.local"
ADMIN_PASSWORD="mot_de_passe_admin"
OPERATOR_EMAIL="operator@app-rigos.local"
OPERATOR_PASSWORD="mot_de_passe_operateur"
```

Avant le premier deploiement en production, appliquer le schema Prisma sur la base distante :

```bash
npx prisma db push
```

## Authentification

Les identifiants sont lus depuis les variables d'environnement :

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`

## QR code et impression

Le systeme cree automatiquement un QR code a la creation d'un agent. La page carte permet de telecharger le format PVC en PDF et d'imprimer la carte.
