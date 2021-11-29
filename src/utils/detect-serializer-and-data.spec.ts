import { detectSerializerAndData } from './detect-serializer-and-data';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

describe('detectSerializerAndData', () => {
    it('should should skip data and use urlencoded serializer for non-data requests', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>('GET', 'http://something.com?a=b'),
            ),
        ).toStrictEqual({
            serializer: 'urlencoded',
        });
    });

    test('serializer: utf8, data as is, on "text/plain"', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'Free form text',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'text/plain',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: 'Free form text',
        });
    });

    test('serializer: utf8, data json string. On "application/json", body is a primitive', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'Free form text',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify('Free form text'),
        });
    });

    test('serializer: utf8, data json string. On "application/json", body is an object', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    { a: 'b' },
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify({ a: 'b' }),
        });
    });

    test('serializer: utf8, data json string. On "application/json", body is HttpParams', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    new HttpParams({
                        fromObject: { a: 'b', c: 'd' },
                    }),
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: new HttpParams({
                fromObject: { a: 'b', c: 'd' },
            }).toString(),
        });
    });

    test('serializer: utf8, data json string. On "application/json; charset=utf-8", body is a primitive', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'Free form text',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify('Free form text'),
        });
    });

    test('serializer: utf8, data json string. On "application/json; charset=utf-8", body is an object', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    { a: 'b' },
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify({ a: 'b' }),
        });
    });

    test('serializer: utf8, data json string. On "application/json; charset=utf-8", body is HttpParams', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    new HttpParams({
                        fromObject: { a: 'b', c: 'd' },
                    }),
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: new HttpParams({
                fromObject: { a: 'b', c: 'd' },
            }).toString(),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json", body is a primitive', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'Free form text',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify('Free form text'),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json", body is an object', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    { a: 'b' },
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify({ a: 'b' }),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json", body is HttpParams', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    new HttpParams({
                        fromObject: { a: 'b', c: 'd' },
                    }),
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: new HttpParams({
                fromObject: { a: 'b', c: 'd' },
            }).toString(),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json; charset=utf-8", body is a primitive', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'Free form text',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify('Free form text'),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json; charset=utf-8", body is an object', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    { a: 'b' },
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: JSON.stringify({ a: 'b' }),
        });
    });

    test('serializer: utf8, data json string. On "application/vnd+company.category+json; charset=utf-8", body is HttpParams', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    new HttpParams({
                        fromObject: { a: 'b', c: 'd' },
                    }),
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/vnd+company.category+json; charset=utf-8',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'utf8',
            data: new HttpParams({
                fromObject: { a: 'b', c: 'd' },
            }).toString(),
        });
    });

    test('serializer: urlencoded, body FormData. On unknown content type, body is HttpParams', () => {
        const expectedData = new FormData();
        expectedData.append('a', 'b');
        expectedData.append('c', 'd');

        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    new HttpParams({
                        fromObject: { a: 'b', c: 'd' },
                    }),
                ),
            ),
        ).toStrictEqual({
            serializer: 'urlencoded',
            data: { a: 'b', c: 'd' },
        });
    });

    test('serializer: multipart, body FormData. On unknown header, body is FormData', () => {
        const formData = new FormData();
        formData.append('a', 'b');
        formData.append('c', 'd');

        expect(
            detectSerializerAndData(
                new HttpRequest<any>('POST', 'http://something.com', formData),
            ),
        ).toStrictEqual({
            serializer: 'multipart',
            data: formData,
        });
    });

    test('serializer: urlencoded, body empty object. On null body', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>('POST', 'http://something.com', null),
            ),
        ).toStrictEqual({
            serializer: 'urlencoded',
            data: {},
        });
    });

    test('serializer: urlencoded, body empty object. On undefined body', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>('POST', 'http://something.com', undefined),
            ),
        ).toStrictEqual({
            serializer: 'urlencoded',
            data: {},
        });
    });

    test('serializer: urlencoded, body object. On anything else', () => {
        expect(
            detectSerializerAndData(
                new HttpRequest<any>(
                    'POST',
                    'http://something.com',
                    'a=b&c=d',
                    {
                        headers: new HttpHeaders({
                            'content-type': 'application/x-www-form-urlencoded',
                        }),
                    },
                ),
            ),
        ).toStrictEqual({
            serializer: 'urlencoded',
            data: { a: 'b', c: 'd' },
        });
    });
});
