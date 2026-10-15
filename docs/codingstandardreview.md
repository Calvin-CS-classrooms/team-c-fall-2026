# Review of Calvin Ratings Coding Standard

## Overall assessment

This is a clear, practical starting point for a multi-part project. It distinguishes the TypeScript/Expo client from the JavaScript/CommonJS server, encourages consistency with existing code, and gives useful guidance on types, mock data, component responsibilities, and REST routes. The standards are appropriately focused on maintainability rather than prescribing a large set of arbitrary rules.

## What works well

- **Project-specific guidance:** The image asset rule and the requirement to preserve a local mock-data fallback address real integration concerns for this app.
- **Good TypeScript practices:** The distinction between `interface` for object shapes and `type` for unions and aliases is easy to apply, and the advice to avoid unnecessary `any` supports safer client code.
- **Incremental architecture:** The guidance to reuse existing modules and keep screens focused helps avoid duplicate UI and data logic.
- **Server conventions are explicit:** Calling out CommonJS, Express, Jest, and Supertest should reduce inconsistencies while the current server architecture is in use.
- **Useful scope:** Covering both implementation code and documentation makes the standard relevant to the whole team.

## Recommendations

1. **Make formatting and lint expectations actionable.** Name the formatter and lint commands (or say to use the repository's configured tools), and identify whether pull requests must pass them. “Follow the formatting already used” is helpful locally but can leave inconsistent conventions between directories.
2. **Clarify test expectations.** State when client and server tests should be added, which commands to run, and whether changes to mock data or shared types need corresponding test updates.
3. **Define API/data boundaries more fully.** Specify where API clients belong, how request/response types are represented, and how errors and loading states should be surfaced. This would complement the existing recommendation to put reusable API calls in `src/services/`.
4. **Clarify mock fallback behavior.** Explain how the client chooses mock data versus API data, whether fallback is limited to development or also used after API failures, and how stale or partial data should be handled. This avoids accidental masking of server errors.
5. **Add lightweight validation and security guidance.** For example, require validation of untrusted request data, avoid logging sensitive information, and handle server errors without exposing internal details. These expectations are particularly useful for the REST server.
6. **State how temporary conventions can change.** The server guidance says “current” architecture; identify who agrees to architectural changes and how the standard should be updated when that architecture changes.
7. **Add a few concrete examples or references.** Links to representative client components, server routes, tests, and data files would make the standard easier for new contributors to follow without repeating detailed rules.

## Suggested minor edits

- Consider changing “Use TypeScript for the React Native/Expo client and JavaScript for the current Node.js/Express server” to explicitly say that existing files should retain their language unless a coordinated migration is approved.
- “Use `unknown` with validation when the value is not known” could clarify that validation should narrow the value to a useful type before it is used.
- The `imageKey` guidance is useful; consider documenting where the client maps keys to local assets and how unknown keys are handled.
- Include a brief “Before opening a pull request” checklist with relevant test, lint, and type-check commands.

## Conclusion

The standard is a solid and appropriately scoped baseline. The highest-value next improvements are to make validation commands and test expectations explicit, and to define API error/fallback behavior. Those additions would make the guidance more consistent and easier to enforce without making it burdensome.