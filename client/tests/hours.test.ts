// Tests deciding whether a building is open at a given time from its
// "HH:MM" opening and closing times, including hours that run past midnight.
import { isOpenAt } from '@/utils/hours';

// A local date on Nov 13, 2026 at the given hour and minute.
const at = (hour: number, minute = 0) => new Date(2026, 10, 13, hour, minute);

describe('isOpenAt', () => {
  const daytime = { openingTime: '07:00', closingTime: '22:00' };

  it('is open between opening and closing time', () => {
    expect(isOpenAt(daytime, at(12))).toBe(true);
  });

  it('opens exactly at the opening time and closes exactly at the closing time', () => {
    expect(isOpenAt(daytime, at(7, 0))).toBe(true);
    expect(isOpenAt(daytime, at(6, 59))).toBe(false);
    expect(isOpenAt(daytime, at(21, 59))).toBe(true);
    expect(isOpenAt(daytime, at(22, 0))).toBe(false);
  });

  it('handles hours that run past midnight', () => {
    // Hekman Library: 7:00 AM to 1:00 AM.
    const lateNight = { openingTime: '07:00', closingTime: '01:00' };

    expect(isOpenAt(lateNight, at(23, 30))).toBe(true);
    expect(isOpenAt(lateNight, at(0, 30))).toBe(true);
    expect(isOpenAt(lateNight, at(1, 0))).toBe(false);
    expect(isOpenAt(lateNight, at(4))).toBe(false);
    expect(isOpenAt(lateNight, at(7))).toBe(true);
  });

  it('treats a midnight closing time as the end of the day', () => {
    const untilMidnight = { openingTime: '07:00', closingTime: '00:00' };

    expect(isOpenAt(untilMidnight, at(23, 59))).toBe(true);
    expect(isOpenAt(untilMidnight, at(0, 0))).toBe(false);
    expect(isOpenAt(untilMidnight, at(6))).toBe(false);
  });

  it('treats equal opening and closing times as open all day', () => {
    expect(isOpenAt({ openingTime: '00:00', closingTime: '00:00' }, at(3))).toBe(true);
  });

  it('returns undefined when the hours are missing or malformed', () => {
    expect(isOpenAt(undefined, at(12))).toBeUndefined();
    expect(isOpenAt({ openingTime: '7am', closingTime: '22:00' }, at(12))).toBeUndefined();
  });
});
