import {
    detectSerializer,
    getSerializerByContentType,
    guessSerializer,
} from './data-serializer';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

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

describe('guessSerializer', () => {
    it('should predict json serializer', () => {
        expect(
            guessSerializer(
                new HttpRequest<any>('POST', 'http://test.com', {
                    a: 'b',
                }),
            ),
        ).toBe('json');
    });

    it('should predict urlencoded serializer', () => {
        expect(
            guessSerializer(
                new HttpRequest<any>('POST', 'http://test.com', 'a=b'),
            ),
        ).toBe('urlencoded');
    });

    it('should predict json when body is a JSON string', () => {
        expect(
            guessSerializer(
                new HttpRequest<any>('POST', 'http://test.com', '{"a": "b"}'),
            ),
        ).toBe('json');
    });
});

describe('detectSerializer', () => {
    it('should detect serializer based on content type', () => {
        expect(
            detectSerializer(
                new HttpRequest<any>('POST', 'http://test.com', 'a=b', {
                    headers: new HttpHeaders({
                        'content-type': 'text/plain',
                    }),
                }),
            ),
        ).toBe('utf8');
    });

    it('should guess serializer', () => {
        expect(
            detectSerializer(
                new HttpRequest<any>('POST', 'http://test.com', 'a=b'),
            ),
        ).toBe('urlencoded');
    });
});
