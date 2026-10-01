const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
const output = mkdtempSync(join(tmpdir(), 'campus-survey-test-'));
try {
  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--ignoreConfig', '--target', 'ES2020', '--module', 'commonjs', '--strict', '--skipLibCheck', '--outDir', output, 'src/utils/recommendationEngine.ts'], { cwd: join(__dirname, '..'), stdio: 'pipe' });
} catch (error) {
  rmSync(output, { recursive: true, force: true });
  throw error;
}
after(() => rmSync(output, { recursive: true, force: true }));
const { getRecommendation: recommend, parseQuery, scoreLocation } = require(join(output, 'utils/recommendationEngine.js'));
const { SURVEY_SPACES } = require(join(output, 'data/surveySpaces.js'));
for (const [query, id] of [
  ['quietest place', 'north-hall'], ['best outlets', 'hekman-library'],
  ['best seating', 'business-building'], ['least crowded', 'north-hall'],
  ['hang out with friends', 'johnnys'], ['study', 'north-hall'],
  ['Where can I charge my laptop?', 'hekman-library'],
  ['Where should I study somewhere quiet with outlets?', 'north-hall'],
]) test(query, () => assert.equal(recommend(query).primaryLocation.id, id));
test('multiple criteria contribute; quiet and outlets produce a real tie', () => {
  const result = recommend('quiet with outlets');
  assert.deepEqual(result.matchedCriteria, ['quiet', 'outlets']);
  assert.deepEqual(new Set(result.tiedLocations.map(s => s.id)), new Set(['hekman-library', 'north-hall']));
  assert.equal(result.rankedLocations[0].score, (29 / 7) * 20);
  assert.match(result.explanation, /quiet matters most/);
  const north = SURVEY_SPACES.find(s => s.id === 'north-hall');
  assert.equal(scoreLocation(north, parseQuery('study quiet outlets')).score, 88);
});
test('named location is the only candidate', () => {
  const result = recommend('How is North Hall for studying?');
  assert.equal(result.mode, 'location-info');
  assert.equal(result.primaryLocation.id, 'north-hall');
  assert.equal(result.rankedLocations.length, 1);
  assert.match(result.explanation, /100% study score/);
});
test('named charging question uses Hekman survey', () => {
  assert.match(recommend('Is Hekman good for charging my laptop?').explanation, /100% for charging access/);
});
test('comparison uses only named candidates and explains tradeoff', () => {
  const result = recommend('North Hall or Hekman for studying?');
  assert.equal(result.mode, 'comparison');
  assert.deepEqual(result.rankedLocations.map(s => s.location.id), ['north-hall', 'hekman-library']);
  assert.match(result.explanation, /tradeoff is charging access: North Hall scored 60%, while Hekman Library basement scored 100%/);
});
for (const [query, message] of [
  ['Which location has the fastest Wi-Fi?', /Wi-Fi speed was not collected/],
  ['Is Hekman open at 11?', /hours.*not available/],
  ['How many desks are open right now?', /do not have live/],
  ['What is the current temperature?', /temperature.*not collected/],
  ['Which quiet place is closest?', /distances.*not available/],
]) test(`honest limitation: ${query}`, () => {
  const result = recommend(query);
  assert.equal(result.mode, 'unsupported');
  assert.match(result.limitations.join(' '), message);
  assert.match(result.explanation, /don’t have an answer for that yet/);
  assert.equal(result.primaryLocation, undefined);
  assert.deepEqual(result.rankedLocations, []);
  assert.doesNotMatch(result.explanation, /220 Mbps|18 desks|65%/);
});
test('highest rated acknowledges all three tied locations', () => {
  const result = recommend("What's highest rated?");
  assert.equal(result.tiedLocations.length, 3);
  assert.ok(result.tiedLocations.every(s => s.overallRating === 5));
  assert.match(result.explanation, /tied.*100%/);
});
for (const query of ['', '???', 'Tell me about Atlantis']) test(`unknown query: ${query}`, () => {
  assert.equal(recommend(query).mode, 'unsupported');
  assert.equal(recommend(query).primaryLocation, undefined);
});
test('normalization and whole-word aliases', () => {
  assert.equal(recommend('  HOW IS JOHNNY’S? ').primaryLocation.id, 'johnnys');
  assert.equal(parseQuery('northern workplace').locations.length, 0);
  assert.deepEqual(parseQuery('northern workplace').criteria, []);
});
test('synonyms do not multiply weights; ranking is deterministic', () => {
  assert.deepEqual(recommend('quiet quietest silent').rankedLocations, recommend('quiet').rankedLocations);
  assert.deepEqual(recommend('study'), recommend('study'));
});
test('time match is a smaller preference and never implies hours', () => {
  const afternoon = recommend('good place in the afternoon');
  assert.equal(afternoon.primaryLocation.id, 'johnnys');
  assert.match(afternoon.explanation, /does not tell us whether the building is open/);
  assert.equal(recommend('study in the evening').primaryLocation.id, 'north-hall');
  assert.match(recommend('late night').explanation, /None of the places/);
});
test('scoring responds to survey changes instead of hardcoded winners', () => {
  const north = SURVEY_SPACES.find(s => s.id === 'north-hall');
  const parsed = parseQuery('outlets');
  assert.ok(scoreLocation({ ...north, outletAvailability: 5 }, parsed).score > scoreLocation(north, parsed).score);
});

test('answers use sentences and percentage scores without raw rating notation', () => {
  for (const query of ['study', 'quiet outlets', 'best seating', 'highest rated', 'North Hall or Hekman for studying?', 'Is Hekman good for charging?']) {
    const result = recommend(query);
    assert.match(result.explanation, /[.!?]$/);
    assert.doesNotMatch(result.explanation, /\/5|noise Very|; best use/);
    assert.ok(result.rankedLocations.every(s => s.score >= 0 && s.score <= 100));
  }
  assert.match(recommend('best seating').explanation, /scored 100% for seating/);
  assert.match(recommend('Johnnys study').explanation, /20% study score/);
});

const { REVIEW_FACTS } = require(join(output, 'data/reviewFacts.js'));
test('every review annotation has an exact supporting quote', () => {
  for (const fact of REVIEW_FACTS) {
    const space = SURVEY_SPACES.find(s => s.id === fact.locationId);
    assert.ok(space?.review.includes(fact.quote), `${fact.locationId}: ${fact.topic}`);
  }
});
test('sunlight request uses written evidence and filters unknown places', () => {
  const result = recommend('Where can I study with sunlight?');
  assert.equal(result.primaryLocation.id, 'business-building');
  assert.equal(result.rankedLocations.length, 1);
  assert.match(result.explanation, /sunlight during the day/);
  assert.equal(result.evidence[0].topic, 'sunlight');
});
test('specific window charging question answers the caveat rather than just a rating', () => {
  const result = recommend('Does North Hall have outlets near the windows?');
  assert.equal(result.mode, 'location-info');
  assert.match(result.explanation, /plugs can be far from window seats/);
  assert.match(result.explanation, /long charger or extension cable/);
});
test('missing evidence is unknown, not a negative claim', () => {
  for (const query of ['Does Hekman have sunlight?', 'North Hall or Business for sunlight?', 'Where has sunlight and a nature view?']) {
    const result = recommend(query);
    assert.equal(result.mode, 'unsupported', query);
    assert.deepEqual(result.rankedLocations, []);
    assert.equal(result.primaryLocation, undefined);
  }
});
test('reviews support comparisons when both locations have evidence', () => {
  const result = recommend('North Hall or Business for window charging?');
  assert.equal(result.mode, 'comparison');
  assert.equal(result.evidence.length, 2);
});
for (const [query, id] of [
  ['My laptop is dying', 'hekman-library'],
  ['Somewhere without distractions', 'north-hall'],
  ['Where can I study with natural light?', 'business-building'],
  ['Where can I study with a view of trees?', 'north-hall'],
  ['Where is not noisy?', 'north-hall'],
]) test(`natural phrasing: ${query}`, () => assert.equal(recommend(query).primaryLocation?.id, id));
for (const query of [
  "quiet, I don't need outlets", 'quiet but I do not care about charging',
  'quiet and outlets do not matter', 'I don’t need outlets, where can I study?',
]) test(`ignored preference: ${query}`, () => {
  const result = recommend(query);
  assert.equal(result.primaryLocation?.id, 'north-hall');
  assert.ok(!result.matchedCriteria.includes('outlets'));
  assert.doesNotMatch(result.explanation, /tradeoff is charging/);
});
test('negation stops at clause boundaries and retains positive requirements', () => {
  const result = recommend("I don't need outlets but I need seating");
  assert.equal(result.primaryLocation?.id, 'business-building');
  assert.deepEqual(result.matchedCriteria, ['seating']);
});
test('relative priorities change the winner, not just the explanation', () => {
  assert.equal(recommend('quiet matters more than outlets').primaryLocation?.id, 'north-hall');
  assert.equal(recommend('outlets matter more than quiet').primaryLocation?.id, 'hekman-library');
  assert.match(recommend('quiet matters more than outlets').explanation, /extra weight to quietness/);
  assert.equal(recommend('quiet and outlets, quiet matters most').primaryLocation?.id, 'north-hall');
});
for (const query of [
  'Does the library have wheelchair-accessible study desks?',
  'Where can I study with a printer?', 'Where can I study with a swimming pool?',
  'Is North Hall safe at night?', 'Does Hekman have purple desks?',
  'Is Atlantis good for studying?', 'Where can I reserve a quiet room?',
]) test(`unsupported requirements cannot hide behind known keywords: ${query}`, () => {
  const result = recommend(query);
  assert.equal(result.mode, 'unsupported');
  assert.equal(result.primaryLocation, undefined);
  assert.deepEqual(result.rankedLocations, []);
});
test('review opinions are not safety guarantees', () => {
  const result = recommend('Does North Hall feel spooky at night?');
  assert.equal(result.mode, 'location-info');
  assert.match(result.explanation, /not a safety assessment/);
});
test('no review-based claim survives removal of its supporting quote', () => {
  const business = SURVEY_SPACES.find(s => s.id === 'business-building');
  const original = business.review;
  try {
    business.review = '';
    assert.equal(recommend('study with sunlight').mode, 'unsupported');
  } finally { business.review = original; }
});
test('follow-ups use a supplied location without affecting new campus questions', () => {
  const context = { locationId: recommend('study').primaryLocation.id };
  const result = recommend('What about charging there?', context);
  assert.equal(result.mode, 'location-info');
  assert.equal(result.primaryLocation.id, 'north-hall');
  assert.match(result.explanation, /60% for charging access/);
  assert.equal(recommend('Where has the best outlets?', context).primaryLocation.id, 'hekman-library');
  assert.equal(recommend('How is Hekman for charging?', context).primaryLocation.id, 'hekman-library');
});
test('ambiguous follow-ups do not silently select a location', () => {
  assert.equal(recommend('What about charging there?').mode, 'unsupported');
  assert.equal(recommend('How is it for study?', { locationId: 'unknown' }).mode, 'unsupported');
});
