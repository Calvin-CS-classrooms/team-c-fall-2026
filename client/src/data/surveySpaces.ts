export interface CampusSpace {
  id: string;
  name: string;
  aliases: string[];
  overallRating: number;
  studySuitability: number;
  outletAvailability: number;
  seatingAvailability: number;
  noiseLevel: 'Very quiet' | 'Quiet' | 'Moderate' | 'Loud' | 'Very loud';
  crowdLevel: 'Empty' | 'Light' | 'Moderate' | 'Busy' | 'Very crowded';
  bestUse: 'Studying' | 'Eating' | 'Socializing' | 'Meetings' | 'Relaxing';
  typicalTime: 'Morning' | 'Afternoon' | 'Evening' | 'Late evening';
  frequency: string;
  review: string;
}

// Original prototype survey responses; these are not live measurements.
export const SURVEY_SPACES: CampusSpace[] = [
  {
    "id": "hekman-library",
    "name": "Hekman Library basement",
    "aliases": [
      "hekman",
      "hekman library",
      "library",
      "hekman basement",
      "library basement"
    ],
    "overallRating": 5,
    "studySuitability": 4,
    "outletAvailability": 5,
    "seatingAvailability": 4,
    "noiseLevel": "Moderate",
    "crowdLevel": "Moderate",
    "bestUse": "Studying",
    "typicalTime": "Evening",
    "frequency": "A few times",
    "review": "It's perfect for completing homework and getting stuff done. It is also good for studying, but if you really need to lock in and study, I would recommend a different spot that is a little quieter."
  },
  {
    "id": "business-building",
    "name": "Business building first floor",
    "aliases": [
      "business building",
      "business",
      "business first floor",
      "business building first floor"
    ],
    "overallRating": 5,
    "studySuitability": 4,
    "outletAvailability": 3,
    "seatingAvailability": 5,
    "noiseLevel": "Quiet",
    "crowdLevel": "Light",
    "bestUse": "Studying",
    "typicalTime": "Evening",
    "frequency": "Weekly",
    "review": "The business building is really good for locking in, either during the day or at night. During the day there is a lot of sunlight and so the place always feels good. During the night there are usually no classes so it's pretty serene. The one thing I've struggled to find there has been charging spots, usually by the 3 seats with tables near the windows. The rooms over there also are pretty empty and it's one of the well renovated spaces on campus."
  },
  {
    "id": "north-hall",
    "name": "North Hall",
    "aliases": [
      "north hall",
      "north"
    ],
    "overallRating": 5,
    "studySuitability": 5,
    "outletAvailability": 3,
    "seatingAvailability": 4,
    "noiseLevel": "Very quiet",
    "crowdLevel": "Empty",
    "bestUse": "Studying",
    "typicalTime": "Evening",
    "frequency": "A few times",
    "review": "There's literally no one after 3–4ish when classes at North Hall are all finished. The places facing the window help you admire nature while locking in your school work. The downside is if you want to sit near the window, the plug might be a little far, so you might need an extension cable or long charger if you want to charge your laptop or electronic devices. When late at night, it could also be a bit spooky because it's really quiet and there's barely anyone on that floor."
  },
  {
    "id": "johnnys",
    "name": "Johnnys",
    "aliases": [
      "johnnys",
      "johnny's",
      "johnny"
    ],
    "overallRating": 4,
    "studySuitability": 1,
    "outletAvailability": 4,
    "seatingAvailability": 2,
    "noiseLevel": "Loud",
    "crowdLevel": "Busy",
    "bestUse": "Socializing",
    "typicalTime": "Afternoon",
    "frequency": "A few times",
    "review": "It can be overcrowded and a bit loud which could make it hard to study."
  }
];
