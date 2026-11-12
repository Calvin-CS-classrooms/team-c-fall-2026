-- Calvin Ratings database schema (Supabase / PostgreSQL).
--
-- Written from docs/DatabaseDesign.jpg and the column names used by
-- server/data/supabase-repository.js and server/data-mock/*.js.
-- If the live Supabase project has drifted from this file, regenerate it with:
--   supabase db dump --schema public > supabase/schema.sql
--
-- Identifiers are camelCase to match the API and client types, so they must be
-- double-quoted in SQL ("spaceId", not spaceid).

-- ---------------------------------------------------------------------------
-- Enumerated types
-- ---------------------------------------------------------------------------

create type "noiseLevel" as enum ('whisper', 'lowBuzz', 'social', 'loud');
create type "suggestionType" as enum ('addition', 'removal');
create type "suggestionStatus" as enum ('processed', 'beingTested', 'approved', 'rejected');
create type "notificationType" as enum ('openSpot', 'suggestionApproved', 'systemNotification');

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

create table categories (
  id   integer generated always as identity primary key,
  name varchar not null unique
);

create table amenities (
  id   integer generated always as identity primary key,
  name varchar not null unique
);

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------

create table users (
  id                   integer generated always as identity primary key,
  "firstName"          varchar not null,
  "lastName"           varchar,
  email                varchar not null unique,
  "createdAt"          timestamptz not null default now(),
  "isVerified"         boolean not null default false,
  "isAnonymous"        boolean not null default false,
  "hasLocationAccess"  boolean not null default false,
  -- Denormalized count of the user's ratings, kept for the profile screen.
  "numRatings"         integer not null default 0 check ("numRatings" >= 0),
  "allowsNotifications" boolean not null default false
);

-- ---------------------------------------------------------------------------
-- Places: a location (building) has floors, and spaces on those floors
-- ---------------------------------------------------------------------------

create table locations (
  id            integer generated always as identity primary key,
  name          varchar not null,
  -- Key of an image bundled with the client (see client/src/services/locations-api.ts).
  image         varchar,
  description   varchar,
  "numFloors"   integer not null default 1 check ("numFloors" >= 1),
  "numSpaces"   integer not null default 0 check ("numSpaces" >= 0)
);

create table floors (
  id            integer generated always as identity primary key,
  "locationId"  integer not null references locations (id) on delete cascade,
  name          varchar,
  "noiseLevel"  "noiseLevel"
);

-- A student's request to add or remove a space. Approved additions become spaces.
create table "spotSuggestions" (
  id            integer generated always as identity primary key,
  -- Kept when the author deletes their account, so the suggestion survives.
  "userId"      integer references users (id) on delete set null,
  "locationId"  integer not null references locations (id) on delete cascade,
  name          varchar not null,
  description   varchar,
  type          "suggestionType" not null,
  "createdAt"   timestamptz not null default now(),
  "numUpvotes"  integer not null default 0,
  status        "suggestionStatus" not null default 'processed'
);

create table spaces (
  id                  integer generated always as identity primary key,
  "locationId"        integer not null references locations (id) on delete cascade,
  "categoryId"        integer not null references categories (id),
  "floorId"           integer references floors (id) on delete set null,
  name                varchar not null,
  description         varchar,
  -- Typical noise level. The live level is derived from recent ratings by the
  -- business logic layer (server/services/campus-service.js).
  "noiseLevel"        "noiseLevel",
  -- Set when this space was created from an approved suggestion (one-to-one).
  "spotSuggestionId"  integer unique references "spotSuggestions" (id) on delete set null,
  -- Full image URL; locations use bundled image keys instead.
  image               varchar
);

-- Many-to-many: which amenities each space has.
create table "spaceAmenities" (
  "spaceId"    integer not null references spaces (id) on delete cascade,
  "amenityId"  integer not null references amenities (id) on delete cascade,
  primary key ("spaceId", "amenityId")
);

-- ---------------------------------------------------------------------------
-- User activity
-- ---------------------------------------------------------------------------

create table ratings (
  id                integer generated always as identity primary key,
  -- Null after the author deletes their account; the rating stays public as anonymous.
  "userId"          integer references users (id) on delete set null,
  "spaceId"         integer not null references spaces (id) on delete cascade,
  "createdAt"       timestamptz not null default now(),
  "numStars"        integer not null check ("numStars" between 1 and 5),
  -- How full the space felt, as a percentage.
  "crowdRating"     integer not null check ("crowdRating" between 0 and 100),
  "perceivedNoise"  "noiseLevel" not null,
  description       varchar,
  "numUpvotes"      integer not null default 0 check ("numUpvotes" >= 0)
);

-- Many-to-many: a user's saved spaces. The composite key prevents duplicates.
create table favorites (
  "userId"     integer not null references users (id) on delete cascade,
  "spaceId"    integer not null references spaces (id) on delete cascade,
  "createdAt"  timestamptz not null default now(),
  primary key ("userId", "spaceId")
);

create table notifications (
  id           integer generated always as identity primary key,
  "userId"     integer not null references users (id) on delete cascade,
  "spaceId"    integer references spaces (id) on delete cascade,
  "createdAt"  timestamptz not null default now(),
  message      varchar not null,
  type         "notificationType" not null,
  "isRead"     boolean not null default false
);

-- One vote per user per suggestion: +1 (keep/add) or -1.
create table "suggestionVotes" (
  "suggestionId"  integer not null references "spotSuggestions" (id) on delete cascade,
  "userId"        integer not null references users (id) on delete cascade,
  vote            integer not null check (vote in (-1, 1)),
  "createdAt"     timestamptz not null default now(),
  primary key ("suggestionId", "userId")
);

-- ---------------------------------------------------------------------------
-- Indexes on foreign keys used by the repository's .eq() filters
-- (Postgres does not index foreign keys automatically).
-- ---------------------------------------------------------------------------

create index on floors ("locationId");
create index on spaces ("locationId");
create index on spaces ("categoryId");
create index on spaces ("floorId");
create index on ratings ("spaceId");
create index on ratings ("userId");
create index on favorites ("spaceId");
create index on notifications ("userId");
create index on "spaceAmenities" ("amenityId");
create index on "spotSuggestions" ("locationId");
create index on "suggestionVotes" ("userId");

-- ---------------------------------------------------------------------------
-- Row level security
--
-- The Express server connects with the service role key, which bypasses RLS.
-- Enabling RLS with no policies blocks direct access with the public anon key,
-- so all reads and writes must go through the REST API.
-- ---------------------------------------------------------------------------

alter table categories        enable row level security;
alter table amenities         enable row level security;
alter table users             enable row level security;
alter table locations         enable row level security;
alter table floors            enable row level security;
alter table "spotSuggestions" enable row level security;
alter table spaces            enable row level security;
alter table "spaceAmenities"  enable row level security;
alter table ratings           enable row level security;
alter table favorites         enable row level security;
alter table notifications     enable row level security;
alter table "suggestionVotes" enable row level security;
