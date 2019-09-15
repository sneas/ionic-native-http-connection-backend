import { paramsOrData } from './request-options';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

describe('paramsOrData', () => {
    it('detects params', () => {
        expect(
            paramsOrData(
                new HttpRequest<any>('GET', 'http://something.com', {
                    params: new HttpParams({ fromString: 'a=b' }),
                }),
            ),
        ).toEqual({
            params: {
                a: 'b',
            },
        });
    });

    it('returns body data as is in case of text request', () => {
        expect(
            paramsOrData(
                new HttpRequest<any>('POST', 'http://something.com', 'a=b', {
                    headers: new HttpHeaders({
                        'content-type': 'text/plain',
                    }),
                }),
            ),
        ).toEqual({
            data: 'a=b',
        });
    });

    it('detects data', () => {
        expect(
            paramsOrData(
                new HttpRequest<any>('POST', 'http://something.com', 'a=b'),
            ),
        ).toEqual({
            data: {
                a: 'b',
            },
        });
    });
});
