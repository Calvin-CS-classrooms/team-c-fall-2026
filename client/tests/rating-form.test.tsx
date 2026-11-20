// Tests the rating form's two-step space picker: choose a building first, then
// a floor or area inside it.
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { RatingForm } from '@/components/rating-form';
import { AppProvider } from '@/context/app-context';
import { getLocationById } from '@/data/locations';
import { spaces } from '@/data/spaces';
import type { NewRatingInput } from '@/types';

function renderForm(props: { initialSpaceId?: number; defaultAnonymous?: boolean } = {}) {
  const onSubmit = jest.fn<void, [NewRatingInput]>();
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <AppProvider>
        <RatingForm {...props} onSubmit={onSubmit} />
      </AppProvider>,
    );
  });
  return { renderer, onSubmit };
}

// Finds a pressable element by its accessibility label.
function pressable(renderer: ReactTestRenderer, label: string) {
  return renderer.root.find(
    (node) => node.props.accessibilityLabel === label && typeof node.props.onPress === 'function',
  );
}

function press(renderer: ReactTestRenderer, label: string) {
  act(() => pressable(renderer, label).props.onPress());
}

// Labels of the options currently listed whose label starts with `prefix`.
function optionLabels(renderer: ReactTestRenderer, prefix: string): string[] {
  const labels = renderer.root
    .findAll((node) => typeof node.props.onPress === 'function' && String(node.props.accessibilityLabel).startsWith(prefix))
    .map((node) => String(node.props.accessibilityLabel).slice(prefix.length));
  return [...new Set(labels)];
}

const buildingNames = [...new Set(spaces.map((space) => getLocationById(space.locationId)?.name))];

describe('RatingForm space picker', () => {
  it('lists each building once', () => {
    const { renderer } = renderForm();

    press(renderer, `Building: ${buildingNames[0]}`);

    const listed = optionLabels(renderer, 'Choose building ');
    expect(listed).toEqual(buildingNames);
    expect(listed.filter((name) => name === 'Hekman Library')).toHaveLength(1);
  });

  it("lists only the chosen building's floors and areas", () => {
    const { renderer } = renderForm();

    press(renderer, 'Building: Hekman Library');
    press(renderer, 'Choose building Commons Dining Hall');
    press(renderer, 'Floor or area: Commons Main Floor');

    expect(optionLabels(renderer, 'Choose space ')).toEqual(['Commons Main Floor', 'Commons Grille Side']);
  });

  it('submits the floor chosen inside the building', () => {
    const { renderer, onSubmit } = renderForm();

    press(renderer, 'Building: Hekman Library');
    press(renderer, 'Choose building Hekman Library');
    press(renderer, 'Floor or area: Hekman Library Basement');
    press(renderer, 'Choose space Hekman Library 3rd Floor');
    press(renderer, 'Submit rating');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ spaceId: 3 }));
  });

  it("switching buildings selects the new building's first space", () => {
    const { renderer, onSubmit } = renderForm({ initialSpaceId: 4 });

    press(renderer, 'Building: Hekman Library');
    press(renderer, 'Choose building Commons Dining Hall');
    press(renderer, 'Submit rating');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ spaceId: 5 }));
  });

  it('keeps the chosen floor when the same building is picked again', () => {
    const { renderer, onSubmit } = renderForm({ initialSpaceId: 3 });

    press(renderer, 'Building: Hekman Library');
    press(renderer, 'Choose building Hekman Library');
    press(renderer, 'Submit rating');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ spaceId: 3 }));
  });

  it('preselects the building and floor of initialSpaceId', () => {
    const { renderer } = renderForm({ initialSpaceId: 4 });

    expect(pressable(renderer, 'Building: Hekman Library')).toBeDefined();
    expect(pressable(renderer, 'Floor or area: Hekman Library 4th Floor')).toBeDefined();
  });
});

describe('RatingForm anonymity', () => {
  function anonymousSwitch(renderer: ReactTestRenderer) {
    return renderer.root.find(
      (node) =>
        node.props.accessibilityRole === 'switch' &&
        node.props.accessibilityLabel === 'Post anonymously' &&
        typeof node.props.onPress === 'function',
    );
  }

  it('has a Post anonymously switch, off by default', () => {
    const { renderer } = renderForm();

    expect(anonymousSwitch(renderer).props.accessibilityState).toEqual(expect.objectContaining({ checked: false }));
  });

  it('starts on when the student has Anonymous Mode on', () => {
    const { renderer } = renderForm({ defaultAnonymous: true });

    expect(anonymousSwitch(renderer).props.accessibilityState).toEqual(expect.objectContaining({ checked: true }));
  });

  it('submits the choice with the rating', () => {
    const { renderer, onSubmit } = renderForm();

    act(() => anonymousSwitch(renderer).props.onPress());
    press(renderer, 'Submit rating');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ isAnonymous: true }));
  });

  it('submits with the name shown when the switch is left off', () => {
    const { renderer, onSubmit } = renderForm();

    press(renderer, 'Submit rating');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ isAnonymous: false }));
  });
});
