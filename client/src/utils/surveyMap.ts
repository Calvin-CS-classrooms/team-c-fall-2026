import { SURVEY_SPACES, type CampusSpace } from '../data/surveySpaces';

export type MapFilter = 'all' | 'quiet' | 'study' | 'social';
export const MAP_FILTERS: { id: MapFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'quiet', label: 'Quiet' },
  { id: 'study', label: 'Good for studying' },
  { id: 'social', label: 'Social' },
];
export function filterSurveySpaces(filter: MapFilter): CampusSpace[] {
  return SURVEY_SPACES.filter(space => {
    if (filter === 'quiet') return space.noiseLevel === 'Very quiet' || space.noiseLevel === 'Quiet';
    if (filter === 'study') return space.studySuitability >= 4;
    if (filter === 'social') return space.bestUse === 'Socializing';
    return true;
  });
}
export function selectedVisibleSpace(spaces: CampusSpace[], selectedId: string): CampusSpace | undefined {
  return spaces.find(space => space.id === selectedId) ?? spaces[0];
}
export function surveyDetailsRoute(space: CampusSpace) {
  return { pathname: '/place-details' as const, params: { id: space.id } };
}
