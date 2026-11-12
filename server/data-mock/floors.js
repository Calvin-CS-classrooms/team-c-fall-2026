// Mock floor data (mirrors the floors table)

const floors = [
  // Prince Conference Center (location 1)
  { id: 1, locationId: 1, name: "Grand Atrium", noiseLevel: "social" },
  { id: 2, locationId: 1, name: "Meeting Room Wing", noiseLevel: "lowBuzz" },
  { id: 3, locationId: 1, name: "Upper Conference Floor", noiseLevel: "whisper" },
  // Van Reken Hall (location 2)
  { id: 4, locationId: 2, name: "First Floor Lounge", noiseLevel: "lowBuzz" },
  { id: 5, locationId: 2, name: "Collaborative Classrooms", noiseLevel: "social" },
  { id: 6, locationId: 2, name: "Quiet Study Floor", noiseLevel: "whisper" },
  { id: 7, locationId: 2, name: "Top Floor Commons", noiseLevel: "lowBuzz" },
  // Hiemenga Hall (location 3)
  { id: 8, locationId: 3, name: "Lecture Halls", noiseLevel: "social" },
  { id: 9, locationId: 3, name: "Quiet Corners", noiseLevel: "whisper" },
  { id: 10, locationId: 3, name: "Courtyard Level", noiseLevel: "lowBuzz" },
  // Spoelhof Center (location 4)
  { id: 11, locationId: 4, name: "Media Labs", noiseLevel: "lowBuzz" },
  { id: 12, locationId: 4, name: "Group Project Rooms", noiseLevel: "social" },
  { id: 13, locationId: 4, name: "Silent Study Floor", noiseLevel: "whisper" },
  { id: 14, locationId: 4, name: "Open Commons", noiseLevel: "lowBuzz" },
  // Calvin Chapel (location 5)
  { id: 15, locationId: 5, name: "Sanctuary", noiseLevel: "whisper" },
  { id: 16, locationId: 5, name: "Lower Lounge", noiseLevel: "whisper" },
  // Hoogenboom Health & Recreation Center (location 6)
  { id: 17, locationId: 6, name: "Main Courts", noiseLevel: "loud" },
  { id: 18, locationId: 6, name: "Fitness Studios", noiseLevel: "loud" },
  { id: 19, locationId: 6, name: "Pool Deck", noiseLevel: "social" },
  { id: 20, locationId: 6, name: "Upper Track", noiseLevel: "lowBuzz" }
];

module.exports = floors;
