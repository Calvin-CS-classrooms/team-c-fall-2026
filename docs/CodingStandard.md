# Calvin Ratings Coding Standard

These standards apply to the Calvin Ratings React Native/Expo client, the Node.js/Express server, and project documentation. Team members should follow the existing conventions in the part of the project they are modifying and keep changes focused, readable, and maintainable.

## Language, Naming, and Formatting

- Use TypeScript for the React Native/Expo client and JavaScript for the current Node.js/Express server.
- In TypeScript, use explicit and useful types when data crosses module or component boundaries.
- Use `interface` for object structures such as `CampusLocation` and `UserRating`, and use `type` for unions, aliases, and composed types.
- Avoid unnecessary use of `any`. Use a specific type or `unknown` with validation when the value is not known.
- Use `PascalCase` for React components, interfaces, and type aliases.
- Use `camelCase` for variables, functions, properties, hooks, and constants.
- Name files clearly according to their purpose and follow the naming conventions already used in the surrounding directory.
- Keep Expo Router filenames compatible with Expo Router conventions.
- Follow the formatting already used in the file being modified. Keep indentation consistent and remove unused imports, variables, and unnecessary code.

## React Native and Expo

- Use function components for React Native components.
- Keep components focused on a clear responsibility and extract reusable components or helper functions when appropriate.
- Reuse existing types, data modules, theme values, and UI components instead of creating unnecessary duplicates.
- Keep screens focused mainly on presentation and user interaction.
- Put reusable API calls in `src/services/` and shared data or transformations in appropriate `src/data/` or utility modules.
- Keep platform-specific behavior explicit and compatible with Expo.
- Client image assets using `require()` should remain client-side. The API should return a serializable identifier such as `imageKey`, which the client can map to the appropriate local image.
- Preserve the application's local mock-data fallback while the REST API integration is being developed.

## Server and REST API

- The current server uses Node.js, Express, CommonJS modules, Jest, and Supertest. New server code should follow these existing conventions unless the team agrees to change the architecture.
- Keep route handlers focused and easy to understand.
- Store shared mock data in dedicated data files instead of duplicating it inside routes.
- Use resource-oriented REST paths under `/api`.
- Keep the three server layers separate, and only call downward:
  - `routes/` handles HTTP only: read params, call a service, map the result to a status code. No queries or calculations.
  - `services/` holds business logic: derived values (such as `overallRating`) and combining related rows. It calls only the repository facade in `data/index.js`, never Supabase directly.
  - `data/` holds the database access layer. Each function runs one query and returns raw rows or throws the Supabase error. `supabase-repository.js` and `mock-repository.js` must export the same functions and return the same shapes.
- Use camelCase for database tables and columns (`spaceId`, `spaceAmenities`) so rows match the API and client types without renaming. Keep [`supabase/schema.sql`](../supabase/schema.sql) and [`DatabaseDesign.jpg`](DatabaseDesign.jpg) up to date when the schema changes.
- Read configuration from `process.env`, loaded from `server/.env`. Never commit `.env` or a Supabase key; document each new variable in `server/.env.example`. The service role key stays on the server and is never sent to the client.
- Unit test services with `jest.mock("../data")` so each test controls the rows it gets. Test the Supabase repository with a mocked `@supabase/supabase-js`. Tests must never need a live database.
- Add every new package with `npm install <name>` so it is saved in `package.json`; CI runs `npm ci` and fails on anything missing.

Examples:

```text
GET /api/locations
GET /api/locations/:id
