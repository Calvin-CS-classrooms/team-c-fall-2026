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

async function getUserByEmail(email) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
  if (error) throw error;
  return data;
}

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

// SIGN-UP IS MOCK-ONLY FOR NOW (see data/index.js). The Supabase version is
// kept below, commented out, until the team decides how accounts and email
// confirmation should work. To switch it back on: uncomment it, add
// createAuthUser back to module.exports, remove the override in data/index.js,
// and change describe.skip back to describe in tests/auth-repository.test.js.
//
// // --- Auth ------------------------------------------------------------------
//
// /**
//  * Creates a user in Supabase Auth. With "Confirm email" on (the default on
//  * hosted projects), Supabase emails the user a confirmation link and returns
//  * no session until they click it.
//  *
//  * Supabase hides whether an email is taken: depending on project settings it
//  * returns either an obfuscated user with no identities or the
//  * user_already_exists error. Both are reported as alreadyRegistered.
//  *
//  * Confirmation links go to AUTH_REDIRECT_URL when set, otherwise to the
//  * project's Site URL (Supabase Dashboard -> Authentication -> URL Configuration).
//  *
//  * @returns {Promise<{ userId: string|null, alreadyRegistered: boolean }>}
//  * @throws The Supabase error (with its `code`) for any other failure.
//  */
// async function createAuthUser({ email, password, firstName, lastName }) {
//   const options = { data: { firstName, lastName } };
//   if (process.env.AUTH_REDIRECT_URL) options.emailRedirectTo = process.env.AUTH_REDIRECT_URL;
//
//   const { data, error } = await supabase.auth.signUp({ email, password, options });
//
//   if (error) {
//     if (error.code === "user_already_exists") return { userId: null, alreadyRegistered: true };
//     throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
//   }
//   if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
//     return { userId: null, alreadyRegistered: true };
//   }
//   return { userId: data.user?.id ?? null, alreadyRegistered: false };
// }

// --- Write operations ------------------------------------------------------

async function createRating(rating) {
  const { data, error } = await supabase.from("ratings").insert(rating).select().maybeSingle();
  if (error) throw error;
  return data;
}

async function deleteRating(id) {
  const { error } = await supabase.from("ratings").delete().eq("id", id);
  if (error) throw error;
}

async function createFavorite(favorite) {
  const { data, error } = await supabase.from("favorites").insert(favorite).select().maybeSingle();
  if (error) throw error;
  return data;
}

async function deleteFavorite(userId, spaceId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("userId", userId)
    .eq("spaceId", spaceId);
  if (error) throw error;
}

async function createSpotSuggestion(suggestion) {
  const { data, error } = await supabase
    .from("spotSuggestions")
    .insert(suggestion)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = {
  getUserByEmail,
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
  // createAuthUser,  // mock-only for now; see the note above
  createRating,
  deleteRating,
  createFavorite,
  deleteFavorite,
  createSpotSuggestion,
};
