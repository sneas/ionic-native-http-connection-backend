import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Connection, ConnectionBackend, Headers, ReadyState, Request, RequestMethod, Response, ResponseOptions
} from '@angular/http';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Observer } from 'rxjs/Observer';
import mapValues from 'lodash-es/mapValues';

export interface HTTPError {
    error: string;
    status?: number;
    headers?: {[name: string]: string};
}

export class NativeHttpConnection implements Connection {
    request: Request;
    response: Observable<Response>;
    readyState: ReadyState;

    constructor(req: Request, nativeHttp: HTTP, baseResponseOptions?: ResponseOptions) {
        const allowedRequestMethods = [RequestMethod.Get, RequestMethod.Post];

        if (allowedRequestMethods.indexOf(req.method) === -1) {
            throw 'Only GET and POST request methods are supported by Native HTTP';
        }

        this.request = req;
        this.response = new Observable<Response>((responseObserver: Observer<Response>) => {

            const headers = mapValues(req.headers.toJSON(), (headerValues: string[]) => {
                return headerValues[0];
            });

            const requestMethod: 'get' | 'post' = req.method === RequestMethod.Get ? 'get' : 'post';

            const body = this.getBodyParams(req.getBody());

            nativeHttp[requestMethod](req.url, body, headers).then((response: HTTPResponse) => {
                this.fireResponse(responseObserver, new ResponseOptions({
                    body: response.data,
                    status: response.status,
                    headers: new Headers(response.headers)
                }), baseResponseOptions);
            }).catch((error: HTTPError) => {
                this.fireResponse(responseObserver, new ResponseOptions({
                    body: error.error,
                    status: error.status || 599, // https://httpstatuses.com/599
                    headers: new Headers(error.headers)
                }), baseResponseOptions);
            });
        });
    }

    private fireResponse(responseObserver: Observer<Response>, responseOptions: ResponseOptions,
                         baseResponseOptions?: ResponseOptions) {
        if (baseResponseOptions) {
            responseOptions = baseResponseOptions.merge(responseOptions);
        }

        const response = new Response(responseOptions);
        response.ok = (response.status >= 200 && response.status < 300);

        if (response.ok) {
            responseObserver.next(response);
            responseObserver.complete();
        } else {
            responseObserver.error(response);
        }
    }

    private getBodyParams(query: string) {
        if (!query) {
            return { };
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params: {[name: string]: string}, param) => {
                let [ key, value ] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {});
    }
}

@Injectable()
export class NativeHttpBackend implements ConnectionBackend {
    constructor(
        private nativeHttp: HTTP,
        private baseResponseOptions: ResponseOptions
    ) {
    }

    createConnection(request: Request): Connection {
        return new NativeHttpConnection(request, this.nativeHttp, this.baseResponseOptions);
    }
}
