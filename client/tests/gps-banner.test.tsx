// Tests the "Rate your current location" banner on Home in each location state.
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { GpsBanner } from '@/components/gps-banner';
import type { LocationStatus } from '@/hooks/use-current-building';
import type { Location } from '@/types';

const hekman: Location = {
  id: 1,
  name: 'Hekman Library',
  image: undefined,
  description: '',
  numFloors: 5,
  numSpaces: 5,
  hours: { openingTime: '07:00', closingTime: '01:00' },
};
const floors = [
  { spaceId: 2, label: 'Basement' },
  { spaceId: 3, label: '3rd Floor' },
];

function render(props: { status: LocationStatus; selectedSpaceId?: number; building?: Location }) {
  const handlers = { onSelectSpace: jest.fn(), onRate: jest.fn(), onRetry: jest.fn(), onTurnOn: jest.fn() };
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<GpsBanner floors={floors} {...handlers} {...props} />);
  });
  return { renderer, ...handlers };
}

function text(renderer: ReactTestRenderer) {
  return renderer.root
    .findAll((node) => typeof node.props.children === 'string')
    .map((node) => node.props.children as string)
    .join('\n');
}

function pressByLabel(renderer: ReactTestRenderer, label: string) {
  const node = renderer.root.findAll(
    (candidate) => candidate.props.accessibilityLabel === label && typeof candidate.props.onPress === 'function',
  )[0];
  act(() => node.props.onPress());
  return node;
}

describe('GpsBanner', () => {
  it('asks the student to turn on Geolocation when it is off', () => {
    const { renderer, onTurnOn } = render({ status: 'off' });

    expect(text(renderer)).toMatch(/turn on geolocation/i);
    pressByLabel(renderer, 'Turn on Geolocation in Profile');
    expect(onTurnOn).toHaveBeenCalled();
  });

  it('shows that it is looking for the building', () => {
    expect(text(render({ status: 'locating' }).renderer)).toMatch(/finding your building/i);
  });

  it.each([
    ['denied', /location permission is off/i],
    ['unavailable', /couldn't get your location/i],
    ['not-near', /not near a rated building/i],
  ] as const)('lets the student try again when %s', (status, message) => {
    const { renderer, onRetry } = render({ status });

    expect(text(renderer)).toMatch(message);
    pressByLabel(renderer, 'Check my location again');
    expect(onRetry).toHaveBeenCalled();
  });

  it('names the building and asks which floor the student is on', () => {
    const { renderer } = render({ status: 'found', building: hekman });

    const shown = text(renderer);
    expect(shown).toContain("You're at Hekman Library");
    expect(shown).toMatch(/which floor/i);
    expect(shown).toContain('Basement');
    expect(shown).toContain('3rd Floor');
  });

  it('reports the floor the student picks', () => {
    const { renderer, onSelectSpace } = render({ status: 'found', building: hekman });

    pressByLabel(renderer, "I'm on 3rd Floor");

    expect(onSelectSpace).toHaveBeenCalledWith(3);
  });

  it('only lets the student rate once a floor is picked', () => {
    const notPicked = render({ status: 'found', building: hekman });
    const rateBefore = notPicked.renderer.root.findAll(
      (node) => node.props.accessibilityLabel === 'Rate this floor' && typeof node.props.onPress === 'function',
    )[0];
    expect(rateBefore.props.disabled).toBe(true);

    const picked = render({ status: 'found', building: hekman, selectedSpaceId: 3 });
    expect(text(picked.renderer)).toContain('Hekman Library · 3rd Floor');
    pressByLabel(picked.renderer, 'Rate this floor');
    expect(picked.onRate).toHaveBeenCalled();
  });
});
