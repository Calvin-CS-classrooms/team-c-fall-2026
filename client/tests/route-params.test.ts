// Tests reading a space id from a route parameter, e.g. /ratings?spaceId=3.
import { spaceIdFromParam } from '@/utils/route-params';

describe('spaceIdFromParam', () => {
  it('reads a numeric id', () => {
    expect(spaceIdFromParam('3')).toBe(3);
  });

  it('uses the first value when the param is repeated', () => {
    expect(spaceIdFromParam(['21', '4'])).toBe(21);
  });

  it('ignores a missing, empty, or non-numeric param', () => {
    expect(spaceIdFromParam(undefined)).toBeUndefined();
    expect(spaceIdFromParam('')).toBeUndefined();
    expect(spaceIdFromParam('abc')).toBeUndefined();
    expect(spaceIdFromParam('3.5')).toBeUndefined();
  });
});
