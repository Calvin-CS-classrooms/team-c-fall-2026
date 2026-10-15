# Calvin Ratings Mock API

The Node/TypeScript server provides a read-only REST API backed by hardcoded mock fixtures that mirror the current client location and rating models. It does not connect to Supabase or another database. Capacity, open status, hours, and ratings are sample values, not live campus data. Metro image assets are omitted because they are client bundle references, not JSON values.

Run the server from `server/` with `npm start` (default port `3000`; set `PORT` to change it). Responses use `application/json`.

## Endpoints

| Method and path | Success response | Errors |
| --- | --- | --- |
| `GET /api/locations` | `200`, array of location objects | None |
| `GET /api/locations/:id` | `200`, one location object | `404` when the location ID does not exist |
| `GET /api/locations/:id/ratings` | `200`, array of ratings for that location; an existing location with no ratings returns `[]` | `404` when the location ID does not exist |

Unsupported HTTP methods return `405` with `Allow: GET`. Unknown routes return `404`. Error responses have the shape `{ "error": "..." }`.

Location objects contain `id`, `name`, `category`, `capacity`, `density`, `noise`, `hoursLabel`, `isOpenNow`, `rating`, `shortDescription`, `amenities`, and `floors`; `waitTimeMinutes` is optional. Rating objects follow the client `UserRating` shape, including `id`, `locationId`, `locationName`, `stars`, `capacity`, `noise`, `amenities`, `helpfulCount`, and `createdMinutesAgo`; `comment` is optional.

From `server/`, use `npm run dev` for watch mode, `npm run build` to compile, `npm run typecheck` to check TypeScript, and `npm test` to run API tests.
