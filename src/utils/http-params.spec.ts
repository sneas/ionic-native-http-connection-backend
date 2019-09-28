import { bodyToObject, queryToObject } from './http-params';
import { HttpParams } from '@angular/common/http';

describe('queryToObject', () => {
    it('converts query to object', () => {
        expect(queryToObject('a=b&c=d')).toEqual({
            a: 'b',
            c: 'd',
        });
    });

    it('handles empty strings', () => {
        expect(queryToObject('')).toEqual({});
    });
});

describe('bodyToObject', () => {
    it('handles strings', () => {
        expect(bodyToObject('a=b')).toEqual({ a: 'b' });
    });

    it('handles HttpParams', () => {
        expect(
            bodyToObject(new HttpParams({ fromObject: { a: 'b' } })),
        ).toEqual({ a: 'b' });
    });

    it('returns body as is', () => {
        expect(bodyToObject({ a: 'b' })).toEqual({ a: 'b' });
    });

    it('should parse json body', () => {
        expect(bodyToObject('{"a": "b"}')).toEqual({ a: 'b' });
    });
});
