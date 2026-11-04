// Mock "AI" spot recommendation agent. It parses keywords locally instead of calling a model,
// so it can later be swapped for a real API call with the same askSpotAgent signature.
import { NoiseLabels } from '@/constants/colors';
import type { CampusLocation } from '@/types';

interface Criterion {
  key: string;
  label: string;
  keywords: string[];
  test: (location: CampusLocation) => boolean;
  reason: (location: CampusLocation) => string;
}

export interface SpotRecommendation {
  location: CampusLocation;
  reasons: string[];
  missing: string[];
  suggestedFloor?: string;
}

export interface SpotAgentResponse {
  query: string;
  message: string;
  recommendations: SpotRecommendation[];
  exactMatch: boolean;
}

const hasAmenity = (location: CampusLocation, pattern: RegExp) =>
  location.amenities.find((amenity) => pattern.test(amenity));

const CRITERIA: Criterion[] = [
  {
    key: 'quiet',
    label: 'quiet',
    keywords: ['quiet', 'silent', 'focus', 'calm', 'peaceful', 'exam'],
    test: (l) => l.noise === 'whisper' || l.noise === 'low-buzz' || l.density === 'quiet',
    reason: (l) => `${NoiseLabels[l.noise]} noise level right now`,
  },
  {
    key: 'not-busy',
    label: 'not crowded',
    keywords: ['empty', 'not busy', 'uncrowded', 'seat', 'space to spread'],
    test: (l) => l.capacity < 50,
    reason: (l) => `Only ${l.capacity}% full`,
  },
  {
    key: 'outlets',
    label: 'power outlets',
    keywords: ['outlet', 'power', 'charge', 'plug'],
    test: (l) => Boolean(hasAmenity(l, /outlet/i)),
    reason: () => 'Has power outlets',
  },
  {
    key: 'wifi',
    label: 'Wi-Fi',
    keywords: ['wifi', 'wi-fi', 'internet'],
    test: (l) => Boolean(hasAmenity(l, /wi-?fi/i)),
    reason: () => 'Has Wi-Fi',
  },
  {
    key: 'group',
    label: 'group-friendly',
    keywords: ['group', 'team', 'friends', 'project'],
    test: (l) => Boolean(hasAmenity(l, /group|study rooms/i)) || l.noise === 'social',
    reason: (l) => hasAmenity(l, /group|study rooms/i) ?? 'Social atmosphere for groups',
  },
  {
    key: 'light',
    label: 'natural light',
    keywords: ['light', 'window', 'sunny', 'natural'],
    test: (l) => Boolean(hasAmenity(l, /light|window/i)),
    reason: (l) => hasAmenity(l, /light|window/i) ?? 'Natural light',
  },
  {
    key: 'open',
    label: 'open now',
    keywords: ['open', 'right now', 'tonight', 'late'],
    test: (l) => l.isOpenNow,
    reason: (l) => l.hoursLabel,
  },
  {
    key: 'study',
    label: 'a study spot',
    keywords: ['study', 'homework', 'read', 'work on', 'cram'],
    test: (l) => l.category === 'study',
    reason: () => 'Built for studying',
  },
  {
    key: 'food',
    label: 'food or coffee',
    keywords: ['coffee', 'cafe', 'food', 'eat', 'lunch', 'dinner', 'snack', 'hungry'],
    test: (l) => l.category === 'dining' || Boolean(hasAmenity(l, /food|mobile order/i)),
    reason: (l) => (l.waitTimeMinutes ? `Food nearby, about ${l.waitTimeMinutes} min wait` : 'Food or coffee on site'),
  },
  {
    key: 'workout',
    label: 'a place to work out',
    keywords: ['gym', 'workout', 'exercise', 'lift', 'run', 'basketball'],
    test: (l) => l.category === 'athletics',
    reason: () => 'Athletics and rec space',
  },
];

const STOP_WORDS = new Set(['the', 'a', 'an', 'my', 'me', 'campus', 'here', 'building', 'hall', 'center']);

/** Pulls a place word from phrases like "near the library" or "close to North Hall". */
function nearCriterion(query: string): Criterion | null {
  const match = query.match(/(?:near|close to|by|next to|around)\s+(?:the\s+)?([a-z']+(?:\s+[a-z']+)?)/);
  if (!match) return null;
  const words = match[1].split(/\s+/).filter((word) => word.length >= 4 && !STOP_WORDS.has(word));
  if (words.length === 0) return null;
  const target = words[0];
  return {
    key: 'near',
    label: `near ${match[1]}`,
    keywords: [],
    test: (l) => `${l.name} ${l.shortDescription}`.toLowerCase().includes(target),
    reason: () => `At or next to the ${match[1]}`,
  };
}

function quietestFloor(location: CampusLocation) {
  return location.floors.find((floor) => floor.noise === 'whisper')?.floor;
}

export function answerSpotQuery(rawQuery: string, locations: CampusLocation[]): SpotAgentResponse {
  const query = rawQuery.trim().toLowerCase();
  const criteria = CRITERIA.filter((criterion) => criterion.keywords.some((keyword) => query.includes(keyword)));
  const near = nearCriterion(query);
  if (near && locations.some(near.test)) criteria.push(near);

  if (criteria.length === 0) {
    const fallback = [...locations]
      .filter((location) => location.isOpenNow)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)
      .map((location) => ({
        location,
        reasons: [`Rated ${location.rating.toFixed(1)} / 5`, location.hoursLabel],
        missing: [],
      }));
    return {
      query: rawQuery,
      message:
        "I couldn't tell what you need yet. Try mentioning noise, outlets, Wi-Fi, food, or a nearby building. " +
        'Meanwhile, here are the top-rated spots open now:',
      recommendations: fallback,
      exactMatch: false,
    };
  }

  const scored = locations
    .map((location) => {
      const met = criteria.filter((criterion) => criterion.test(location));
      return {
        location,
        reasons: [...met.map((criterion) => criterion.reason(location)), `Rated ${location.rating.toFixed(1)} / 5`],
        missing: criteria.filter((criterion) => !met.includes(criterion)).map((criterion) => criterion.label),
        suggestedFloor: criteria.some((criterion) => criterion.key === 'quiet') ? quietestFloor(location) : undefined,
        score: met.length,
      };
    })
    .sort((a, b) => b.score - a.score || a.location.capacity - b.location.capacity || b.location.rating - a.location.rating);

  const exact = scored.filter((entry) => entry.missing.length === 0);
  const wanted = criteria.map((criterion) => criterion.label).join(', ');
  const strip = ({ score: _score, ...rest }: (typeof scored)[number]): SpotRecommendation => rest;

  if (exact.length > 0) {
    return {
      query: rawQuery,
      message: `Here ${exact.length === 1 ? 'is the spot' : 'are the spots'} that fit what you asked for (${wanted}):`,
      recommendations: exact.slice(0, 3).map(strip),
      exactMatch: true,
    };
  }

  const closest = scored[0];
  return {
    query: rawQuery,
    message:
      `No spot matches everything right now. ${closest.location.name} is the closest match. ` +
      `Try relaxing: ${closest.missing.join(', ')}.`,
    recommendations: scored.filter((entry) => entry.score > 0).slice(0, 2).map(strip),
    exactMatch: false,
  };
}

export async function askSpotAgent(
  query: string,
  locations: CampusLocation[],
  { delayMs = 700 }: { delayMs?: number } = {},
): Promise<SpotAgentResponse> {
  // Simulated thinking time so the UI behaves like a real network-backed agent.
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return answerSpotQuery(query, locations);
}
