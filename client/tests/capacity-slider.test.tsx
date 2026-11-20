// Tests the crowd-rating slider's labels and screen-reader controls.
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { CapacitySlider } from '@/components/capacity-slider';

function render(value: number, onChange = jest.fn()) {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<CapacitySlider value={value} onChange={onChange} />);
  });
  return { renderer, onChange };
}

function adjustable(renderer: ReactTestRenderer) {
  return renderer.root.find((node) => node.props.accessibilityRole === 'adjustable' && node.props.onAccessibilityAction);
}

function text(renderer: ReactTestRenderer) {
  return renderer.root
    .findAll((node) => typeof node.props.children === 'string' || Array.isArray(node.props.children))
    .map((node) => [node.props.children].flat().join(''))
    .join('\n');
}

describe('CapacitySlider', () => {
  it('shows the value with its crowd level', () => {
    expect(text(render(40).renderer)).toContain('40% · Moderate');
    expect(text(render(10).renderer)).toContain('10% · Quiet');
    expect(text(render(90).renderer)).toContain('90% · Busy');
  });

  it('is adjustable by screen readers, with its value announced', () => {
    const slider = adjustable(render(40).renderer);

    expect(slider.props.accessibilityLabel).toBe('Crowd rating');
    expect(slider.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 40, text: '40%, Moderate' });
  });

  it('also sets the aria-value props, which is what the web reads', () => {
    const slider = adjustable(render(40).renderer);

    expect(slider.props).toEqual(
      expect.objectContaining({
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 40,
        'aria-valuetext': '40%, Moderate',
      }),
    );
  });

  it('steps up and down by 5% with screen-reader swipes', () => {
    const { renderer, onChange } = render(40);
    const slider = adjustable(renderer);

    act(() => slider.props.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } }));
    expect(onChange).toHaveBeenLastCalledWith(45);

    act(() => slider.props.onAccessibilityAction({ nativeEvent: { actionName: 'decrement' } }));
    expect(onChange).toHaveBeenLastCalledWith(35);
  });

  it('does not call onChange at the ends', () => {
    const { renderer, onChange } = render(100);

    act(() => adjustable(renderer).props.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('lets touches on the fill and thumb reach the track, so taps land where pressed', () => {
    const { renderer } = render(60);
    const fill = renderer.root.findByProps({ testID: 'slider-fill' });
    const thumb = renderer.root.findByProps({ testID: 'slider-thumb' });

    expect(fill.props.pointerEvents).toBe('none');
    expect(thumb.props.pointerEvents).toBe('none');
  });
});
