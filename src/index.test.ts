import { async, inject, TestBed } from '@angular/core/testing';
import {
    BaseResponseOptions, Headers, HttpModule, Request, RequestMethod, RequestOptions,
    ResponseOptions, XHRBackend
} from '@angular/http';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { HTTPError, NativeHttpBackend, NativeHttpConnection } from './index';

class HTTPMock extends HTTP {

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
}

describe('NativeHttpConnection', () => {
    let http: HTTPMock;

    beforeEach(() => {
        http = new HTTPMock();
    });

    it('throws error on request is not GET or POST', () => {
        expect(() => {
            const request = new Request(new RequestOptions());
            new NativeHttpConnection(request, http);
        }).toThrow();
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

        expect(http.post).toHaveBeenCalledWith(null, {
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
});
