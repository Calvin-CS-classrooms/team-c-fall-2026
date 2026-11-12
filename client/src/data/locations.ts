import type { Location } from '@/types';

export let locations: Location[] = [
  {
    id: 1,
    name: 'Hekman Library',
    image: require('@/assets/images/hekman_library.jpg'),
    description: 'Four floors of study space, from silent stacks to group rooms.',
    numFloors: 4,
    numSpaces: 62,
    hours: { openingTime: '07:00', closingTime: '01:00' },
  },
  {
    id: 2,
    name: 'Commons Dining Hall',
    image: require('@/assets/images/dining-hall-min.jpg'),
    description: 'The main dining hall with rotating stations and 300+ seats.',
    numFloors: 2,
    numSpaces: 81,
    hours: { openingTime: '07:00', closingTime: '20:00' },
  },
  {
    id: 3,
    name: 'Business Building',
    image: require('@/assets/images/business-building.jpg'),
    description: 'A renovated study building with bright windows, flexible seating, and quiet rooms for focused work.',
    numFloors: 2,
    numSpaces: 35,
    hours: { openingTime: '07:00', closingTime: '22:00' },
  },
  {
    id: 4,
    name: 'North Hall',
    image: require('@/assets/images/north-hall.jpg'),
    description: 'A quiet academic building with open space after classes and window seats for locking in.',
    numFloors: 2,
    numSpaces: 20,
    hours: { openingTime: '07:00', closingTime: '23:00' },
  },
  {
    id: 5,
    name: 'Spoelhof Fieldhouse Complex',
    image: require('@/assets/images/spoelhof-fieldhouse.avif'),
    description: 'A bright athletics complex with an open atrium, lounge seating, and room to reset between classes.',
    numFloors: 2,
    numSpaces: 48,
    hours: { openingTime: '06:00', closingTime: '22:00' },
  },
  {
    id: 6,
    name: 'DeVries Greenhouse Lounge',
    image: require('@/assets/images/devries-greenhouse.webp'),
    description: 'A small, peaceful greenhouse lounge with plants, daylight, and a limited number of seats.',
    numFloors: 2,
    numSpaces: 12,
    hours: { openingTime: '08:00', closingTime: '21:00' },
  },
  {
    id: 7,
    name: 'CFAC Practice Lounges',
    image: require('@/assets/images/cfac-practice-lounges.jpg'),
    description: 'Focused practice lounges with individual nooks, strong outlets, and a warm arts-center atmosphere.',
    numFloors: 2,
    numSpaces: 24,
    hours: { openingTime: '07:00', closingTime: '00:00' },
  },
  {
    id: 8,
    name: 'Morren Fitness Center',
    image: require('@/assets/images/morren-fitness.jpg'),
    description: 'Cardio, free weights, and group fitness classes for every schedule.',
    numFloors: 3,
    numSpaces: 45,
    hours: { openingTime: '06:00', closingTime: '23:00' },
  },
  {
    id: 9,
    name: "Peet's Coffee",
    image: require('@/assets/images/peets-coffee.webp'),
    description: 'Espresso bar and cozy study seating near the commons.',
    numFloors: 1,
    numSpaces: 38,
    hours: { openingTime: '07:00', closingTime: '18:00' },
  },
];

export function getLocationById(id: number): Location | undefined {
  return locations.find((location) => location.id === id);
}

export function setLocations(nextLocations: Location[]) {
  locations = nextLocations;
}
