import { SURVEY_SPACES, type CampusSpace } from '../data/surveySpaces';
import { surveyPercentage } from './surveyScores';
import { reviewEvidence, type ReviewFact } from '../data/reviewFacts';
import { normalizeQuery, parseQuery, type Criterion, type ParsedQuery } from './queryParser';
export { parseQuery, normalizeQuery } from './queryParser';
export type { Criterion, ParsedQuery } from './queryParser';

export interface ScoredLocation { location: CampusSpace; score: number }
export interface RecommendationResult {
  mode: 'recommendation' | 'location-info' | 'comparison' | 'unsupported';
  query: string;
  matchedCriteria: string[];
  primaryLocation?: CampusSpace;
  rankedLocations: ScoredLocation[];
  tiedLocations: CampusSpace[];
  explanation: string;
  limitations: string[];
  evidence: ReviewFact[];
}
export const quietnessScore = { 'Very quiet': 5, Quiet: 4, Moderate: 3, Loud: 2, 'Very loud': 1 };
export const uncrowdedScore = { Empty: 5, Light: 4, Moderate: 3, Busy: 2, 'Very crowded': 1 };
export const SURVEY_NOTICE = 'Based on prototype student surveys, not live conditions. Percentages show survey scores, not the percentage of students.';
export const NO_ANSWER_MESSAGE = 'Oh no, we don’t have an answer for that yet. We hope to have more information soon.';
function criterionValue(space: CampusSpace, criterion: Criterion): number {
  switch (criterion) {
    case 'study': return space.studySuitability;
    case 'quiet': return quietnessScore[space.noiseLevel];
    case 'outlets': return space.outletAvailability;
    case 'seating': return space.seatingAvailability;
    case 'uncrowded': return uncrowdedScore[space.crowdLevel];
    case 'social': return space.bestUse === 'Socializing' ? 5 : 1;
    case 'overall': return space.overallRating;
  }
}
export function scoreLocation(location: CampusSpace, parsed: ParsedQuery): ScoredLocation {
  // Weighted mean on a 1–5 scale: overall is a baseline (1), requested
  // attributes dominate (3), social/rating intent gets 4, typical time gets 1.5.
  // The resulting mean is converted to a percentage of the maximum score.
  // All matched criteria contribute once; repeating synonyms cannot inflate a score.
  let total = location.overallRating;
  let weights = 1;
  for (const criterion of parsed.criteria) {
    const baseWeight = criterion === 'social' || criterion === 'overall' ? 4 : 3;
    // Explicit priorities count twice as much; unrelated wording adds no weight.
    const weight = baseWeight * (parsed.priorityCriteria.includes(criterion) ? 2 : 1);
    total += weight * criterionValue(location, criterion);
    weights += weight;
  }
  if (parsed.time) {
    total += 1.5 * (location.typicalTime === parsed.time ? 5 : 1);
    weights += 1.5;
  }
  return { location, score: (total / weights) * 20 };
}
function joinPhrases(items: string[]): string {
  if (items.length < 2) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')}${items.length > 2 ? ',' : ''} and ${items[items.length - 1]}`;
}
const criterionLabels: Record<Criterion, string> = {
  study: 'studying', quiet: 'quietness', outlets: 'charging access', seating: 'seating',
  uncrowded: 'a less crowded space', social: 'socializing', overall: 'overall rating',
};
function describe(space: CampusSpace, criteria: Criterion[]): string {
  const facts: string[] = [];
  if (criteria.includes('study')) facts.push(`earned a ${surveyPercentage(space.studySuitability)} study score`);
  if (criteria.includes('quiet') || criteria.includes('study')) facts.push(`was described as ${space.noiseLevel.toLowerCase()}`);
  if (criteria.includes('uncrowded')) facts.push(`was described as ${space.crowdLevel.toLowerCase()} in the crowd report`);
  if (criteria.includes('outlets')) facts.push(`scored ${surveyPercentage(space.outletAvailability)} for charging access`);
  if (criteria.includes('seating')) facts.push(`scored ${surveyPercentage(space.seatingAvailability)} for seating`);
  if (criteria.includes('social')) facts.push(`was reported as best suited to ${space.bestUse.toLowerCase()}`);
  if (criteria.includes('overall') || !facts.length) facts.push(`received an overall survey score of ${surveyPercentage(space.overallRating)}`);
  return `${space.name} ${joinPhrases(facts)}.`;
}
export function explainRanking(ranked: ScoredLocation[], parsed: ParsedQuery, ties: CampusSpace[]): string {
  const first = ranked[0].location;
  const interests = parsed.criteria.filter(c => c !== 'overall').map(c => criterionLabels[c]);
  const purpose = interests.length ? ` for ${joinPhrases(interests)}` : '';
  const intro = parsed.locations.length === 1 ? `Here's what the survey says about ${first.name}.`
    : ties.length > 1 ? `${joinPhrases(ties.map(s => s.name))} are tied${purpose}, each with a ${Math.round(ranked[0].score)}% match score.`
    : `I'd suggest ${first.name}${purpose}. It has the strongest match to your request, with a ${Math.round(ranked[0].score)}% match score.`;
  const shown = parsed.locations.length > 1 ? ranked.map(s => s.location) : ties.length > 1 ? ties : [first];
  const details = shown.map(space => describe(space, parsed.criteria));
  const tradeoffs: string[] = [];
  const comparedCriteria = parsed.criteria.filter(c => c !== 'overall');
  if (parsed.criteria.includes('study') && !parsed.ignoredCriteria.includes('outlets') && !comparedCriteria.includes('outlets')) comparedCriteria.push('outlets');
  for (const criterion of comparedCriteria) {
    const better = ranked.find(s => criterionValue(s.location, criterion) > criterionValue(first, criterion));
    if (!better) continue;
    if (criterion === 'quiet') {
      tradeoffs.push(`If quiet matters most, ${better.location.name} was described as ${better.location.noiseLevel.toLowerCase()}, compared with ${first.noiseLevel.toLowerCase()} at ${first.name}.`);
    } else if (criterion === 'uncrowded') {
      tradeoffs.push(`For fewer people around, ${better.location.name} was described as ${better.location.crowdLevel.toLowerCase()}, compared with ${first.crowdLevel.toLowerCase()} at ${first.name}.`);
    } else if (criterion === 'social') {
      tradeoffs.push(`If socializing matters most, ${better.location.name} lists it as its best use.`);
    } else {
      tradeoffs.push(`The tradeoff is ${criterionLabels[criterion]}: ${first.name} scored ${surveyPercentage(criterionValue(first, criterion))}, while ${better.location.name} scored ${surveyPercentage(criterionValue(better.location, criterion))}.`);
    }
  }
  if (parsed.time) {
    const matches = shown.filter(space => space.typicalTime === parsed.time);
    tradeoffs.push(matches.length
      ? `${joinPhrases(matches.map(space => space.name))} ${matches.length === 1 ? 'was' : 'were'} typically used in the ${parsed.time.toLowerCase()} in the survey.`
      : `None of the places in this result reported ${parsed.time.toLowerCase()} as their typical use period.`);
    tradeoffs.push('That describes when students used the space; it does not tell us whether the building is open then.');
  }
  const priorities = parsed.priorityCriteria.length ? `I gave extra weight to ${joinPhrases(parsed.priorityCriteria.map(c => criterionLabels[c]))}, as you requested.` : '';
  return [intro, priorities, ...details, ...tradeoffs].filter(Boolean).join(' ');
}
export interface RecommendationContext { locationId?: string }
export function getRecommendation(query: string, context: RecommendationContext = {}): RecommendationResult {
  const parsed = parseQuery(query);
  // Follow-ups refer only to an unambiguous previous place. Explicit names win.
  const refersBack = /\b(there|that place|it)\b|^(what|how) about\b/.test(normalizeQuery(query));
  if (!parsed.locations.length && refersBack) {
    const previous = SURVEY_SPACES.find(space => space.id === context.locationId);
    if (previous) parsed.locations = [previous];
    else parsed.limitations.push('Please name the place you mean so we can answer from its survey.');
  }
  const result: RecommendationResult = {
    mode: 'unsupported', query, matchedCriteria: [...parsed.criteria, ...parsed.reviewTopics, ...(parsed.time ? [parsed.time] : [])],
    rankedLocations: [], tiedLocations: [], evidence: [], explanation: '', limitations: [SURVEY_NOTICE, ...parsed.limitations],
  };
  if (parsed.limitations.length || (!parsed.criteria.length && !parsed.reviewTopics.length && !parsed.time && !parsed.locations.length)) {
    result.explanation = NO_ANSWER_MESSAGE;
    return result;
  }
  const requested = parsed.locations.length ? parsed.locations : SURVEY_SPACES;
  // Missing review evidence means unknown, not a zero score or proof of absence.
  // Every requested review topic needs support for each candidate we show.
  const candidates = requested.filter(space => parsed.reviewTopics.every(topic => reviewEvidence(space.id, [topic]).length > 0));
  if (!candidates.length || (parsed.locations.length && candidates.length !== requested.length)) {
    result.explanation = NO_ANSWER_MESSAGE;
    result.limitations.push('The reviews do not cover every requested detail for the named places. Missing mentions do not mean a feature is absent.');
    return result;
  }
  result.evidence = candidates.flatMap(space => reviewEvidence(space.id, parsed.reviewTopics));
  const ranked = candidates.map(space => scoreLocation(space, parsed)).sort((a, b) => b.score - a.score || b.location.overallRating - a.location.overallRating || a.location.id.localeCompare(b.location.id));
  const ties = ranked.filter(s => Math.abs(s.score - ranked[0].score) < 1e-9).map(s => s.location);
  result.rankedLocations = ranked;
  result.tiedLocations = ties.length > 1 ? ties : [];
  result.mode = parsed.locations.length > 1 ? 'comparison' : parsed.locations.length === 1 ? 'location-info' : 'recommendation';
  result.primaryLocation = ranked[0].location;
  const facts = result.evidence.map(fact => fact.answer);
  result.explanation = parsed.reviewTopics.length && !parsed.criteria.length
    ? facts.join(' ')
    : [explainRanking(ranked, parsed, ties), ...facts].join(' ');
  if (parsed.reviewTopics.length) result.limitations.push('Only places whose reviews address these details are shown. Other places may have the same features; their reviews do not establish that.');
  return result;
}
