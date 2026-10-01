# Prototype survey recommendations

The home search, recommendation cards, follow-up questions, map, and place details use the four original responses in `client/src/data/surveySpaces.ts`. These are survey reports, not live telemetry. Map ratings and filters use the same survey records; only its backdrop and pin positions are illustrative. Positions are stored separately in `client/src/data/mapLayout.ts` and are not GPS coordinates. The map offers All, Quiet, Good for studying, and Social filters, and sends survey IDs to place details. It has no Rate Spot action because the legacy review flow uses fictional fixtures.

`client/src/utils/queryParser.ts` handles normalization, vocabulary coverage, review topics, negatives, and priorities. `client/src/utils/recommendationEngine.ts` handles evidence filtering, scoring, and explanations. Parsing matches whole words and phrases, normalizes apostrophes, and collects every recognized criterion once. One named location limits the result to that location; multiple names limit the comparison to those locations. Unrecognized requests receive a helpful unsupported result. Unsupported questions receive a friendly no-answer message and no recommendation cards. Known missing measurements are explained in the limitations text.

The original survey values stay intact. Each location's score is calculated as a weighted mean of those values, then divided by 5 and multiplied by 100 to return a percentage:

- Overall rating: baseline weight 1.
- Each requested study, quietness, outlet, seating, or uncrowded criterion: weight 3.
- Socializing or explicit rating preference: weight 4. Socializing is 5 for matching best use and 1 otherwise.
- Typical time preference: weight 1.5, using 5 for a match and 1 otherwise. This does not imply opening hours.

Quietness maps Very quiet through Very loud to 5 through 1. Crowd maps Empty through Very crowded to 5 through 1. Original labels remain unchanged. “Best outlets” emphasizes outlets; “highest rated” emphasizes overall rating. Scores sort descending, then overall rating, then ID for stable display. Equal top scores are explicitly reported as ties, even though a stable first card is available for navigation.

Examples:

| Query | Result |
| --- | --- |
| quietest place | North Hall |
| best outlets | Hekman Library basement |
| best seating | Business building first floor |
| least crowded | North Hall |
| hang out with friends | Johnnys |
| study | North Hall |
| quiet with outlets | Hekman and North Hall tied at approximately 83% |
| study somewhere quiet with outlets | North Hall, 88% combined score |
| highest rated | Hekman, Business, North Hall tied at 100% |
| North Hall or Hekman for studying? | North Hall leads; Hekman has better outlets |
| fastest Wi-Fi | Unsupported: speed was not collected |

Follow-ups use the same engine. “What about charging there?” refers to the previous unambiguous location. After a tie, comparison, or unanswered question, the user must name a place. Explicit names override context; a new campus-wide question starts a fresh ranking.

The parser remains a deterministic phrase system, not an AI model. It cannot understand arbitrary language. It checks unrecognized content words conservatively, so unfamiliar phrasing can receive the no-answer message even when a human could interpret it. This prevents a recognized word like “study” from masking an unsupported requirement.

## Review evidence and preferences

`client/src/data/reviewFacts.ts` contains human-reviewed facts for sunlight, windows, charging near windows, nature views, renovation, and nighttime atmosphere. Each fact stores its exact source quote and a qualified answer. A fact is used only if its quote is still present in the location's original survey review. No runtime model, external request, or generated fact extraction is involved.

Every requested review topic must have evidence for a candidate. Unmentioned features are unknown, not absent or poorly rated. A named-place comparison with incomplete evidence returns the no-answer message instead of inventing differences. Review-only answers provide the supported facts without manufacturing quantitative ratings for sunlight or views.

“I don't need outlets” and “outlets do not matter” remove charging from both scoring and suggested tradeoffs. “Quiet matters more than outlets” doubles quietness's usual weight; reversing the priority doubles charging's weight. Existing weights and percentage conversions are otherwise unchanged. Complex unsupported negative requirements return no answer rather than being interpreted as positive preferences.

| Query | Behavior |
| --- | --- |
| Where can I study with sunlight? | Business building, supported by its daytime sunlight review |
| Does North Hall have outlets near the windows? | Notes that plugs may be far away and a long charger may help |
| My laptop is dying | Hekman, using charging scores |
| Somewhere without distractions | North Hall, using quietness |
| Quiet matters more than outlets | North Hall |
| Outlets matter more than quiet | Hekman |
| Quiet, I don't need outlets | Quietness ranking without charging weight |
| Does Hekman have sunlight? | No answer: its review does not establish sunlight |
| Does the library have wheelchair-accessible study desks? | No answer: accessibility was not collected |

Recommendations retain survey caveats. A review's “spooky” impression does not establish safety, and typical nighttime use does not establish building hours.

Validation from `client`:

```
npm test
npm run lint
npm start
```

The tests use Node's built-in test runner and the existing TypeScript compiler, compiling the pure engine into a temporary directory that is removed afterward. No extra dependencies or API keys are needed. `lint` is this project's TypeScript check (`tsc --noEmit`); there is no separate ESLint configuration.

Answers use sentences focused on the requested criteria. Displayed percentages represent a share of the maximum survey score, not a percentage of students or confidence in a recommendation. Homepage cards include locally bundled official building photos; photo credits and sources are in `client/assets/spaces/README.md`.
