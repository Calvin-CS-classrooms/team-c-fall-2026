// Mock location data (mirrors the locations table) — different buildings than the client

// latitude/longitude are building centres from OpenStreetMap, used to detect
// which building the student is in. Van Reken Hall had no OpenStreetMap match,
// so it has none yet and can't be detected; add it once checked on a map.
const locations = [
  {
    id: 1,
    name: "Prince Conference Center",
    image: "prince-conference",
    description: "A modern conference and event venue with flexible meeting rooms and a grand atrium.",
    numFloors: 3,
    numSpaces: 24,
    hours: { openingTime: "07:00", closingTime: "22:00" },
    latitude: 42.9303623,
    longitude: -85.5821382
  },
  {
    id: 2,
    name: "Van Reken Hall",
    image: "van-reken",
    description: "A bright academic building with collaborative classrooms and open study lounges.",
    numFloors: 4,
    numSpaces: 40,
    hours: { openingTime: "07:00", closingTime: "23:00" }
  },
  {
    id: 3,
    name: "Hiemenga Hall",
    image: "hiemenga",
    description: "A classic lecture building with quiet corners and a central courtyard.",
    numFloors: 3,
    numSpaces: 18,
    hours: { openingTime: "07:00", closingTime: "21:00" },
    latitude: 42.9298209,
    longitude: -85.5883524
  },
  {
    id: 4,
    name: "Spoelhof Center",
    image: "spoelhof-center",
    description: "A hub for education and communication with media labs and group project rooms.",
    numFloors: 4,
    numSpaces: 32,
    hours: { openingTime: "07:00", closingTime: "22:00" },
    latitude: 42.9299283,
    longitude: -85.5893223
  },
  {
    id: 5,
    name: "Calvin Chapel",
    image: "calvin-chapel",
    description: "A serene worship and reflection space with a quiet lower lounge.",
    numFloors: 2,
    numSpaces: 8,
    hours: { openingTime: "08:00", closingTime: "20:00" },
    latitude: 42.9292296,
    longitude: -85.58845
  },
  {
    id: 6,
    name: "Hoogenboom Health & Recreation Center",
    image: "hoogenboom",
    description: "A large recreation complex with courts, a pool, and fitness studios.",
    numFloors: 3,
    numSpaces: 28,
    hours: { openingTime: "06:00", closingTime: "23:00" },
    latitude: 42.9332224,
    longitude: -85.589685
  }
];

module.exports = locations;