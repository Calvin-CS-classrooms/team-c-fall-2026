# Calvin Ratings REST API

Base URL (local development): `http://localhost:3000/api`

All endpoints are read-only `GET` requests that return JSON. CORS allows only the Expo web client at `http://localhost:8081`.

## Architecture

```text
routes/            HTTP only: parse params, map results to status codes
  -> services/campus-service.js   business logic: derive metrics, nest related rows
    -> data/index.js              picks the repository from USE_MOCK_DATA
      -> data/supabase-repository.js   queries Supabase (supabase-js)
      -> data/mock-repository.js       serves server/data-mock/*.js
```

Both repositories return the same row shapes, so the API responses are identical with mock data and with Supabase. The schema is in [`supabase/schema.sql`](../supabase/schema.sql) and the diagram in [`DatabaseDesign.jpg`](DatabaseDesign.jpg).

## Errors

| Status | When | Body |
|---|---|---|
| `404` | A single resource (`/locations/:id`, `/spaces/:id`) does not exist, or the path is unknown | `{ "error": "Location not found" }` / `{ "error": "Space not found" }` |
| `500` | The database query failed | `{ "error": "<database error message>" }` |

List endpoints filtered by an id that matches nothing return `200` with `[]`, not `404`.

## Derived space metrics

Every space returned by `/locations` and `/spaces` includes three fields computed from its ratings by the business logic layer. Values stored on the row are always overwritten.

| Field | Rule | With no ratings |
|---|---|---|
| `overallRating` | Average of `numStars`, rounded to 1 decimal | `0` |
| `crowdRating` | `crowdRating` of the most recent rating (0–100) | `0` |
| `currentNoiseLevel` | `perceivedNoise` of the most recent rating | `null` |

Noise levels are `whisper`, `lowBuzz`, `social`, `loud`.

## Locations

### `GET /locations`

Returns every location, each with its `floors` and enriched `spaces` nested inside.

### `GET /locations/:id`

Returns one location in the same shape, or `404`.

```json
{
  "id": 1,
  "name": "Prince Conference Center",
  "image": "prince-conference",
  "description": "A modern conference and event venue...",
  "numFloors": 3,
  "numSpaces": 24,
  "hours": { "openingTime": "07:00", "closingTime": "22:00" },
  "floors": [
    { "id": 1, "locationId": 1, "name": "Grand Atrium", "noiseLevel": "social" }
  ],
  "spaces": [
    {
      "id": 1, "locationId": 1, "categoryId": 4, "floorId": 1,
      "name": "Prince Grand Atrium",
      "description": "Open seating beneath the glass roof...",
      "noiseLevel": "social", "spotSuggestionId": null,
      "overallRating": 0, "crowdRating": 0, "currentNoiseLevel": null
    }
  ]
}
```

`image` is a key the client maps to a bundled image (see `client/src/services/locations-api.ts`).

## Spaces

| Endpoint | Returns |
|---|---|
| `GET /spaces` | Every space, with derived metrics |
| `GET /spaces/:id` | One space with derived metrics, or `404` |
| `GET /spaces/location/:locationId` | Spaces at one location, with derived metrics (`[]` if none) |

## Ratings

| Endpoint | Returns |
|---|---|
| `GET /ratings` | Every rating |
| `GET /ratings/space/:spaceId` | Ratings for one space (`[]` if none) |

```json
{
  "id": 1, "userId": 1, "spaceId": 6,
  "createdAt": "2026-11-12T20:28:43.651Z",
  "numStars": 5, "crowdRating": 15, "perceivedNoise": "whisper",
  "description": "The quiet floor was completely empty this afternoon.",
  "numUpvotes": 8
}
```

`userId` is `null` when the author has deleted their account.

## Favorites

`GET /favorites/user/:userId` returns that user's saved spaces as `{ "userId", "spaceId", "createdAt" }` rows (`[]` if none).

## Notifications

`GET /notifications/user/:userId` returns that user's notifications (`[]` if none):

```json
{
  "id": 1, "userId": 1, "spaceId": 6,
  "createdAt": "2026-11-12T19:58:43.651Z",
  "message": "Van Reken Quiet Floor just opened up.",
  "type": "openSpot", "isRead": false
}
```

`type` is one of `openSpot`, `suggestionApproved`, `systemNotification`.

## Reference data

| Endpoint | Returns |
|---|---|
| `GET /reference/amenities` | `[{ "id", "name" }]`, e.g. Wi-Fi, Outlets |
| `GET /reference/categories` | `[{ "id", "name" }]`: study, social, athletics, events |

## Known gaps

- **No write endpoints yet.** Creating ratings, favorites and suggestions still happens only in the client's local state.
- **`hours` is mock-only.** Locations from `data-mock` include `hours`, but the `locations` table has no hours columns (they are planned to come from Google hours). With Supabase, `hours` is missing from responses.
- **Non-numeric ids.** With mock data, `/locations/abc` returns `404`. With Supabase, Postgres rejects `"abc"` as an integer, so the same request returns `500`.
