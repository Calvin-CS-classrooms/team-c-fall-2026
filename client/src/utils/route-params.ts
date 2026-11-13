// Helpers for reading values out of expo-router search params.

/**
 * Reads a space id from a route param such as `/ratings?spaceId=3`.
 *
 * Search params arrive as strings (or an array when repeated), so this takes
 * the first value and accepts only whole numbers.
 *
 * @returns The space id, or undefined when the param is missing or not a whole number.
 */
export function spaceIdFromParam(param: string | string[] | undefined): number | undefined {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}
