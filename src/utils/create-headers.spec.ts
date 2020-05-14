import { buildHeaders, createHeaders } from './create-headers';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

describe('createHeaders', () => {
    it('should use existing content type', () => {
        expect(
            createHeaders(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com?a=b',
                    'Json Primitive',
                    {
                        headers: new HttpHeaders({
                            'CoNtEnt-TyPe': 'application/json',
                        }),
                    },
                ),
            ),
        ).toEqual({
            'CoNtEnt-TyPe': 'application/json',
        });
    });

    it('should use detected content type', () => {
        expect(
            createHeaders(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com?a=b',
                    'Json Primitive',
                ),
            ),
        ).toEqual({
            'Content-Type': 'text/plain',
        });
    });

    it('should not assign content type when it can not be detected', () => {
        expect(
            createHeaders(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com?a=b',
                    new FormData(),
                ),
            ),
        ).toEqual({});
    });
});

describe('buildHeaders', () => {
    it('should build a headers object', () => {
        expect(
            buildHeaders(
                new HttpHeaders({
                    a: ['a1', 'a2'],
                    b: ['b1'],
                    c: 'c1',
                }),
            ),
        ).toEqual({
            a: 'a1,a2',
            b: 'b1',
            c: 'c1',
        });
    });
});
