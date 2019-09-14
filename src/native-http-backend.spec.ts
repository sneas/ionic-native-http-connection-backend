import {
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';

import { HTTPMock } from './http.mock';
import { NativeHttpBackend } from './native-http-backend';

describe('NativeHttpBackend', () => {
    let http: HTTPMock;
    let httpBackend: NativeHttpBackend;

    // Shared test variables
    const textContentTypeValue: string = 'text/plain; charset=UTF8';
    const testXmlString = `<?xml version="1.0" encoding="UTF-8"?><note><body>test</body></note>`;

    beforeEach(() => {
        http = new HTTPMock();
        httpBackend = new NativeHttpBackend(http);
    });

    it('throws error on not allowed method', () => {
        expect(() => {
            const request = new HttpRequest(
                'OPTIONS',
                'http://some-url',
                'some-body',
            );
            httpBackend.handle(request);
        }).toThrow(
            'Only GET, POST, PUT, DELETE, PATCH and HEAD methods are supported by the current Native HTTP version',
        );
    });

    it('still works on errors with success status', (done: () => void) => {
        const request = new HttpRequest('POST', '', '');

        httpBackend
            .handle(request)
            .subscribe((response: HttpResponse<string>) => {
                expect(response.body).toEqual({});
                expect(response.status).toEqual(201);
                done();
            });

        http.requestReject({
            error: '{}',
            status: 201,
        });
    });

    it('initiates error when response is successful but status is not', done => {
        const request = new HttpRequest('POST', '', '');

        httpBackend.handle(request).subscribe(
            () => {
                done.fail();
            },
            (response: HttpErrorResponse) => {
                expect(response.status).toEqual(500);
                done();
            },
        );

        http.requestResolve({
            url: '',
            status: 500,
            headers: {},
        });
    });

    it('correctly transforms request body and headers to Native HTTP requirements', done => {
        const request = new HttpRequest('POST', 'http://test.com', 'a=b&c=d', {
            headers: new HttpHeaders({
                headerName1: ['headerValue1'],
                headerName2: ['headerValue2'],
            }),
        });

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                {
                    a: 'b',
                    c: 'd',
                },
                {
                    headerName1: 'headerValue1',
                    headerName2: 'headerValue2',
                },
            );
            done();
        });
    });

    it('does not transforms request body and transforms correctly headers to Native HTTP requirements (for Content-Type: text/*)', done => {
        const request = new HttpRequest(
            'POST',
            'http://test.com',
            testXmlString,
            {
                headers: new HttpHeaders({
                    headerName1: ['headerValue1'],
                    'Content-Type': [textContentTypeValue],
                }),
            },
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                testXmlString,
                {
                    headerName1: 'headerValue1',
                    'Content-Type': textContentTypeValue,
                },
            );
            done();
        });
    });

    it('loves and understands array as body', done => {
        const request = new HttpRequest('POST', 'http://test.com', ['a', 'b']);

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe(() => {
            expect(http.setDataSerializer).toHaveBeenCalledWith('json');
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                ['a', 'b'],
                expect.anything(),
            );
            done();
        });
    });

    it('loves and understands http-params as body', done => {
        const httpParamBody = new HttpParams().set('a', '1').set('b', '2');
        const request = new HttpRequest(
            'POST',
            'http://test.com',
            httpParamBody,
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe(() => {
            expect(http.setDataSerializer).toHaveBeenCalledWith('json');
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                { a: '1', b: '2' },
                expect.anything(),
            );
            done();
        });
    });

    it('uses urlencoded serialization for corresponding content type and http-param body', done => {
        const httpParamBody = new HttpParams()
            .append('a', '1')
            .append('b', '2');
        const request = new HttpRequest(
            'POST',
            'http://test.com',
            httpParamBody,
            {
                headers: new HttpHeaders({
                    'Content-Type': ['application/x-www-form-urlencoded'],
                }),
            },
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe(() => {
            expect(http.setDataSerializer).toHaveBeenCalledWith('urlencoded');
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                { a: '1', b: '2' },
                expect.anything(),
            );
            done();
        });
    });

    it('converts HTTPResponse headers object to Headers', done => {
        const request = new HttpRequest('POST', 'http://test.com', 'a=b&c=d');

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {
                    header1: 'value1',
                    header2: 'value2',
                },
            }),
        );

        httpBackend
            .handle(request)
            .subscribe((response: HttpResponse<Object>) => {
                expect(response.headers.get('header1')).toBe('value1');
                expect(response.headers.get('header2')).toBe('value2');
                done();
            });
    });

    it('passes get params to the plugin call', done => {
        const request = new HttpRequest('GET', 'http://test.com', {
            params: new HttpParams().append('a', 'b').append('c', 'd'),
        });

        spyOn(http, 'get').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.get).toBeCalledWith(
                'http://test.com?a=b&c=d',
                expect.anything(),
                expect.anything(),
            );
            done();
        });
    });

    it(`parses response body when responseType is json and body is string`, done => {
        const request = new HttpRequest('GET', 'http://test.com', {
            responseType: 'json',
        });

        spyOn(http, 'get').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{"a": "b"}',
            }),
        );

        httpBackend
            .handle(request)
            .subscribe((response: HttpResponse<Object>) => {
                expect(response.body).toEqual({ a: 'b' });
                done();
            });
    });

    it(`throws error when responseType is json and response body can't be parsed`, done => {
        const request = new HttpRequest('GET', 'http://test.com', {
            responseType: 'json',
        });

        spyOn(http, 'get').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '"a": "b"}',
            }),
        );

        httpBackend.handle(request).subscribe(
            () => {
                done.fail();
            },
            (error: HttpErrorResponse) => {
                expect(error.error.text).toEqual('"a": "b"}');
                done();
            },
        );
    });

    it(`returns body as is when responseType is json but body is not string`, done => {
        const request = new HttpRequest('GET', 'http://test.com', {
            responseType: 'json',
        });

        spyOn(http, 'get').and.returnValue(
            Promise.resolve({
                status: 500,
                data: [1, 2, 3],
            }),
        );

        httpBackend.handle(request).subscribe(
            () => {
                done.fail();
            },
            (response: HttpErrorResponse) => {
                expect(response.error).toEqual([1, 2, 3]);
                done();
            },
        );
    });

    it(`returns body as is when responseType is not json`, done => {
        const request = new HttpRequest('GET', 'http://test.com', {
            responseType: 'text',
        });

        spyOn(http, 'get').and.returnValue(
            Promise.resolve({
                status: 200,
                data: 'Test response',
            }),
        );

        httpBackend
            .handle(request)
            .subscribe((response: HttpResponse<string>) => {
                expect(response.body).toEqual('Test response');
                done();
            });
    });

    it('should set json serializer when post json request', () => {
        const request = new HttpRequest('POST', 'http://test.com', { a: 'b' });

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe();
        expect(http.setDataSerializer).toHaveBeenCalledWith('json');
    });

    it('should set urlencode serializer when post plain request', () => {
        const request = new HttpRequest('POST', 'http://test.com', 'a=b');

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe();
        expect(http.setDataSerializer).toHaveBeenCalledWith('urlencoded');
    });

    it("should set utf8 serializer when sending request with header 'Content-Type: 'text/...'", () => {
        const request = new HttpRequest(
            'POST',
            'http://test.com',
            testXmlString,
            {
                headers: new HttpHeaders({
                    'Content-Type': [textContentTypeValue],
                }),
            },
        );

        spyOn(http, 'setDataSerializer');

        httpBackend.handle(request).subscribe();
        expect(http.setDataSerializer).toHaveBeenCalledWith('utf8');
    });

    it(`uses the first request header in case it is an array`, done => {
        const request = new HttpRequest('POST', 'http://test.com', 'a=b&c=d', {
            headers: new HttpHeaders({
                headerName1: ['header1Value1', 'header1Value2'],
                headerName2: 'header2Value1',
            }),
        });

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                {
                    headerName1: 'header1Value1',
                    headerName2: 'header2Value1',
                },
            );
            done();
        });
    });

    it('should encode URL', done => {
        const request = new HttpRequest(
            'POST',
            'http://api.com/get something?with= wierd variables ',
            'a=b&c=d',
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                'http://api.com/get%20something?with=%20wierd%20variables%20',
                expect.anything(),
                expect.anything(),
            );
            done();
        });
    });

    it('should not encode already encoded URL', done => {
        const request = new HttpRequest(
            'POST',
            'http://api.com/get%20something?with=%20wierd%20variables%20',
            'a=b&c=d',
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                'http://api.com/get%20something?with=%20wierd%20variables%20',
                expect.anything(),
                expect.anything(),
            );
            done();
        });
    });

    it('should not encode already encoded URL which includes reserved characters', done => {
        const request = new HttpRequest(
            'POST',
            'http://api.com/test?reserved=%3B%2C%2F%3F%3A%40%26%3D%2B%24%23',
            'a=b&c=d',
        );

        spyOn(http, 'post').and.returnValue(
            Promise.resolve({
                status: 200,
                data: '{}',
                headers: {},
            }),
        );

        httpBackend.handle(request).subscribe(() => {
            expect(http.post).toHaveBeenCalledWith(
                'http://api.com/test?reserved=%3B%2C%2F%3F%3A%40%26%3D%2B%24%23',
                expect.anything(),
                expect.anything(),
            );
            done();
        });
    });
});
