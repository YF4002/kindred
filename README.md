# Kindred

Kindred helps people discover verified ways to support communities responding to current emergencies.

## Run the React app locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually <http://localhost:5173>).

To build and serve the production bundle:

```bash
npm run build
npm start
```

`npm start` serves `dist/` through the existing Node server (including the API
routes below). The frontend is implemented in `src/`; the old root
`app.js` prototype is no longer used.

The browser uses preview causes when the API has no published causes yet. The server exposes:

- `GET /api/events` — ingested event records awaiting review
- `GET /api/causes` — published causes with human-approved donation links

## Ingest real humanitarian events

ReliefWeb requires an approved application name. Set it in your shell, then run:

```bash
export RELIEFWEB_APP_NAME=your-approved-app-name
npm run ingest:reliefweb
```

The importer writes normalized records to `data/events.json` with `status: "needs_review"`. This is intentional: an event feed does not prove that a donation campaign is legitimate.

Before publishing a cause, verify the organization independently and add its official donation URL to the database. Never infer or generate a donation URL from a headline.

## First hosted setup

1. In Supabase, open **SQL Editor** and run `schema.sql`.
2. In **Project Settings → API**, copy the public anon key into a local `.env` file based on `.env.example`.
3. Keep the service-role key server-only. Never commit `.env`, API keys, or database passwords.
4. In Cloudflare Pages, connect the GitHub repository with build command `npm run build` and output directory `dist`. If deploying the existing Cloudflare Worker instead, use `npm run build && npx wrangler deploy`; `wrangler.toml` scopes Worker assets to `dist/` so `node_modules` is never uploaded.
5. Add only the variables required by the deployed frontend to Pages. Run ingestion and database writes from a server-side job, not from the browser.

The current JSON API remains a local development fallback. The next backend change is to replace those JSON reads with Supabase queries and a moderated admin workflow.

## Next production steps

1. Move `schema.sql` into a managed PostgreSQL/Supabase migration.
2. Replace the JSON API with authenticated server-side database queries.
3. Build an admin moderation dashboard for events and organizations.
4. Add source attribution, verification timestamps, expiry rules, and audit logs.
5. Reuse the API and shared types from a React Native/Expo iOS client.
