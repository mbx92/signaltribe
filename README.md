# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Database (Prisma)

1. Ensure `DATABASE_URL` in `.env` points to your Postgres instance.
2. Apply schema changes:

```bash
npm run db:migrate
# or push directly without migrations
npm run db:push
```

3. Seed base roles and users:

```bash
npm run db:seed
```

Generated Prisma Client lives in `app/generated/prisma`. Update models in `prisma/schema.prisma` and rerun migrations whenever schema changes.
