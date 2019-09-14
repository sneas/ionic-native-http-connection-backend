import { getSerializerTypeByContentType } from './data-serializer';

describe('getSerializerTypeByContentType', () => {
    it('should detect utf8 by text/', () => {
        expect(getSerializerTypeByContentType('tExT/someThing')).toBe('utf8');
    });

    it('should detect json by application/json', () => {
        expect(getSerializerTypeByContentType('appLiCation/JSON')).toBe('json');
    });

    it('should detect urlencoded by application/x-www-form-urlencoded', () => {
        expect(
            getSerializerTypeByContentType('apPlicAtion/x-www-FORM-urlEncoded'),
        ).toBe('urlencoded');
    });

    it('should give up sometimes', () => {
        expect(getSerializerTypeByContentType('something/unexpected')).toBe(
            null,
        );
    });
});
