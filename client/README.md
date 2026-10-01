# Calvin Ratings — survey prototype

Calvin Ratings is a React Native / Expo prototype that recommends Calvin University campus spaces using student survey data. The recommendation engine evaluates survey ratings for studying, noise level, crowd level, charging outlets, seating, social use, and typical usage time.

**This prototype does not currently provide live occupancy, Wi-Fi speeds, building hours, or other real-time telemetry.** It has no current desk counts, crowd sensors, temperature measurements, coffee-line information, GPS coordinates, or walking distances. It is not a production system.

## Current functionality

- Four original survey responses: Hekman Library basement, Business building first floor, North Hall, and Johnnys.
- Deterministic, API-free recommendations, named-place questions, comparisons, multiple criteria, priorities, and supported follow-ups.
- Review-backed answers for details such as sunlight and charging near windows. Missing evidence produces a no-answer message.
- Home, recommendation, details, and map screens share the same survey records and IDs.
- Survey ratings display as percentages of the maximum score; they are not percentages of students or confidence estimates.
- The map filters surveyed places by All, Quiet, Good for studying, and Social. Its backdrop and pin positions are illustrative UI, not GPS data.
- The separate review-entry and profile flows remain UI demos using fictional fixtures. Reviews are not persisted, automatically analyzed by AI, or added to the survey dataset. The map omits the incompatible legacy Rate Spot action.

Live information, persistent community reviews, real geographic navigation, and other broader requirements remain future work. See the [SRS](../docs/SRS.md) and [vision statement](../vision-statement.md) for planned scope; those documents do not describe all current functionality.

## Dependencies and runtime

[`package.json`](package.json) is the authoritative dependency manifest; [`package-lock.json`](package-lock.json) records reproducible resolved versions. Current declared versions are:

| Package | Declared version |
| --- | --- |
| Expo | `~57.0.0` (SDK 57) |
| React Native | `0.86.3` |
| React / React DOM | `19.2.3` |
| Expo Router | `~57.0.24` |
| TypeScript | `~6.0.3` |
| React Native Reanimated | `4.5.1` |
| React Native Worklets | `0.10.1` |

The animation packages are explicitly pinned to Expo 57's bundled versions to keep their peer requirements compatible with React Native 0.86.3 and Expo Modules Core. Do not bypass dependency conflicts with `--force` or `--legacy-peer-deps`.

Use **Node.js 24.3 or newer in the 24.x line** (CI uses Node 24). The current React Native and Metro package manifests also allow Node 20.19.4+ and 22.13+ within their respective major versions.

## Run and validate

From the repository root:

```sh
cd client
npm ci
npm test
npm run lint
npm start
```

`npm ci` installs from the lockfile with a clean dependency tree. `npm test` runs the recommendation and map tests using Node's built-in test runner. `npm run lint` currently runs **`tsc --noEmit`**, not ESLint.

Platform shortcuts:

```sh
npm run android   # Android emulator or connected device
npm run ios       # iOS simulator on macOS
npm run web       # Web browser
```

Use an Expo client/development build compatible with SDK 57. No AI API key is required. GitHub Actions runs install, tests, and TypeScript checks on pushes to `master` and pull requests targeting `master`; see [Client CI](../.github/workflows/ci.yml).

## Project structure

```text
client/
├── app/                         Expo Router route adapters and tab navigation
│   ├── (tabs)/index.tsx         Home/search
│   ├── (tabs)/map.tsx           Survey map and selected-ID details routing
│   ├── recommendation.tsx      Query route
│   └── place-details.tsx       Resolves survey IDs; no default-Hekman fallback
├── assets/spaces/               Building photos and source credits
├── src/
│   ├── data/
│   │   ├── surveySpaces.ts      Actual prototype survey records and original reviews
│   │   ├── reviewFacts.ts       Human-reviewed facts with exact supporting review text
│   │   ├── mapLayout.ts         Illustrative pin positions keyed by survey-space ID
│   │   ├── spacePhotos.ts       Building photo assets and source metadata
│   │   └── mockData.ts          Fictional fixtures for legacy review/profile demos only
│   ├── utils/
│   │   ├── queryParser.ts       Criteria, locations, time, topics, negatives, priorities
│   │   ├── recommendationEngine.ts  Evidence filtering, scoring, and answer generation
│   │   ├── surveyScores.ts      Converts original 1–5 values into display percentages
│   │   └── surveyMap.ts         Survey filters, visible selection, and details route
│   ├── components/
│   │   └── SurveySpaceCard.tsx  Shared survey information and percentage display
│   ├── screens/
│   │   ├── RecommendationScreen.tsx  Dynamic results and follow-up context
│   │   └── CampusMapScreen.tsx  Illustrative pins with real survey previews
│   └── theme.ts                Shared colors
├── tests/
│   ├── recommendationEngine.test.cjs  Recommendation regression tests
│   └── surveyMap.test.cjs       Map filtering, selection, layout, and routing tests
├── app.json                    Expo configuration
├── package.json                Scripts and dependency declarations
└── package-lock.json           Reproducible dependency resolution
```

See [`docs/recommendations.md`](../docs/recommendations.md) for scoring rules, limitations, and example queries.

## Data flow and boundaries

```text
surveySpaces.ts + user question
    ↓
queryParser.ts
    ↓
recommendationEngine.ts ← reviewFacts.ts (quoted review evidence)
    ↓
RecommendationScreen.tsx
    ↓
SurveySpaceCard.tsx ← surveyScores.ts (display percentages)
```

React Native screens render results and handle navigation/context; the core recommendation logic belongs in pure TypeScript modules.

There are three distinct data categories:

1. **Survey data:** the team's four actual prototype responses and unchanged original reviews.
2. **Review facts:** manually annotated statements supported by exact source text; absence of a fact means unknown, not false.
3. **Illustrative UI data:** map positions, the map backdrop, and legacy demo fixtures. These are not observations and never enter recommendation scoring.

The map obtains locations from `surveySpaces.ts` through `surveyMap.ts`, draws only filtered locations using `mapLayout.ts`, and displays the selected record in `SurveySpaceCard`. View Details passes that record's ID to the survey-backed details route. Filters describe survey ratings, never whether a building is open now.
