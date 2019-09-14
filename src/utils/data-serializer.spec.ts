import { getSerializerByContentType } from './data-serializer';

describe('getSerializerTypeByContentType', () => {
    it('should detect utf8 by text/', () => {
        expect(getSerializerByContentType('tExT/someThing')).toBe('utf8');
    });

    it('should detect json by application/json', () => {
        expect(getSerializerByContentType('appLiCation/JSON')).toBe('json');
    });

    it('should detect urlencoded by application/x-www-form-urlencoded', () => {
        expect(
            getSerializerByContentType('apPlicAtion/x-www-FORM-urlEncoded'),
        ).toBe('urlencoded');
    });

    it('should give up sometimes', () => {
        expect(getSerializerByContentType('something/unexpected')).toBe(null);
    });
});
