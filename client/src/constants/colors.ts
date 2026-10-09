import type { DensityLevel, NoiseLevel } from '@/types';

export const Colors = {
  maroon: '#6A1A24',
  maroonDark: '#4E131B',
  maroonSoft: '#8C3B45',
  gold: '#D99B26',
  goldSoft: '#F1D6A0',
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  border: '#E7E2D9',
  textPrimary: '#241A1A',
  textSecondary: '#6B6560',
  textMuted: '#9C948C',
  success: '#3F8F5F',
  warning: '#D99B26',
  danger: '#B23A3A',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const DensityColors: Record<DensityLevel, string> = {
  quiet: Colors.success,
  moderate: Colors.gold,
  busy: Colors.danger,
};

export const DensityLabels: Record<DensityLevel, string> = {
  quiet: 'Quiet',
  moderate: 'Moderate',
  busy: 'Busy',
};

export const NoiseLabels: Record<NoiseLevel, string> = {
  whisper: 'Whisper',
  'low-buzz': 'Low Buzz',
  social: 'Social',
  loud: 'Loud',
};

export function densityForCapacity(capacity: number): DensityLevel {
  if (capacity < 40) return 'quiet';
  if (capacity < 75) return 'moderate';
  return 'busy';
}
