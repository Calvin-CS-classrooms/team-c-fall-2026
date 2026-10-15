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
});