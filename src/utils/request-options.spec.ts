import { getRequestData, getRequestOptions } from './request-options';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

describe('getRequestOptions', () => {
    it('should skip data param in case of non-data request', () => {
        const request = new HttpRequest<any>('GET', 'http://something.com?a=b');
        expect(getRequestOptions(request)).toMatchSnapshot();
    });

    it('should include data param in case of data request', () => {
        const request = new HttpRequest<any>(
            'POST',
            'http://something.com?a=b',
            {
                a: 'b',
            },
        );
        expect(getRequestOptions(request)).toMatchSnapshot();
    });
});

describe('getRequestData', () => {
    it('returns body data as is in case of text request', () => {
        expect(
            getRequestData(
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

    it('properly returns data', () => {
        expect(
            getRequestData(
                new HttpRequest<any>('POST', 'http://something.com', 'a=b'),
            ),
        ).toEqual({
            data: {
                a: 'b',
            },
        });
    });
});
