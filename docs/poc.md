# Starter POC

## Problem and context

A new POC needs a working path from a browser form to persistent local data. The starter uses a generic item list so the example can be replaced with the POC's own workflow.

## Requirements

- A user can enter a title and see the saved item in the list.
- Titles must contain 1–120 characters after trimming. Invalid requests receive HTTP 400.
- Saved items survive restarts. Developers can seed the same two sample items repeatedly.

## Design

- One React screen reads and creates items through the Vite development proxy.
- Hono exposes `GET /api/items` and `POST /api/items`. The workspace contracts package holds the Zod request and response schemas.
- The API owns `data/poc.db` and its Drizzle migrations. Each item has an ID, a title, and a creation timestamp. The list is ordered newest first.
