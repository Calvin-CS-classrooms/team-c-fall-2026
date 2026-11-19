// Tests the maths behind the crowd-rating slider: turning a touch position or
// a drag into a value, snapping to steps, and stepping for screen readers.
import { SLIDER_STEP, stepValue, valueFromDrag, valueFromPosition } from '@/utils/slider';

describe('valueFromPosition', () => {
  it('turns a position on the track into a percentage, snapped to the step', () => {
    expect(SLIDER_STEP).toBe(5);
    expect(valueFromPosition(100, 200)).toBe(50);
    expect(valueFromPosition(84, 200)).toBe(40); // 42% snaps to 40
    expect(valueFromPosition(86, 200)).toBe(45); // 43% snaps to 45
  });

  it('clamps positions before the start or past the end of the track', () => {
    expect(valueFromPosition(-30, 200)).toBe(0);
    expect(valueFromPosition(260, 200)).toBe(100);
  });

  it('returns undefined before the track has been measured', () => {
    expect(valueFromPosition(50, 0)).toBeUndefined();
  });
});

describe('valueFromDrag', () => {
  it('moves from the value where the drag started', () => {
    // Started at 50; dragged 20px right on a 200px track = +10%.
    expect(valueFromDrag(50, 20, 200)).toBe(60);
    expect(valueFromDrag(50, -40, 200)).toBe(30);
  });

  it('does not compound as the drag continues', () => {
    // The gesture distance is cumulative, so each move must use the start value.
    // The old slider added it to the latest value, so the thumb ran ahead.
    const start = 50;
    const moves = [10, 20, 30, 40].map((dx) => valueFromDrag(start, dx, 200));

    expect(moves).toEqual([55, 60, 65, 70]);
  });

  it('stays within 0-100', () => {
    expect(valueFromDrag(90, 100, 200)).toBe(100);
    expect(valueFromDrag(10, -100, 200)).toBe(0);
  });

  it('keeps the start value before the track has been measured', () => {
    expect(valueFromDrag(35, 40, 0)).toBe(35);
  });
});

describe('stepValue', () => {
  it('moves one step up or down', () => {
    expect(stepValue(40, 1)).toBe(45);
    expect(stepValue(40, -1)).toBe(35);
  });

  it('snaps an off-step value to the next step in that direction', () => {
    expect(stepValue(42, 1)).toBe(45);
    expect(stepValue(42, -1)).toBe(40);
  });

  it('stays within 0-100', () => {
    expect(stepValue(100, 1)).toBe(100);
    expect(stepValue(0, -1)).toBe(0);
  });
});
