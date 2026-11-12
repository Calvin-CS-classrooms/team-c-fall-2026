import { Colors, DensityColors, DensityLabels, NoiseLabels, densityForCapacity } from '@/constants/colors';
import { Typography } from '@/constants/typography';

describe('colors', () => {
  it('defines a color for every density level', () => {
    expect(DensityColors).toEqual({
      quiet: Colors.success,
      moderate: Colors.gold,
      busy: Colors.danger,
    });
  });

  it('defines a label for every density level', () => {
    expect(DensityLabels).toEqual({ quiet: 'Quiet', moderate: 'Moderate', busy: 'Busy' });
  });

  it('defines a label for every noise level', () => {
    expect(NoiseLabels).toEqual({
      whisper: 'Whisper',
      lowBuzz: 'Low Buzz',
      social: 'Social',
      loud: 'Loud',
    });
  });
});

describe('densityForCapacity', () => {
  it('maps capacity bands to density levels', () => {
    expect(densityForCapacity(0)).toBe('quiet');
    expect(densityForCapacity(39)).toBe('quiet');
    expect(densityForCapacity(40)).toBe('moderate');
    expect(densityForCapacity(74)).toBe('moderate');
    expect(densityForCapacity(75)).toBe('busy');
    expect(densityForCapacity(100)).toBe('busy');
  });

  it('handles boundary and out-of-range values', () => {
    expect(densityForCapacity(-5)).toBe('quiet');
    expect(densityForCapacity(40)).toBe('moderate');
    expect(densityForCapacity(75)).toBe('busy');
    expect(densityForCapacity(1000)).toBe('busy');
  });
});

describe('typography', () => {
  it('defines all font weights', () => {
    expect(Typography.regular).toBe('Montserrat_400Regular');
    expect(Typography.medium).toBe('Montserrat_500Medium');
    expect(Typography.semiBold).toBe('Montserrat_600SemiBold');
    expect(Typography.bold).toBe('Montserrat_700Bold');
    expect(Typography.extraBold).toBe('Montserrat_800ExtraBold');
  });
});
