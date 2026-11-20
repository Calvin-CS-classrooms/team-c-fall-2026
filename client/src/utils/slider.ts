// Maths for the 0-100 percentage slider (crowd rating).

/** Values snap to this many percent, so it is easy to land on a round number. */
export const SLIDER_STEP = 5;

function clampAndSnap(value: number, step: number): number {
  const snapped = Math.round(value / step) * step;
  return Math.min(Math.max(snapped, 0), 100);
}

/**
 * The value for a touch at `x` pixels from the left edge of a track
 * `trackWidth` pixels wide, snapped to the step and clamped to 0-100.
 *
 * @returns The value, or undefined when the track has not been measured yet.
 */
export function valueFromPosition(x: number, trackWidth: number, step = SLIDER_STEP): number | undefined {
  if (trackWidth <= 0) return undefined;
  return clampAndSnap((x / trackWidth) * 100, step);
}

/**
 * The value after dragging `dx` pixels from where the drag started.
 *
 * `dx` is the total distance since the drag began, so it must be applied to
 * the value at the start of the drag. Adding it to the latest value instead
 * counts the same movement again on every move and the thumb runs ahead.
 */
export function valueFromDrag(startValue: number, dx: number, trackWidth: number, step = SLIDER_STEP): number {
  if (trackWidth <= 0) return startValue;
  return clampAndSnap(startValue + (dx / trackWidth) * 100, step);
}

/**
 * One step up (+1) or down (-1), used for screen-reader swipes. A value
 * between steps moves to the next step in that direction.
 */
export function stepValue(value: number, direction: 1 | -1, step = SLIDER_STEP): number {
  const next = direction > 0 ? Math.floor(value / step) * step + step : Math.ceil(value / step) * step - step;
  return Math.min(Math.max(next, 0), 100);
}
