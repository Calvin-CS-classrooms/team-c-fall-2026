// Tests editing whether a rating is anonymous from Your Rating History.
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { RatingHistoryRow } from '@/components/rating-history-row';
import type { Rating } from '@/types';

const rating: Rating = {
  id: 7,
  userId: 1,
  spaceId: 3,
  createdAt: new Date().toISOString(),
  numStars: 4,
  crowdRating: 40,
  perceivedNoise: 'lowBuzz',
  description: 'Fireplace was nice.',
  numUpvotes: 0,
  isAnonymous: false,
};

function render(props: Partial<Parameters<typeof RatingHistoryRow>[0]> = {}) {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <RatingHistoryRow rating={rating} name="Hekman Library 3rd Floor" onMarkHelpful={jest.fn()} {...props} />,
    );
  });
  return renderer;
}

function pressable(renderer: ReactTestRenderer, label: string) {
  return renderer.root.findAll(
    (node) => node.props.accessibilityLabel === label && typeof node.props.onPress === 'function',
  )[0];
}

function text(renderer: ReactTestRenderer) {
  return renderer.root
    .findAll((node) => typeof node.props.children === 'string')
    .map((node) => node.props.children as string)
    .join('\n');
}

describe('RatingHistoryRow editing', () => {
  it('has an Edit button on your own ratings', () => {
    const renderer = render({ onSetAnonymous: jest.fn() });

    expect(pressable(renderer, 'Edit rating for Hekman Library 3rd Floor')).toBeDefined();
  });

  it('has no Edit button when the rating cannot be edited', () => {
    expect(pressable(render(), 'Edit rating for Hekman Library 3rd Floor')).toBeUndefined();
  });

  it('shows a Post anonymously switch after tapping Edit, and saves the change', () => {
    const onSetAnonymous = jest.fn();
    const renderer = render({ onSetAnonymous });

    expect(pressable(renderer, 'Post anonymously')).toBeUndefined();
    act(() => pressable(renderer, 'Edit rating for Hekman Library 3rd Floor').props.onPress());
    act(() => pressable(renderer, 'Post anonymously').props.onPress());

    expect(onSetAnonymous).toHaveBeenCalledWith(true);
  });

  it('shows whether the rating is anonymous and turns the switch off for an anonymous rating', () => {
    const onSetAnonymous = jest.fn();
    const renderer = render({ rating: { ...rating, isAnonymous: true }, onSetAnonymous });

    expect(text(renderer)).toContain('Posted anonymously');
    act(() => pressable(renderer, 'Edit rating for Hekman Library 3rd Floor').props.onPress());
    act(() => pressable(renderer, 'Post anonymously').props.onPress());

    expect(onSetAnonymous).toHaveBeenCalledWith(false);
  });

  it('says the name is shown for a public rating', () => {
    expect(text(render({ onSetAnonymous: jest.fn() }))).toContain('Your name is shown');
  });

  it('closes the editor with Done', () => {
    const renderer = render({ onSetAnonymous: jest.fn() });

    act(() => pressable(renderer, 'Edit rating for Hekman Library 3rd Floor').props.onPress());
    act(() => pressable(renderer, 'Done editing').props.onPress());

    expect(pressable(renderer, 'Post anonymously')).toBeUndefined();
  });
});
