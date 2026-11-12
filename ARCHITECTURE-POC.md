# Architecture Research POC Stack

A lightweight reference stack for architecture research, rapid prototyping, and AI-assisted coding. Use the simplest implementation that can demonstrate the workflow or architectural behavior you want to explore.

## Workflow for every POC

1. **Define the problem, context, and requirements with AI.** Start from the business problem and why it matters. Work through the people and systems involved, the current and desired workflows, business rules, data, integrations, constraints, and relevant edge cases. Have AI surface missing information and ask clarifying questions. Capture the agreed scope and requirements, including what the POC should demonstrate. Keep assumptions and open questions visible.
2. **Design from the requirements with AI.** Turn the requirements into a design that covers the relevant UI flows, system boundaries, data ownership, state changes, and API or event contracts. Compare options where there is a meaningful trade-off. Use the reference stack below as a starting point and resolve design questions that would change the implementation.
3. **Vibe code from the agreed design.** Give the coding agent the requirements and design as context. Build the smallest runnable workflow and try it with representative data. When coding reveals a gap, update the requirements or design before implementing the affected behavior. Keep the POC's context, requirements, and design in one short Markdown file so later AI sessions can pick up the work.

## Default stack

| Layer | Default |
|---|---|
| Frontend | Vite + React + TypeScript |
| Frontend routing | React Router |
| Shared frontend state | Zustand |
| Styling and UI | Tailwind CSS v4 with the Vite plugin and shadcn/ui (Radix Nova) |
| Backend | Hono + TypeScript on Node.js |
| Persistence | SQLite with Drizzle ORM |
| Runtime validation and contracts | Zod |
| Workspace | pnpm |
| Communication | HTTP/REST, with events where the design calls for them |

## Frontend routing and state

- Use React Router for page navigation. The starter serves the component gallery at `/components` and the database example at `/items`.
- Use Zustand for shared client state, such as the theme preference and the Items list and its request status. Keep form drafts and demo interactions in their components. Hono and SQLite own persisted items.
- When serving the built app, serve `index.html` for frontend routes so direct links and refresh work.

## Frontend theme

- Use the current stable Tailwind CSS and shadcn CLI releases when setting up a starter. Keep the installed versions in the workspace lockfile.
- Define the shared light and dark OKLCH tokens in `apps/web/src/styles.css`. Map them to Tailwind utilities with `@theme inline` and apply dark mode with the `.dark` class. The base radius is zero.
- Keep shadcn components in `apps/web/src/components/ui` and CLI settings in `apps/web/components.json`. From the workspace root, run `pnpm --filter @poc/web exec shadcn add <component>` to add a primitive.
- Use the component gallery to preview both themes and try sample forms, dialogs, tables, charts, and controls. The Items tab demonstrates the React-to-SQLite workflow.

## System and frontend boundaries

- **Single-system POC.** Start with one frontend, one API, and one database. This fits domain rules, calculations, approval flows, and state transitions.
- **Cross-system POC.** Use one React app by default, with one API and one database per independent system. For example, the same frontend can expose `/pawnshop`, `/approvals`, and `/reports` while each feature uses its own API.
- **Data ownership.** Each system owns its schema, business rules, and persistence. APIs integrate through explicit HTTP endpoints or events. Each API reads and writes only its own database. Shared packages can hold integration contracts and generic utilities.
- **Separate frontends.** Use multiple apps when the research depends on distinct browser origins, cookie scope, SSO, microfrontends, or independent frontend deployments.

## When to adapt the stack

| Research focus | Stack choice |
|---|---|
| Domain rules, workflow, or cross-system HTTP integration | Use the default stack with a SQLite database per system. |
| Saga or orchestration | Use independent APIs with HTTP or events. Persist workflow state where the design requires it. |
| Event delivery, redelivery, retries, or ordering | Use a real broker with the delivery behavior the POC needs to demonstrate. |
| Transactional outbox | Use SQLite for the basic pattern. Use the target database and broker when their behavior matters. |
| Concurrent writes, isolation, row locking, or database-specific queries | Use the target database, such as PostgreSQL or MySQL. SQLite serializes writes to each database file. |
| SSO, cookies, or separate deployments | Use distinct browser origins and the relevant authentication flow. |
| .NET or MassTransit behavior | Use ASP.NET Core and the relevant MassTransit and broker components. |

Add infrastructure and architecture patterns such as Redis, Docker, or CQRS when the research question calls for them.

## Suggested workspace layout

```text
apps/
  web/
  pawnshop-api/
  approval-api/
  reports-api/
packages/
  contracts/
  shared/
data/
docs/
  poc.md
pnpm-workspace.yaml
package.json
```

For a single-system POC, start with `apps/web/` and one API. Use `docs/poc.md` for the problem, context, requirements, and design. Add packages and services as the POC needs them.

## Local development and sample data

- Run Vite on port `5173` and APIs on separate ports, such as `3001` through `3003`. A Vite development proxy can route `/api/pawnshop`, `/api/approvals`, and `/api/reports` to their APIs. Match each API's route prefix or configure a proxy rewrite. Use separate origins when the POC explores browser origin behavior.
- Keep schema changes in migrations. Seed disposable, representative data with stable IDs. Enable SQLite foreign-key enforcement on each connection where applicable.
- Define `pnpm dev`, `pnpm db:migrate`, and `pnpm db:seed` in each POC as needed. An optional `pnpm db:reset` can rebuild and reseed local data. Keep local database files and SQLite sidecar files out of version control.
