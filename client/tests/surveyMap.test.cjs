const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
const output = mkdtempSync(join(tmpdir(), 'campus-map-test-'));
try {
  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--ignoreConfig', '--target', 'ES2020', '--module', 'commonjs', '--strict', '--skipLibCheck', '--outDir', output, 'src/utils/surveyMap.ts', 'src/data/mapLayout.ts'], { cwd: join(__dirname, '..'), stdio: 'pipe' });
} catch (error) {
  rmSync(output, { recursive: true, force: true });
  throw error;
}
after(() => rmSync(output, { recursive: true, force: true }));
const { filterSurveySpaces, selectedVisibleSpace, surveyDetailsRoute } = require(join(output, 'utils/surveyMap.js'));
const { SURVEY_SPACES } = require(join(output, 'data/surveySpaces.js'));
const { MAP_LAYOUT } = require(join(output, 'data/mapLayout.js'));
const ids = spaces => spaces.map(space => space.id);

test('All shows precisely the four original survey records', () => {
  const places = filterSurveySpaces('all');
  assert.deepEqual(ids(places), ['hekman-library', 'business-building', 'north-hall', 'johnnys']);
  places.forEach((space, i) => assert.equal(space, SURVEY_SPACES[i]));
});
test('Quiet shows Business and North Hall', () => {
  assert.deepEqual(ids(filterSurveySpaces('quiet')), ['business-building', 'north-hall']);
});
test('Study shows the three spaces with study scores of at least four', () => {
  assert.deepEqual(ids(filterSurveySpaces('study')), ['hekman-library', 'business-building', 'north-hall']);
});
test('Social shows Johnnys', () => {
  assert.deepEqual(ids(filterSurveySpaces('social')), ['johnnys']);
});
test('filtering an existing selection never previews a hidden location', () => {
  assert.equal(selectedVisibleSpace(filterSurveySpaces('social'), 'hekman-library').id, 'johnnys');
  assert.equal(selectedVisibleSpace(filterSurveySpaces('quiet'), 'north-hall').id, 'north-hall');
  assert.equal(selectedVisibleSpace([], 'hekman-library'), undefined);
});
test('every visible place has an illustrative layout entry with percentage positions', () => {
  assert.deepEqual(Object.keys(MAP_LAYOUT).sort(), ids(SURVEY_SPACES).sort());
  for (const space of SURVEY_SPACES) {
    for (const value of Object.values(MAP_LAYOUT[space.id])) {
      assert.match(value, /^\d+%$/);
      assert.ok(parseInt(value) > 0 && parseInt(value) < 100);
    }
  }
});
for (const space of SURVEY_SPACES) test(`details route preserves ${space.id} and resolves its actual survey record`, () => {
  const selected = selectedVisibleSpace(filterSurveySpaces('all'), space.id);
  const route = surveyDetailsRoute(selected);
  assert.equal(route.pathname, '/place-details');
  assert.equal(route.params.id, space.id);
  assert.equal(SURVEY_SPACES.find(s => s.id === route.params.id), space);
});
