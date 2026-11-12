// Supabase database access layer.
//
// Thin query functions over the Supabase client. Each function returns raw
// rows from the matching table (camelCase columns, matching the schema and
// the client types). The business logic layer shapes these into API responses.
//
// Table names follow the validated schema: users, locations, spaces, floors,
// ratings, favorites, amenities, spaceAmenities, categories, spotSuggestions,
// notifications, suggestionVotes.

const supabase = require("../config/supabase");

async function getAllLocations() {
  const { data, error } = await supabase.from("locations").select("*");
  if (error) throw error;
  return data;
}

async function getLocationById(id) {
  const { data, error } = await supabase.from("locations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function getAllSpaces() {
  const { data, error } = await supabase.from("spaces").select("*");
  if (error) throw error;
  return data;
}

async function getSpaceById(id) {
  const { data, error } = await supabase.from("spaces").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function getSpacesByLocationId(locationId) {
  const { data, error } = await supabase.from("spaces").select("*").eq("locationId", locationId);
  if (error) throw error;
  return data;
}

async function getAllFloors() {
  const { data, error } = await supabase.from("floors").select("*");
  if (error) throw error;
  return data;
}

async function getFloorsByLocationId(locationId) {
  const { data, error } = await supabase.from("floors").select("*").eq("locationId", locationId);
  if (error) throw error;
  return data;
}

async function getAllRatings() {
  const { data, error } = await supabase.from("ratings").select("*");
  if (error) throw error;
  return data;
}

async function getRatingsBySpaceId(spaceId) {
  const { data, error } = await supabase.from("ratings").select("*").eq("spaceId", spaceId);
  if (error) throw error;
  return data;
}

async function getAllFavorites() {
  const { data, error } = await supabase.from("favorites").select("*");
  if (error) throw error;
  return data;
}

async function getFavoritesByUserId(userId) {
  const { data, error } = await supabase.from("favorites").select("*").eq("userId", userId);
  if (error) throw error;
  return data;
}

async function getAllAmenities() {
  const { data, error } = await supabase.from("amenities").select("*");
  if (error) throw error;
  return data;
}

async function getAllCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}

async function getAllNotifications() {
  const { data, error } = await supabase.from("notifications").select("*");
  if (error) throw error;
  return data;
}

async function getNotificationsByUserId(userId) {
  const { data, error } = await supabase.from("notifications").select("*").eq("userId", userId);
  if (error) throw error;
  return data;
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
