// Mock rating data (mirrors the ratings table)

const ratings = [
  { id: 1, userId: 1, spaceId: 6, createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), numStars: 5, crowdRating: 15, perceivedNoise: "whisper", description: "The quiet floor was completely empty this afternoon.", numUpvotes: 8 },
  { id: 2, userId: 2, spaceId: 17, createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), numStars: 4, crowdRating: 65, perceivedNoise: "loud", description: "Courts were busy but there was still room to play.", numUpvotes: 4 },
  { id: 3, userId: 3, spaceId: 13, createdAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(), numStars: 5, crowdRating: 15, perceivedNoise: "whisper", description: "Perfect for deep focus before an exam.", numUpvotes: 11 },
  { id: 4, userId: 4, spaceId: 16, createdAt: new Date(Date.now() - 900 * 60 * 1000).toISOString(), numStars: 5, crowdRating: 15, perceivedNoise: "whisper", description: "A calm spot to read between classes.", numUpvotes: 6 }
];

module.exports = ratings;
