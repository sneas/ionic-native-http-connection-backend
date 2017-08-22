import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Connection, ConnectionBackend, Headers, ReadyState, Request, RequestMethod, Response, ResponseOptions
} from '@angular/http';
import { HTTPResponse } from '@ionic-native/http';
import { Observer } from 'rxjs/Observer';
import {HTTP} from './cordova-http-plugin';

type HTTPRequestMethod = 'get' | 'post' | 'postJson' | 'put' | 'delete';

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
        const allowedRequestMethods = [
            RequestMethod.Get,
            RequestMethod.Post,
            RequestMethod.Put,
            RequestMethod.Delete
        ];

        if (allowedRequestMethods.indexOf(req.method) === -1) {
            throw 'Only GET, POST, PUT and DELETE methods are supported by the current Native HTTP version';
        }

        this.request = req;
        this.response = new Observable<Response>((responseObserver: Observer<Response>) => {

            const headers = req.headers.toJSON();
            Object.keys(headers).map(function(key) {
                if (headers[key].length > 1) {
                    throw `Header ${key} contains more than one value`
                }
                headers[key] = headers[key][0];
            });

            let body;

            // 1 stands for ContentType.JSON. Stupid Angular doesn't export ContentType
            if (req.detectContentTypeFromBody() === 1) {
                body = req.json();
            } else {
                body = this.getBodyParams(req.getBody());
            }

            const requestMethod = this.detectRequestMethod(req);

            /**
             * Request contains either encoded either decoded URL depended on the way
             * parameters are passed to Http component. Even though XMLHttpRequest automatically
             * converts unencoded URL, NativeHTTP requires it to be always encoded.
             */
            const url = encodeURI(decodeURI(req.url));

            nativeHttp[requestMethod](url, body, headers).then((response: HTTPResponse) => {
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

    private detectRequestMethod(req: Request) {
        let requestMethod: HTTPRequestMethod;

        switch (req.method) {
            case RequestMethod.Post:
                requestMethod = 'post';
                break;

            case RequestMethod.Put:
                requestMethod = 'put';
                break;

            case RequestMethod.Delete:
                requestMethod = 'delete';
                break;

            default:
                requestMethod = 'get';
        }

        // 1 stands for ContentType.JSON. Stupid Angular doesn't export ContentType
        if (req.detectContentTypeFromBody() === 1 && requestMethod === 'post') {
            requestMethod = 'postJson';
        }

        return requestMethod;
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
