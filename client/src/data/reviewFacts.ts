import { SURVEY_SPACES } from './surveySpaces';

export type ReviewTopic = 'sunlight' | 'windows' | 'window-charging' | 'nature' | 'renovation' | 'night-atmosphere';
export interface ReviewFact {
  locationId: string;
  topic: ReviewTopic;
  quote: string;
  answer: string;
}
// Human-reviewed annotations, not generated claims. Each exact quote must still
// occur in the original review before its fact can be used in an answer.
export const REVIEW_FACTS: ReviewFact[] = [
  {
    locationId: 'business-building', topic: 'sunlight',
    quote: 'During the day there is a lot of sunlight and so the place always feels good.',
    answer: 'The Business building review mentions plenty of sunlight during the day.',
  },
  {
    locationId: 'business-building', topic: 'windows',
    quote: "The one thing I've struggled to find there has been charging spots, usually by the 3 seats with tables near the windows.",
    answer: 'The Business building review mentions seats with tables near the windows.',
  },
  {
    locationId: 'business-building', topic: 'window-charging',
    quote: "The one thing I've struggled to find there has been charging spots, usually by the 3 seats with tables near the windows.",
    answer: 'The Business building reviewer struggled to find charging spots and mentions them near the window tables. This does not guarantee a plug at every seat.',
  },
  {
    locationId: 'north-hall', topic: 'windows',
    quote: 'The places facing the window help you admire nature while locking in your school work.',
    answer: 'The North Hall review describes places facing a window with views of nature.',
  },
  {
    locationId: 'north-hall', topic: 'nature',
    quote: 'The places facing the window help you admire nature while locking in your school work.',
    answer: 'The North Hall reviewer enjoyed looking at nature from the window-facing study places.',
  },
  {
    locationId: 'north-hall', topic: 'window-charging',
    quote: 'The downside is if you want to sit near the window, the plug might be a little far, so you might need an extension cable or long charger if you want to charge your laptop or electronic devices.',
    answer: 'The North Hall review says plugs can be far from window seats, so a long charger or extension cable may help.',
  },
  {
    locationId: 'business-building', topic: 'renovation',
    quote: "The rooms over there also are pretty empty and it's one of the well renovated spaces on campus.",
    answer: 'The Business building reviewer describes the space as well renovated.',
  },
  {
    locationId: 'business-building', topic: 'night-atmosphere',
    quote: "During the night there are usually no classes so it's pretty serene.",
    answer: 'The Business building reviewer describes nights as serene, with usually no classes. This is a survey observation, not a current schedule.',
  },
  {
    locationId: 'north-hall', topic: 'night-atmosphere',
    quote: "When late at night, it could also be a bit spooky because it's really quiet and there's barely anyone on that floor.",
    answer: 'The North Hall reviewer says it can feel spooky late at night because it is very quiet with few people around. This is their impression, not a safety assessment.',
  },
];
export function reviewEvidence(locationId: string, topics: ReviewTopic[]): ReviewFact[] {
  const space = SURVEY_SPACES.find(s => s.id === locationId);
  return REVIEW_FACTS.filter(fact => fact.locationId === locationId && topics.includes(fact.topic) && space?.review.includes(fact.quote));
}
