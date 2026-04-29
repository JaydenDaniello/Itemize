# Itemize

Itemize is a grocery planning app that helps users turn recipe ideas into grocery carts and compare estimated costs across stores. The application supports account creation, authentication, recipe browsing, cart management, store preferences, and seeded price comparisons for demo data.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- Tailwind CSS

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL

## Local Setup

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd Itemize
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` so it points to your local PostgreSQL database. The default example assumes a database named `itemize` running locally with the `postgres` user.

Generate the Prisma client, run database migrations, and seed demo data:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed:demo
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The app expects these variables in `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/itemize?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_ISSUER="itemize"
JWT_AUDIENCE="itemize-web"
```

The `.env.example` file provides a template for local configuration.

## Database And Demo Data

The Prisma schema lives in `prisma/schema.prisma`, and migrations live in `prisma/migrations`.

Run this after creating or resetting the local database:

```bash
npx prisma migrate dev
npm run seed:demo
```

The seed script creates demo stores, item prices, and recipes so the cart and store comparison flows have data to display.

## Useful Scripts

```bash
npm run dev        # start the local development server
npm run build      # create a production build
npm run start      # run the production build
npm run lint       # run ESLint
npm run seed:demo  # seed demo stores, prices, items, and recipes
```

## Database Schema

[Database ERD](docs/ERD.md)
