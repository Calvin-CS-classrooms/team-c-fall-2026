import { SURVEY_SPACES, type CampusSpace } from '../data/surveySpaces';
import type { ReviewTopic } from '../data/reviewFacts';

export type Criterion = 'study' | 'quiet' | 'outlets' | 'seating' | 'uncrowded' | 'social' | 'overall';
export interface ParsedQuery {
  criteria: Criterion[];
  locations: CampusSpace[];
  time?: CampusSpace['typicalTime'];
  limitations: string[];
  reviewTopics: ReviewTopic[];
  ignoredCriteria: Criterion[];
  priorityCriteria: Criterion[];
}
export function normalizeQuery(query: string): string {
  return query.toLowerCase().replace(/['’‘]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
const keywords: Record<Criterion, string[]> = {
  study: ['study', 'studying', 'homework', 'work', 'schoolwork', 'lock in', 'focus', 'productive'],
  quiet: ['without distractions', 'no distractions', 'not loud', 'not noisy', 'avoid noise', 'avoid loud places', 'quietness', 'quiet', 'quietest', 'quieter', 'silent', 'silence', 'peaceful', 'serene'],
  outlets: ['laptop is dying', 'phone is dying', 'battery is low', 'battery is dying', 'running out of battery', 'charging access', 'outlet', 'outlets', 'charger', 'charging', 'charge', 'plug', 'plugs', 'power'],
  seating: ['seat', 'seats', 'seating', 'desk', 'desks', 'table', 'tables'],
  uncrowded: ['avoid crowds', 'fewer people', 'not crowded', 'uncrowded', 'empty', 'less crowded', 'least crowded', 'not busy', 'space available'],
  social: ['social', 'socialize', 'socializing', 'friends', 'hang out', 'hangout'],
  overall: ['best', 'highest rated', 'top rated', 'best rated', 'rating', 'ratings'],
};
function contains(text: string, phrase: string): boolean {
  return ` ${text} `.includes(` ${normalizeQuery(phrase)} `);
}
export function parseQuery(query: string): ParsedQuery {
  const original = query.toLowerCase().replace(/['’‘]/g, '');
  const preference = preferences(original);
  const text = normalizeQuery(preference.text);
  const criteria = criteriaIn(text).filter(key => !preference.ignored.includes(key));
  let reviewTopics = (Object.keys(topicKeywords) as ReviewTopic[]).filter(topic => topicKeywords[topic].some(word => contains(text, word)));
  if (reviewTopics.includes('windows') && criteria.includes('outlets')) {
    reviewTopics = reviewTopics.filter(topic => topic !== 'windows');
    reviewTopics.push('window-charging');
  }
  reviewTopics = [...new Set(reviewTopics)];
  // "Best outlets" is an outlet request; only explicit rating language adds rating weight.
  if (criteria.length > 1 && !/\b(rated|rating|ratings)\b/.test(text)) {
    const index = criteria.indexOf('overall');
    if (index >= 0) criteria.splice(index, 1);
  }
  const locations = SURVEY_SPACES.filter(space => [space.name, ...space.aliases].some(alias => contains(text, alias)));
  const time = contains(text, 'late evening') || contains(text, 'late night') ? 'Late evening'
    : contains(text, 'evening') || contains(text, 'night') ? 'Evening'
    : contains(text, 'afternoon') ? 'Afternoon' : contains(text, 'morning') ? 'Morning' : undefined;
  const limitations: string[] = [];
  if (/\b(wi fi|wifi|internet|mbps)\b/.test(text)) limitations.push('Wi-Fi speed was not collected in the prototype survey.');
  if (/\b(open|opens|closed|closes|closing|hours)\b/.test(text) && !/\b(desks?|seats?|tables?)\b/.test(text)) limitations.push('Building hours and whether a location is open are not available in this dataset.');
  if (/\b(now|current|currently|live|real time|today|tonight|occupancy|sensors?)\b/.test(text) || /\b(open|available|how many)\b.*\b(desks?|seats?|tables?)\b|\b(desks?|seats?|tables?)\b.*\b(open|available)\b/.test(text)) limitations.push('We do not have live occupancy or exact desk availability. Survey seating ratings and crowd descriptions are historical reports.');
  if (/\b(temperature|hot|cold|weather)\b/.test(text)) limitations.push('Current temperature and weather were not collected.');
  if (/\b(distance|walk|walking|gps|directions|nearest|closest)\b/.test(text)) limitations.push('Walking distances, GPS positions, and directions are not available in the survey.');
  if (/\b(coffee|queue|queues|lines|line)\b/.test(text)) limitations.push('Coffee lines were not collected in the survey.');
  if (/\b\d{1,2}(?:\s+(?:am|pm))?\b/.test(text)) limitations.push('The survey records broad typical usage periods, not conditions or opening hours at exact times.');
  if (/\b(wheelchair|accessible|accessibility|elevator|ramp|printer|printing|bathroom|restroom|reservation|reserve|book|booking|food|menu|price|cost|safe|safety|security|parking)\b/.test(text)) {
    limitations.push('The survey does not contain evidence for that facility, service, or accessibility requirement.');
  }
  if (/\b(?:not|avoid|without) (?:quiet|silent|outlets?|charging|seating|windows?|sunlight|nature)\b/.test(text)) {
    limitations.push('The survey does not establish places that lack that feature.');
  }
  const unknown = unknownWords(text, locations);
  if (unknown.length && !limitations.length) limitations.push(`We cannot confidently interpret this part of the question from the survey: ${unknown.join(', ')}.`);
  return { criteria, locations, time, limitations, reviewTopics, ignoredCriteria: preference.ignored, priorityCriteria: preference.priority.filter(key => criteria.includes(key)) };
}

const topicKeywords: Record<ReviewTopic, string[]> = {
  sunlight: ['sunlight', 'sunny', 'natural light', 'daylight'],
  windows: ['window', 'windows', 'window seats', 'window seating'],
  'window-charging': ['extension cable', 'extension cord', 'long charger'],
  nature: ['nature', 'view of trees', 'views of trees', 'nature view'],
  renovation: ['renovated', 'renovation'],
  'night-atmosphere': ['spooky', 'creepy', 'atmosphere at night', 'feel at night'],
};

function criteriaIn(text: string): Criterion[] {
  return (Object.keys(keywords) as Criterion[]).filter(key => keywords[key].some(word => contains(text, word)));
}

/** Remove indifference clauses before scoring; do not mistake "not crowded"
 * for indifference or reward an attribute explicitly excluded by the user. */
function preferences(text: string): { text: string; ignored: Criterion[]; priority: Criterion[] } {
  const ignored: Criterion[] = [];
  const cleaned = text.replace(
    /\b(?:i )?(?:dont|do not|doesnt|does not) (?:really )?(?:need|want|care about|require)\b.*?(?=\b(?:but|and|with|where)\b|[,.!?;]|$)|\b(?:outlets?|charging|quiet|seating|seats|socializing|studying) (?:dont|do not|doesnt|does not) matter\b/g,
    clause => { ignored.push(...criteriaIn(clause)); return ' '; },
  );
  const priority: Criterion[] = [];
  for (const clause of cleaned.split(/[,.!?;]|\bbut\b/)) {
    const comparison = clause.match(/(.+?)\b(?:matters? more than|is more important than|over)\b(.+)/);
    if (comparison) priority.push(...criteriaIn(comparison[1]));
    const most = clause.match(/(.+?)\b(?:matters? most|is most important|is my priority)\b/);
    if (most) priority.push(...criteriaIn(most[1]));
    const mainly = clause.match(/\b(?:mainly|mostly|prioritize|prioritise)\b(.+)/);
    if (mainly) priority.push(...criteriaIn(mainly[1]));
  }
  return { text: cleaned, ignored: [...new Set(ignored)], priority: [...new Set(priority)] };
}

// Conservative vocabulary coverage: a known word such as "study" must not
// hide an unknown requirement such as "wheelchair-accessible" or "printers".
// This intentionally favors an honest no-answer over guessing new meanings.
function unknownWords(text: string, locations: CampusSpace[]): string[] {
  let remainder = ` ${normalizeQuery(text)} `;
  const phrases = [
    ...Object.values(keywords).flat(), ...Object.values(topicKeywords).flat(),
    ...locations.flatMap(s => [s.name, ...s.aliases]),
    'late evening', 'late night', 'morning', 'afternoon', 'evening', 'night',
  ].map(normalizeQuery).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) remainder = remainder.split(` ${phrase} `).join(' ');
  const filler = new Set(('a an the i im my me we our you your it its is isnt are was were be been being do does did can could should would will may might must ' +
    'where what whats which how why tell about have has there they them their that this these those ' +
    'for to of on in at by from with and or but than as so if either between somewhere someplace place places space spaces spot spots campus ' +
    'good great better most more less least really very pretty please also get find give looking look go sit near during day time feel feels location locations ' +
    'not no dont doesnt do need want care require matter matters important priority mainly mostly prioritize prioritise over ' +
    'laptop phone device devices electronic battery studying building floor first basement somewhere').split(/\s+/));
  return [...new Set(remainder.trim().split(/\s+/).filter(word => word && !filler.has(word)))];
}
