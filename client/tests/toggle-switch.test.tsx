// Tests the custom on/off switch used on the Profile screen. It replaces
// React Native's Switch, which on the web shows a teal knob that sits above
// the track and looks raised and bouncy.
import { StyleSheet } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { SettingToggleRow } from '@/components/setting-toggle-row';
import { ToggleSwitch } from '@/components/toggle-switch';
import { Colors } from '@/constants/colors';

function render(element: React.ReactElement) {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(element);
  });
  return renderer;
}

// The pressable element announced to screen readers as a switch.
function switchNode(renderer: ReactTestRenderer) {
  return renderer.root.find(
    (node) => node.props.accessibilityRole === 'switch' && typeof node.props.onPress === 'function',
  );
}

function styleOf(renderer: ReactTestRenderer, testID: string) {
  return StyleSheet.flatten(renderer.root.findByProps({ testID }).props.style);
}

describe('ToggleSwitch', () => {
  it('is announced as a switch with its on/off state', () => {
    const on = render(<ToggleSwitch value onValueChange={jest.fn()} accessibilityLabel="Geolocation" />);
    const off = render(<ToggleSwitch value={false} onValueChange={jest.fn()} accessibilityLabel="Geolocation" />);

    expect(switchNode(on).props.accessibilityState).toEqual(expect.objectContaining({ checked: true }));
    expect(switchNode(off).props.accessibilityState).toEqual(expect.objectContaining({ checked: false }));
    expect(switchNode(on).props.accessibilityLabel).toBe('Geolocation');
  });

  it('also sets aria-checked, which is what the web reads', () => {
    const on = render(<ToggleSwitch value onValueChange={jest.fn()} />);
    const off = render(<ToggleSwitch value={false} onValueChange={jest.fn()} />);

    expect(switchNode(on).props['aria-checked']).toBe(true);
    expect(switchNode(off).props['aria-checked']).toBe(false);
  });

  it('asks for the opposite value when pressed', () => {
    const onValueChange = jest.fn();
    const on = render(<ToggleSwitch value onValueChange={onValueChange} />);
    act(() => switchNode(on).props.onPress());
    expect(onValueChange).toHaveBeenLastCalledWith(false);

    const off = render(<ToggleSwitch value={false} onValueChange={onValueChange} />);
    act(() => switchNode(off).props.onPress());
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it('uses a maroon track when on and a grey track when off', () => {
    expect(styleOf(render(<ToggleSwitch value onValueChange={jest.fn()} />), 'toggle-track').backgroundColor).toBe(
      Colors.maroon,
    );
    expect(
      styleOf(render(<ToggleSwitch value={false} onValueChange={jest.fn()} />), 'toggle-track').backgroundColor,
    ).toBe(Colors.border);
  });

  it('keeps a white knob inside the track in both states (no teal, no raised knob)', () => {
    for (const value of [true, false]) {
      const renderer = render(<ToggleSwitch value={value} onValueChange={jest.fn()} />);
      const track = styleOf(renderer, 'toggle-track');
      const knob = styleOf(renderer, 'toggle-knob');

      expect(knob.backgroundColor).toBe(Colors.white);
      expect(knob.height).toBeLessThan(track.height as number);
    }
  });

  it('does nothing when disabled', () => {
    const onValueChange = jest.fn();
    const renderer = render(<ToggleSwitch value onValueChange={onValueChange} disabled />);

    act(() => switchNode(renderer).props.onPress());

    expect(onValueChange).not.toHaveBeenCalled();
    expect(switchNode(renderer).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
  });
});

describe('SettingToggleRow', () => {
  it('toggles when the row is tapped, not just the switch', () => {
    const onValueChange = jest.fn();
    const renderer = render(
      <SettingToggleRow
        icon="navigate-outline"
        title="Geolocation"
        subtitle="Detect your current campus location"
        value
        onValueChange={onValueChange}
      />,
    );

    act(() => switchNode(renderer).props.onPress());

    expect(onValueChange).toHaveBeenCalledWith(false);
    expect(switchNode(renderer).props.accessibilityLabel).toBe('Geolocation');
    expect(switchNode(renderer).props['aria-checked']).toBe(true);
  });
});
