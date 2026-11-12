// Mock "AI" spot recommendation agent. It parses keywords locally instead of calling a model,
// so it can later be swapped for a real API call with the same askSpotAgent signature.
import { NoiseLabels } from '@/constants/colors';
import type { Space } from '@/types';

interface Criterion {
  key: string;
  label: string;
  keywords: string[];
  test: (space: Space) => boolean;
  reason: (space: Space) => string;
}

export interface SpotRecommendation {
  space: Space;
  reasons: string[];
  missing: string[];
}

export interface SpotAgentResponse {
  query: string;
  message: string;
  recommendations: SpotRecommendation[];
  exactMatch: boolean;
}

const CRITERIA: Criterion[] = [
  {
    key: 'quiet',
    label: 'quiet',
    keywords: ['quiet', 'silent', 'focus', 'calm', 'peaceful', 'exam'],
    test: (s) => s.currentNoiseLevel === 'whisper' || s.currentNoiseLevel === 'lowBuzz',
    reason: (s) => `${NoiseLabels[s.currentNoiseLevel]} noise level right now`,
  },
  {
    key: 'not-busy',
    label: 'not crowded',
    keywords: ['empty', 'not busy', 'uncrowded', 'seat', 'space to spread'],
    test: (s) => s.crowdRating < 50,
    reason: (s) => `Only ${s.crowdRating}% full`,
  },
  {
    key: 'open',
    label: 'open now',
    keywords: ['open', 'right now', 'tonight', 'late'],
    test: () => true,
    reason: () => 'Open now',
  },
  {
    key: 'study',
    label: 'a study spot',
    keywords: ['study', 'homework', 'read', 'work on', 'cram'],
    test: (s) => s.categoryId === 1,
    reason: () => 'Built for studying',
  },
  {
    key: 'food',
    label: 'food or coffee',
    keywords: ['coffee', 'cafe', 'food', 'eat', 'lunch', 'dinner', 'snack', 'hungry'],
    test: (s) => s.categoryId === 2,
    reason: () => 'Food or coffee on site',
  },
  {
    key: 'workout',
    label: 'a place to work out',
    keywords: ['gym', 'workout', 'exercise', 'lift', 'run', 'basketball'],
    test: (s) => s.categoryId === 3,
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
    test: (s) => s.description.toLowerCase().includes(target),
    reason: () => `At or next to the ${match[1]}`,
  };
}

export function answerSpotQuery(rawQuery: string, spaces: Space[]): SpotAgentResponse {
  const query = rawQuery.trim().toLowerCase();
  const criteria = CRITERIA.filter((criterion) => criterion.keywords.some((keyword) => query.includes(keyword)));
  const near = nearCriterion(query);
  if (near && spaces.some(near.test)) criteria.push(near);

  if (criteria.length === 0) {
    const fallback = [...spaces]
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, 2)
      .map((space) => ({
        space,
        reasons: [`Rated ${space.overallRating.toFixed(1)} / 5`],
        missing: [],
      }));
    return {
      query: rawQuery,
      message:
        "I couldn't tell what you need yet. Try mentioning noise, food, study, or a nearby building. " +
        'Meanwhile, here are the top-rated spots:',
      recommendations: fallback,
      exactMatch: false,
    };
  }

  const scored = spaces
    .map((space) => {
      const met = criteria.filter((criterion) => criterion.test(space));
      return {
        space,
        reasons: [...met.map((criterion) => criterion.reason(space)), `Rated ${space.overallRating.toFixed(1)} / 5`],
        missing: criteria.filter((criterion) => !met.includes(criterion)).map((criterion) => criterion.label),
        score: met.length,
      };
    })
    .sort((a, b) => b.score - a.score || b.space.overallRating - a.space.overallRating);

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
      `No spot matches everything right now. ${closest.space.description} is the closest match. ` +
      `Try relaxing: ${closest.missing.join(', ')}.`,
    recommendations: scored.filter((entry) => entry.score > 0).slice(0, 2).map(strip),
    exactMatch: false,
  };
}

export async function askSpotAgent(
  query: string,
  spaces: Space[],
  { delayMs = 700 }: { delayMs?: number } = {},
): Promise<SpotAgentResponse> {
  // Simulated thinking time so the UI behaves like a real network-backed agent.
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return answerSpotQuery(query, spaces);
}
