import { isCalvinEmail } from '@/utils/verification';

describe( 'isCalvinEmail', () => {
    it( 'accepts vaid Calvin email addresses', () => {
        expect(isCalvinEmail( 'student@calvin.edu')).toBe(true);
        expect(isCalvinEmail( 'student@CALVIN.EDU')).toBe(true);
    });

    it( 'rejects email addresses from other domains', () => {
        expect(isCalvinEmail( 'student@gmail.com')).toBe(false);
        expect(isCalvinEmail( 'student@yahoo.com')).toBe(false);
        expect(isCalvinEmail( 'student@hotmail.com')).toBe(false);
    });

    it('rejects invalid or empty email addresses', () => {
        expect(isCalvinEmail( 'ntoanemail')).toBe(false);
        expect(isCalvinEmail( 'burneremail')).toBe(false);
        expect(isCalvinEmail('')).toBe(false);
    });

    it('trims surrounding whitespace before validating', () => {
        expect(isCalvinEmail('  student@calvin.edu  ')).toBe(true);
        expect(isCalvinEmail('\tstudent@calvin.edu\n')).toBe(true);
    });

    it('rejects lookalike domains that are not exactly calvin.edu', () => {
        expect(isCalvinEmail('student@calvin.edu.evil.com')).toBe(false);
        expect(isCalvinEmail('student@notcalvin.edu')).toBe(false);
        expect(isCalvinEmail('student@calvin.education')).toBe(false);
        expect(isCalvinEmail('student@calvin.edu ')).toBe(true);
    });

    it('rejects malformed local parts and missing @', () => {
        expect(isCalvinEmail('student@')).toBe(false);
        expect(isCalvinEmail('@calvin.edu')).toBe(false);
        expect(isCalvinEmail('student@calvin')).toBe(false);
        expect(isCalvinEmail('student calvin.edu')).toBe(false);
    });

    it('accepts valid special characters in the local part', () => {
        expect(isCalvinEmail('first.last+tag@calvin.edu')).toBe(true);
        expect(isCalvinEmail('first_last%tag@calvin.edu')).toBe(true);
    });
});