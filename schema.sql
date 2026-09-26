create type verification_status as enum ('pending', 'verified', 'rejected');
create type editorial_status as enum ('needs_review', 'published', 'expired', 'rejected');

create table events (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  source text not null,
  title text not null,
  summary text,
  category text,
  country text,
  region text,
  latitude double precision,
  longitude double precision,
  severity text,
  source_url text not null,
  occurred_at timestamptz,
  last_seen_at timestamptz not null default now(),
  status editorial_status not null default 'needs_review',
  unique (source, external_id)
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text not null,
  donation_url text not null,
  registration_id text,
  verification_source text,
  verification_status verification_status not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table causes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id),
  organization_id uuid not null references organizations(id),
  title text not null,
  description text not null,
  donation_url text not null,
  editorial_status editorial_status not null default 'needs_review',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index causes_published_idx on causes (editorial_status, expires_at);
create index events_location_idx on events (country, region);
