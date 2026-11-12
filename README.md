# Architecture POC Boilerplate

A single-system starter based on [ARCHITECTURE-POC.md](./ARCHITECTURE-POC.md). The component gallery showcases Tailwind CSS and shadcn/ui with light and dark themes. The Items tab shows how React, Hono, Zod, Drizzle, and SQLite work together.

## Run locally

Use Node.js 24 or later and the pnpm version listed in `package.json`.

```sh
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [the web app](http://127.0.0.1:5173). Vite proxies `/api` to Hono on port `3001`. The API owns the local database at `data/poc.db`.

`pnpm dev` applies pending migrations before starting the two apps. Seeding is optional and can be repeated without duplicating the example items. After changing the Drizzle schema, run `pnpm db:generate` to create a migration and `pnpm db:migrate` to apply it. Use `pnpm build` to type-check the workspace and build the web app.

## Start a POC

1. Replace the example in [docs/poc.md](./docs/poc.md) with your problem, business context, and requirements. Use AI to clarify the workflow, constraints, and open questions.
2. Use AI to design from the agreed requirements. Record the UI flow, data ownership, and integration contracts that matter for your POC in the same file.
3. Give your coding agent that document and the stack guide. Replace the example workflow with the agreed design.

The frontend lives in `apps/web`. The Hono API, SQLite schema, and migrations live in `apps/api`. Shared request and response schemas live in `packages/contracts`. When a POC adds an independent system, give it a separate API and database and integrate through explicit contracts.
