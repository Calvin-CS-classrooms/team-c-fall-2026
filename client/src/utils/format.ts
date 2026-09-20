export function formatMinutesAgo(minutes: number): string {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export interface KnightTier {
  label: string;
  next?: string;
  progress: number;
}

const TIERS = [
  { label: 'Page', min: 0 },
  { label: 'Squire', min: 5 },
  { label: 'Knight', min: 15 },
  { label: 'Grand Knight', min: 30 },
];

export function getKnightTier(ratingsCount: number): KnightTier {
  let current = TIERS[0];
  let next: (typeof TIERS)[number] | undefined;
  for (let i = 0; i < TIERS.length; i += 1) {
    if (ratingsCount >= TIERS[i].min) {
      current = TIERS[i];
      next = TIERS[i + 1];
    }
  }
  if (!next) {
    return { label: current.label, progress: 1 };
  }
  const span = next.min - current.min;
  const progress = span === 0 ? 1 : (ratingsCount - current.min) / span;
  return { label: current.label, next: next.label, progress: Math.min(Math.max(progress, 0), 1) };
}
