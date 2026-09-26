import { mkdir, writeFile } from "node:fs/promises";

const appName = process.env.RELIEFWEB_APP_NAME;
if (!appName) throw new Error("RELIEFWEB_APP_NAME is required. Copy .env.example and set an approved ReliefWeb app name.");

const endpoint = `https://api.reliefweb.int/v2/disasters?appname=${encodeURIComponent(appName)}&limit=50&fields[include][]=name&fields[include][]=description&fields[include][]=date&fields[include][]=country&fields[include][]=url`;
const response = await fetch(endpoint, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error(`ReliefWeb returned ${response.status}: ${await response.text()}`);

const payload = await response.json();
const events = (payload.data || []).map(({ id, fields }) => ({
  externalId: String(id),
  source: "reliefweb",
  title: fields.name,
  summary: fields.description || "",
  countries: (fields.country || []).map((country) => country.name),
  sourceUrl: fields.url,
  occurredAt: fields.date?.created || null,
  updatedAt: new Date().toISOString(),
  status: "needs_review"
}));

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(new URL("../data/events.json", import.meta.url), `${JSON.stringify(events, null, 2)}\n`);
console.log(`Ingested ${events.length} ReliefWeb events into data/events.json.`);
