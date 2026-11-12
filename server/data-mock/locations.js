// Mock location data (mirrors the locations table) — different buildings than the client

const locations = [
  {
    id: 1,
    name: "Prince Conference Center",
    image: "prince-conference",
    description: "A modern conference and event venue with flexible meeting rooms and a grand atrium.",
    numFloors: 3,
    numSpaces: 24,
    hours: { openingTime: "07:00", closingTime: "22:00" }
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
    hours: { openingTime: "07:00", closingTime: "21:00" }
  },
  {
    id: 4,
    name: "Spoelhof Center",
    image: "spoelhof-center",
    description: "A hub for education and communication with media labs and group project rooms.",
    numFloors: 4,
    numSpaces: 32,
    hours: { openingTime: "07:00", closingTime: "22:00" }
  },
  {
    id: 5,
    name: "Calvin Chapel",
    image: "calvin-chapel",
    description: "A serene worship and reflection space with a quiet lower lounge.",
    numFloors: 2,
    numSpaces: 8,
    hours: { openingTime: "08:00", closingTime: "20:00" }
  },
  {
    id: 6,
    name: "Hoogenboom Health & Recreation Center",
    image: "hoogenboom",
    description: "A large recreation complex with courts, a pool, and fitness studios.",
    numFloors: 3,
    numSpaces: 28,
    hours: { openingTime: "06:00", closingTime: "23:00" }
  }
];

module.exports = locations;