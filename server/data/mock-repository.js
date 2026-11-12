// Mock data repository.
//
// Wraps the bundled mock arrays in server/data-mock as async functions so the
// business logic layer can call them identically to the Supabase repository.
// Used when USE_MOCK_DATA=true.

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

module.exports = {
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
};
