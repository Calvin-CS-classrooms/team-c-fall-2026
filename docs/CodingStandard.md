# Calvin Ratings Coding Standard

These standards apply to the Calvin Ratings React Native/Expo client, the Node/TypeScript server, and project documentation. Follow established patterns in the area you are changing; keep changes focused and explain exceptions in the pull request.

## TypeScript and naming

- Use TypeScript for application and server code. Prefer explicit, useful types at module boundaries and let TypeScript infer obvious local values.
- Use `interface` for extendable object shapes such as `CampusLocation` and `UserRating`; use `type` for unions, aliases, and composed types.
- Avoid `any`. Use a specific type, a generic, or `unknown` with validation when the value is not known yet.
- Use `PascalCase` for React component names, interfaces, and type aliases. Use `camelCase` for variables, functions, properties, hooks, and constants, including fixed shared data.
- Name files for their primary export. Follow the current client convention of descriptive kebab-case names for component files and camelCase names for utility, data, and test files. Keep Expo Router route filenames compatible with its route conventions.
- Use single quotes, semicolons, and the indentation and formatting already present in the surrounding file. Keep imports grouped and remove unused imports.

## React Native and Expo

- Write function components and keep rendering, state, and event handling easy to follow. Extract a component or helper when it clarifies a substantial block or enables meaningful reuse.
- Use the shared types, data modules, theme, and existing UI components before introducing duplicates. Do not copy location/rating fixtures into screens.
- Keep platform-specific behavior explicit and compatible with Expo. Treat Metro assets such as `require()` image values as client-only; do not serialize them as server JSON.
- Keep screens focused on presentation and user interaction. Put reusable data transformations and domain logic in appropriate `src/utils/` or `src/data/` modules.

## Functions, comments, and documentation

- Give functions and components names that describe their purpose. Keep functions small enough to understand and test; avoid deeply nested conditionals when early returns make the flow clearer.
- Do not duplicate logic or data without a reason. Reuse a shared helper when it prevents behavior from drifting; avoid abstractions used only once that add indirection without clarity.
- Comments should explain intent, constraints, or non-obvious decisions, not repeat the code. Add implementation documentation for tricky behavior, assumptions, and limitations (SC5), especially where a future maintainer could otherwise misuse the code.
- Update relevant documentation when an API, data contract, setup step, or user-visible behavior changes. Keep API documentation aligned with implemented routes and response shapes.

## REST API and errors

- Use resource-oriented paths under `/api`, HTTP methods according to their standard meaning, and JSON request/response bodies where applicable.
- Return an appropriate status: `200` for successful reads, `201` for created resources, `400` for malformed or invalid input, and `404` when a requested resource does not exist. Do not report success for missing data.
- Keep response shapes consistent and document identifiers, fields, and error responses. Validate inputs at the boundary and do not expose stack traces or private data in client-facing errors.
- Keep mock data clearly identified as mock data. Do not connect a real database or treat illustrative client values as live measurements unless the task explicitly changes that scope.

## Testing and quality checks

- Add or update automated tests for changed behavior, including success and relevant failure cases. Prefer deterministic tests that do not require network access or a real database.
- The client uses Jest (`npm test`) and Expo ESLint through `npm run lint`; run both from `client/` for client changes. Use the server's documented test and type-check commands for server changes.
- Keep tests readable and assert outcomes that matter to a user or API consumer. Do not weaken existing assertions merely to make a change pass.
- Do not claim a check passed unless it was run. Mention unavailable or failing checks in the pull request.

## Git and pull requests

- Never commit directly to `master`. Start each independent change from the latest `master` on a clearly named feature branch; use a stacked branch only when a change depends on another unmerged branch, and target that base explicitly.
- Make small, meaningful commits with imperative messages that describe the change, for example, `Add mock location API`.
- Open a pull request for each independently reviewable assignment or feature. Use a specific title, summarize behavior and scope, link relevant requirements when known, and list tests/checks run.
- Review the diff for unrelated files, generated artifacts, secrets, and accidental fixture or API changes before requesting review. Do not merge another person's work or rewrite shared branch history without agreement.