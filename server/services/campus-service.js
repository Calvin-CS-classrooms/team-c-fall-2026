// Business logic layer.
//
// Sits between the REST routes and the data repository. It applies domain
// rules and shapes raw rows into the API responses the client expects. It is
// agnostic to the data source (mock vs Supabase) — it only calls the
// repository facade in server/data.

const repository = require("../data");

// --- Derived space metrics -------------------------------------------------

// A space's overall rating is the average star rating of its ratings.
function computeOverallRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + rating.numStars, 0);
  return Math.round((total / ratings.length) * 10) / 10;
}

// A space's crowd rating is the most recent crowdRating among its ratings,
// falling back to 0 when there are none.
function computeCrowdRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const latest = ratings.reduce((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? a : b,
  );
  return latest.crowdRating;
}

// A space's current noise level is the perceivedNoise of its most recent rating.
function computeCurrentNoiseLevel(ratings) {
  if (!ratings || ratings.length === 0) return null;
  const latest = ratings.reduce((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? a : b,
  );
  return latest.perceivedNoise;
}

// --- Spaces ----------------------------------------------------------------

// Adds the derived metrics to one space, given only that space's ratings.
// Values stored on the row are overwritten so responses always reflect ratings.
function withMetrics(space, ratings) {
  return {
    ...space,
    overallRating: computeOverallRating(ratings),
    crowdRating: computeCrowdRating(ratings),
    currentNoiseLevel: computeCurrentNoiseLevel(ratings),
  };
}

// Enriches many spaces at once. Ratings are grouped by spaceId in a single pass
// so each space only sees its own ratings (O(spaces + ratings), not a nested loop).
function enrichSpaces(spaces, ratings) {
  const ratingsBySpace = new Map();
  for (const rating of ratings) {
    const list = ratingsBySpace.get(rating.spaceId) ?? [];
    list.push(rating);
    ratingsBySpace.set(rating.spaceId, list);
  }
  return spaces.map((space) => withMetrics(space, ratingsBySpace.get(space.id) ?? []));
}

// Returns all spaces, each enriched with derived rating metrics.
async function getSpaces() {
  const [spaces, ratings] = await Promise.all([
    repository.getAllSpaces(),
    repository.getAllRatings(),
  ]);
  return enrichSpaces(spaces, ratings);
}

// Returns one enriched space, or null when the id does not exist.
async function getSpaceById(id) {
  const space = await repository.getSpaceById(id);
  if (!space) return null;

  const ratings = await repository.getRatingsBySpaceId(space.id);
  return withMetrics(space, ratings);
}

// Returns the enriched spaces at one location (empty when there are none).
async function getSpacesByLocationId(locationId) {
  const [spaces, ratings] = await Promise.all([
    repository.getSpacesByLocationId(locationId),
    repository.getAllRatings(),
  ]);
  return enrichSpaces(spaces, ratings);
}

// --- Locations -------------------------------------------------------------

// Returns all locations, each with its floors and enriched spaces.
async function getLocations() {
  const [locations, floors, spaces] = await Promise.all([
    repository.getAllLocations(),
    repository.getAllFloors(),
    getSpaces(),
  ]);

  return locations.map((location) => ({
    ...location,
    floors: floors.filter((floor) => floor.locationId === location.id),
    spaces: spaces.filter((space) => space.locationId === location.id),
  }));
}

async function getLocationById(id) {
  const location = await repository.getLocationById(id);
  if (!location) return null;

  const [floors, spaces] = await Promise.all([
    repository.getFloorsByLocationId(location.id),
    getSpacesByLocationId(location.id),
  ]);

  return {
    ...location,
    floors,
    spaces,
  };
}

// --- Ratings ---------------------------------------------------------------

async function getRatings() {
  return repository.getAllRatings();
}

async function getRatingsBySpaceId(spaceId) {
  return repository.getRatingsBySpaceId(spaceId);
}

// --- Favorites -------------------------------------------------------------

async function getFavoritesByUserId(userId) {
  return repository.getFavoritesByUserId(userId);
}

// --- Reference data --------------------------------------------------------

async function getAmenities() {
  return repository.getAllAmenities();
}

async function getCategories() {
  return repository.getAllCategories();
}

// --- Notifications ---------------------------------------------------------

async function getNotificationsByUserId(userId) {
  return repository.getNotificationsByUserId(userId);
}

module.exports = {
  computeOverallRating,
  computeCrowdRating,
  computeCurrentNoiseLevel,
  getSpaces,
  getSpaceById,
  getSpacesByLocationId,
  getLocations,
  getLocationById,
  getRatings,
  getRatingsBySpaceId,
  getFavoritesByUserId,
  getAmenities,
  getCategories,
  getNotificationsByUserId,
};
