import type { ImageSourcePropType } from 'react-native';

interface SpacePhoto {
  source: ImageSourcePropType;
  description: string;
  sourcePage: string;
}
// Official Calvin photos, bundled locally so cards do not depend on remote image URLs.
// Building exteriors identify the location; they do not depict the surveyed floor.
export const SPACE_PHOTOS: Record<string, SpacePhoto> = {
  'hekman-library': {
    source: require('../../assets/spaces/hekman-library.jpg'),
    description: 'Hekman Library exterior',
    sourcePage: 'https://calvin.edu/places/hekman-library',
  },
  'business-building': {
    source: require('../../assets/spaces/business-building.jpg'),
    description: 'School of Business exterior',
    sourcePage: 'https://calvin.edu/places/school-business',
  },
  'north-hall': {
    source: require('../../assets/spaces/north-hall.jpg'),
    description: 'North Hall exterior',
    sourcePage: 'https://calvin.edu/places/north-hall',
  },
  johnnys: {
    source: require('../../assets/spaces/johnnys.jpg'),
    description: 'Commons exterior, home to Johnny’s Cafe',
    sourcePage: 'https://calvin.edu/places/commons-building',
  },
};
