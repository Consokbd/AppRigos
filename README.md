# App Rigos

Application web de gestion des cartes de service du personnel.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- QRCode
- jsPDF
- html2canvas

## Installation

1. Copier `.env.example` en `.env`
2. Remplir `DATABASE_URL` avec votre connexion PostgreSQL
3. Lancer :

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Routes principales

- `/login` : page de connexion
- `/dashboard` : tableau de bord
- `/agents` : liste des agents
- `/agents/new` : création d'un agent
- `/agents/[id]` : fiche agent
- `/cards/[id]` : aperçu carte de service
- `/profile/[id]` : page publique profil

## Authentification

Les identifiants par défaut sont définis via les variables d'environnement :

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`

## Génération de QR Code

Le système créé automatiquement un QR Code à la création d'un agent et l'enregistre avec la fiche.

## Export PDF et impression

La page de carte de service permet de télécharger le format PVC au bon ratio et d'imprimer la carte.
