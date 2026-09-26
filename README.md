# Kindred

Kindred helps people discover verified ways to support communities responding to current emergencies.

## Start the local prototype

```bash
npm start
```

Open <http://localhost:3000>.

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

## Next production steps

1. Move `schema.sql` into a managed PostgreSQL/Supabase migration.
2. Replace the JSON API with authenticated server-side database queries.
3. Build an admin moderation dashboard for events and organizations.
4. Add source attribution, verification timestamps, expiry rules, and audit logs.
5. Reuse the API and shared types from a React Native/Expo iOS client.
# kindred
