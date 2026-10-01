// Preserve the original survey responses; convert their five-point scale for display.
// This is a percentage of the maximum score, not a percentage of respondents.
export function surveyPercentage(rating: number): string {
  return `${Math.round((rating / 5) * 100)}%`;
}
