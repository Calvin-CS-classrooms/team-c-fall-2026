// Mock data repository.
//
// Wraps the bundled mock arrays in server/data-mock as async functions so the
// business logic layer can call them identically to the Supabase repository.
// Used when USE_MOCK_DATA=true.

const users = require("../data-mock/users");
const locations = require("../data-mock/locations");
const spaces = require("../data-mock/spaces");
const floors = require("../data-mock/floors");
const ratings = require("../data-mock/ratings");
const favorites = require("../data-mock/favorites");
const amenities = require("../data-mock/amenities");
const categories = require("../data-mock/categories");
const notifications = require("../data-mock/notifications");

// Simulate a small network/db latency so async behavior matches Supabase.
const delay = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms));

async function getUserByEmail(email) {
  await delay();
  return users.find((user) => String(user.email).toLowerCase() === String(email).toLowerCase()) ?? null;
}

async function updateUser(id, changes) {
  await delay();
  const user = users.find((entry) => String(entry.id) === String(id));
  if (!user) return null;
  Object.assign(user, changes);
  return user;
}

async function getAllLocations() {
  await delay();
  return locations;
}

async function getLocationById(id) {
  await delay();
  return locations.find((location) => String(location.id) === String(id)) ?? null;
}

async function getAllSpaces() {
  await delay();
  return spaces;
}

async function getSpaceById(id) {
  await delay();
  return spaces.find((space) => String(space.id) === String(id)) ?? null;
}

async function getSpacesByLocationId(locationId) {
  await delay();
  return spaces.filter((space) => String(space.locationId) === String(locationId));
}

async function getAllFloors() {
  await delay();
  return floors;
}

async function getFloorsByLocationId(locationId) {
  await delay();
  return floors.filter((floor) => String(floor.locationId) === String(locationId));
}

async function getAllRatings() {
  await delay();
  return ratings;
}

async function getRatingsBySpaceId(spaceId) {
  await delay();
  return ratings.filter((rating) => String(rating.spaceId) === String(spaceId));
}

async function getAllFavorites() {
  await delay();
  return favorites;
}

async function getFavoritesByUserId(userId) {
  await delay();
  return favorites.filter((favorite) => String(favorite.userId) === String(userId));
}

async function getAllAmenities() {
  await delay();
  return amenities;
}

async function getAllCategories() {
  await delay();
  return categories;
}

async function getAllNotifications() {
  await delay();
  return notifications;
}

async function getNotificationsByUserId(userId) {
  await delay();
  return notifications.filter((notification) => String(notification.userId) === String(userId));
}

// --- Auth ------------------------------------------------------------------

// Mock sign-up adds the student to the mock users list (the same list login
// looks emails up in), so a new account can log in straight away. It sends no
// email, and the new users are forgotten when the server restarts.
async function createAuthUser({ email, firstName, lastName }) {
  await delay();
  const taken = users.some((user) => String(user.email).toLowerCase() === email.toLowerCase());
  if (taken) return { userId: null, alreadyRegistered: true, emailSent: false };

  const user = {
    id: Math.max(0, ...users.map((existing) => existing.id)) + 1,
    firstName,
    lastName,
    email,
    createdAt: new Date().toISOString(),
    // No confirmation email in mock mode, so the account is usable at once.
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: false,
    numRatings: 0,
    allowsNotifications: true,
    deletionScheduledFor: null,
  };
  users.push(user);
  return { userId: user.id, alreadyRegistered: false, emailSent: false };
}

// --- Write operations (mock) ----------------------------------------------

async function createRating(rating) {
  await delay();
  const next = { ...rating, id: Math.max(0, ...ratings.map((r) => r.id)) + 1 };
  ratings.push(next);
  return next;
}

async function deleteRating(id) {
  await delay();
  const index = ratings.findIndex((r) => String(r.id) === String(id));
  if (index !== -1) ratings.splice(index, 1);
}

async function createFavorite(favorite) {
  await delay();
  favorites.push(favorite);
  return favorite;
}

async function deleteFavorite(userId, spaceId) {
  await delay();
  const index = favorites.findIndex(
    (f) => String(f.userId) === String(userId) && String(f.spaceId) === String(spaceId),
  );
  if (index !== -1) favorites.splice(index, 1);
}

async function createSpotSuggestion(suggestion) {
  await delay();
  const next = {
    ...suggestion,
    id: Math.max(0, ...suggestions.map((s) => s.id)) + 1,
  };
  suggestions.push(next);
  return next;
}

module.exports = {
  getUserByEmail,
  updateUser,
  getAllLocations,
  getLocationById,
  getAllSpaces,
  getSpaceById,
  getSpacesByLocationId,
  getAllFloors,
  getFloorsByLocationId,
  getAllRatings,
  getRatingsBySpaceId,
  getAllFavorites,
  getFavoritesByUserId,
  getAllAmenities,
  getAllCategories,
  getAllNotifications,
  getNotificationsByUserId,
  createAuthUser,
  createRating,
  deleteRating,
  createFavorite,
  deleteFavorite,
  createSpotSuggestion,
};
