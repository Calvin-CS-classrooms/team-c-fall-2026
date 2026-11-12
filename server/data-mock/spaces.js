// Mock space data (mirrors the spaces table) — different buildings than the client

const spaces = [
  // Prince Conference Center (location 1)
  { id: 1, locationId: 1, categoryId: 4, floorId: 1, name: "Prince Grand Atrium", description: "Open seating beneath the glass roof for events and gatherings.", noiseLevel: "social", spotSuggestionId: null, overallRating: 4.5, crowdRating: 55, currentNoiseLevel: "social" },
  { id: 2, locationId: 1, categoryId: 1, floorId: 2, name: "Prince Meeting Wing", description: "Quiet meeting rooms with strong Wi-Fi and whiteboards.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.6, crowdRating: 30, currentNoiseLevel: "lowBuzz" },
  { id: 3, locationId: 1, categoryId: 1, floorId: 3, name: "Prince Upper Conference", description: "Focused conference rooms with natural light.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.7, crowdRating: 20, currentNoiseLevel: "whisper" },
  // Van Reken Hall (location 2)
  { id: 4, locationId: 2, categoryId: 1, floorId: 4, name: "Van Reken Lounge", description: "Comfortable lounge seating for casual study.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.4, crowdRating: 40, currentNoiseLevel: "lowBuzz" },
  { id: 5, locationId: 2, categoryId: 2, floorId: 5, name: "Van Reken Collaboration", description: "Collaborative classrooms great for group work.", noiseLevel: "social", spotSuggestionId: null, overallRating: 4.3, crowdRating: 60, currentNoiseLevel: "social" },
  { id: 6, locationId: 2, categoryId: 1, floorId: 6, name: "Van Reken Quiet Floor", description: "A dedicated silent study floor.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.8, crowdRating: 15, currentNoiseLevel: "whisper" },
  { id: 7, locationId: 2, categoryId: 1, floorId: 7, name: "Van Reken Commons", description: "Open commons with window seating.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.5, crowdRating: 35, currentNoiseLevel: "lowBuzz" },
  // Hiemenga Hall (location 3)
  { id: 8, locationId: 3, categoryId: 2, floorId: 8, name: "Hiemenga Lecture Halls", description: "Large lecture halls with tiered seating.", noiseLevel: "social", spotSuggestionId: null, overallRating: 4.2, crowdRating: 50, currentNoiseLevel: "social" },
  { id: 9, locationId: 3, categoryId: 1, floorId: 9, name: "Hiemenga Quiet Corners", description: "Small quiet nooks for focused work.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.6, crowdRating: 20, currentNoiseLevel: "whisper" },
  { id: 10, locationId: 3, categoryId: 2, floorId: 10, name: "Hiemenga Courtyard", description: "Outdoor-adjacent seating around the courtyard.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.4, crowdRating: 45, currentNoiseLevel: "lowBuzz" },
  // Spoelhof Center (location 4)
  { id: 11, locationId: 4, categoryId: 1, floorId: 11, name: "Spoelhof Media Labs", description: "Media and editing labs with powerful workstations.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.5, crowdRating: 40, currentNoiseLevel: "lowBuzz" },
  { id: 12, locationId: 4, categoryId: 2, floorId: 12, name: "Spoelhof Project Rooms", description: "Bookable group project rooms.", noiseLevel: "social", spotSuggestionId: null, overallRating: 4.3, crowdRating: 55, currentNoiseLevel: "social" },
  { id: 13, locationId: 4, categoryId: 1, floorId: 13, name: "Spoelhof Silent Floor", description: "A quiet floor for deep concentration.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.7, crowdRating: 15, currentNoiseLevel: "whisper" },
  { id: 14, locationId: 4, categoryId: 2, floorId: 14, name: "Spoelhof Commons", description: "Open commons with flexible seating.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.4, crowdRating: 45, currentNoiseLevel: "lowBuzz" },
  // Calvin Chapel (location 5)
  { id: 15, locationId: 5, categoryId: 4, floorId: 15, name: "Chapel Sanctuary", description: "A peaceful sanctuary for reflection.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.9, crowdRating: 10, currentNoiseLevel: "whisper" },
  { id: 16, locationId: 5, categoryId: 1, floorId: 16, name: "Chapel Lower Lounge", description: "Couches and tables below the chapel for quiet reading.", noiseLevel: "whisper", spotSuggestionId: null, overallRating: 4.8, crowdRating: 15, currentNoiseLevel: "whisper" },
  // Hoogenboom Health & Recreation Center (location 6)
  { id: 17, locationId: 6, categoryId: 3, floorId: 17, name: "Hoogenboom Courts", description: "Basketball and volleyball courts.", noiseLevel: "loud", spotSuggestionId: null, overallRating: 4.4, crowdRating: 65, currentNoiseLevel: "loud" },
  { id: 18, locationId: 6, categoryId: 3, floorId: 18, name: "Hoogenboom Studios", description: "Group fitness and spin studios.", noiseLevel: "loud", spotSuggestionId: null, overallRating: 4.5, crowdRating: 60, currentNoiseLevel: "loud" },
  { id: 19, locationId: 6, categoryId: 3, floorId: 19, name: "Hoogenboom Pool Deck", description: "Lap pool and leisure pool area.", noiseLevel: "social", spotSuggestionId: null, overallRating: 4.6, crowdRating: 50, currentNoiseLevel: "social" },
  { id: 20, locationId: 6, categoryId: 3, floorId: 20, name: "Hoogenboom Track", description: "Indoor running track above the courts.", noiseLevel: "lowBuzz", spotSuggestionId: null, overallRating: 4.5, crowdRating: 40, currentNoiseLevel: "lowBuzz" }
];

module.exports = spaces;
