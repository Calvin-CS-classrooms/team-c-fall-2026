import type { CampusLocation } from '@/types';

type ApiLocation = Omit<CampusLocation, 'image'> & {
  imageKey: string;
};

const images: Record<string, CampusLocation['image']> = {
  hekman_library: require('@/assets/images/hekman_library.jpg'),
  'dining-hall-min': require('@/assets/images/dining-hall-min.jpg'),
  'business-building': require('@/assets/images/business-building.jpg'),
  'north-hall': require('@/assets/images/north-hall.jpg'),
  'spoelhof-fieldhouse': require('@/assets/images/spoelhof-fieldhouse.avif'),
  'devries-greenhouse': require('@/assets/images/devries-greenhouse.webp'),
  'cfac-practice-lounges': require('@/assets/images/cfac-practice-lounges.jpg'),
  'morren-fitness': require('@/assets/images/morren-fitness.jpg'),
  'peets-coffee': require('@/assets/images/peets-coffee.webp'),
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchLocations(): Promise<CampusLocation[]> {
  const response = await fetch(`${API_URL}/api/locations`);

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  const data: ApiLocation[] = await response.json();

  return data.map(({ imageKey, ...location }) => ({
    ...location,
    image: images[imageKey] || images.hekman_library,
  }));
}
