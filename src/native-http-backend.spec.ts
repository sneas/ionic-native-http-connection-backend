import {
    Headers, Request, RequestMethod, RequestOptions, Response
} from '@angular/http';
import { HTTPError, NativeHttpConnection } from './native-http-backend';
import { HTTP2, HTTPResponse } from './cordova-http-plugin';

class HTTPMock extends HTTP2 {

    requestResolve: (response: HTTPResponse) => void;
    requestReject: (error: HTTPError) => void;

    post(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    get(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    postJson(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    put(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    delete(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }
}

describe('NativeHttpConnection', () => {
    let http: HTTPMock;

    beforeEach(() => {
        http = new HTTPMock();
    });

    it('throws error on request is not GET or POST', () => {
        expect(() => {
            const request = new Request(new RequestOptions());
            /* tslint:disable */
            new NativeHttpConnection(request, http);
            /* tslint:enable */
        }).toThrow('Only GET, POST, PUT and DELETE methods are supported by the current Native HTTP version');
    });

    it('still works on errors with success status', (done: () => void) => {
        const request = new Request(new RequestOptions({
            method: RequestMethod.Post
        }));

        const connection = new NativeHttpConnection(request, http);

        connection.response.subscribe((result) => {
            expect(result.ok).toBeTruthy();
            done();
        });

        http.requestReject({
            error: '',
            status: 201
        });
    });

    it('initiates error when response is successful but status is not', (done) => {
        const request = new Request(new RequestOptions({
            method: RequestMethod.Post
        }));

        const connection = new NativeHttpConnection(request, http);

        connection.response.subscribe(
            () => {
                done.fail();
            },
            (response: Response) => {
                expect(response.ok).toBeFalsy();
                expect(response.status).toEqual(500);
                done();
            }
        );

        http.requestResolve({
            status: 500,
            headers: {}
        });
    });

    it('initiates error when response is rejected and status is unknown', (done) => {
        const request = new Request(new RequestOptions({
            method: RequestMethod.Post
        }));

        const connection = new NativeHttpConnection(request, http);

        connection.response.subscribe(
            () => {
                done.fail();
            },
            (response: Response) => {
                expect(response.ok).toBeFalsy();
                expect(response.status).toEqual(599);
                done();
            }
        );

        http.requestReject({
            error: ''
        });
    });

    it('correctly transforms request body and headers to Native HTTP requirements', () => {
        const request = new Request(new RequestOptions({
            method: RequestMethod.Post,
            body: 'a=b&c=d',
            headers: new Headers({
                'headerName1': ['headerValue1'],
                'headerName2': ['headerValue2']
            })
        }));

        spyOn(http, 'post').and.returnValue(new Promise(() => {}));

        const connection = new NativeHttpConnection(request, http);
        connection.response.subscribe();

        expect(http.post).toHaveBeenCalledWith(expect.anything(), {
            a: 'b',
            c: 'd'
        },
        {
            'headerName1': 'headerValue1',
            'headerName2': 'headerValue2'

        });
    });

    it('converts HTTPResponse headers object to Headers', (done) => {
        const request = new Request(new RequestOptions({
            method: RequestMethod.Post
        }));

        const connection = new NativeHttpConnection(request, http);

        connection.response.subscribe(
            (response) => {
                expect(response.headers.get('header1')).toBe('value1');
                expect(response.headers.get('header2')).toBe('value2');
                done();
            },
            () => {
                done.fail();
            }
        );

        http.requestResolve({
            status: 200,
            headers: {
                'header1': 'value1',
                'header2': 'value2'
            }
        });
    });

    it('should call postJson in case of post request and object as body', () => {
        spyOn(http, 'postJson').and.returnValue(new Promise(() => {}));

        const request = new Request(new RequestOptions({
            method: RequestMethod.Post,
            body: {a: 'b'},
            headers: new Headers({
                'headerName1': ['headerValue1']
            })
        }));

        const connection = new NativeHttpConnection(request, http);
        connection.response.subscribe();

        expect(http.postJson).toHaveBeenCalledWith(expect.anything(), {a: 'b'}, {headerName1: 'headerValue1'});
    });

    it('should throw error if request header contains more than one value', () => {
        expect(() => {
            const request = new Request(new RequestOptions({
                method: RequestMethod.Put,
                headers: new Headers({
                    'headerName1': ['headerValue1', 'headerValue2']
                })
            }));
            const connection = new NativeHttpConnection(request, http);
            connection.response.subscribe();
        }).toThrow('Header headerName1 contains more than one value');
    });

    it('should encode URL', () => {
        spyOn(http, 'get').and.returnValue(new Promise(() => {}));

        const request = new Request(new RequestOptions({
            method: RequestMethod.Get,
            url: 'http://api.com/get something?with= wierd variables '
        }));
        const connection = new NativeHttpConnection(request, http);
        connection.response.subscribe();
        expect(http.get).toBeCalledWith(
            'http://api.com/get%20something?with=%20wierd%20variables%20',
            expect.anything(), expect.anything());
    });

    it('should not encode already encoded URL', () => {
        spyOn(http, 'get').and.returnValue(new Promise(() => {}));

        const request = new Request(new RequestOptions({
            method: RequestMethod.Get,
            url: 'http://api.com/get%20something?with=%20wierd%20variables%20'
        }));
        const connection = new NativeHttpConnection(request, http);
        connection.response.subscribe();
        expect(http.get).toBeCalledWith(
            'http://api.com/get%20something?with=%20wierd%20variables%20',
            expect.anything(), expect.anything());
    });
});
