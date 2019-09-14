import {
    HttpBackend,
    HttpErrorResponse,
    HttpEvent,
    HttpHeaders,
    HttpRequest,
    HttpResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, Observer } from 'rxjs';

import { HTTPError } from './http-error';
import { detectDataSerializerType } from './utils/data-serializer';

type HTTPRequestMethod =
    | 'get'
    | 'post'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'head';

type DataSerializerType = 'json' | 'urlencoded' | 'utf8';

type SendRequestOptions = Parameters<typeof HTTP.prototype.sendRequest>[1];

const XSSI_PREFIX = /^\)]}',?\n/;

const DATA_REQUEST_METHODS = ['POST', 'PUT', 'PATCH'];

@Injectable()
export class NativeHttpBackend implements HttpBackend {
    constructor(private nativeHttp: HTTP) {}

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        const allowedRequestMethods = [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'HEAD',
        ];

        if (allowedRequestMethods.indexOf(req.method.toUpperCase()) === -1) {
            throw 'Only GET, POST, PUT, DELETE, PATCH and HEAD methods are supported by the current Native HTTP version';
        }

        return new Observable((observer: Observer<HttpEvent<any>>) => {
            const headers = new Map<string, string>();
            req.headers.keys().map(function(key) {
                headers[key] = req.headers.get(key);
            });

            const requestMethod = req.method.toLowerCase() as HTTPRequestMethod;

            /**
             * Request contains either encoded either decoded URL depended on the way
             * parameters are passed to Http component. Even though XMLHttpRequest automatically
             * converts not encoded URL, NativeHTTP requires it to be always encoded.
             */
            const url = encodeURI(decodeURI(req.url)).replace(
                /%253B|%252C|%252F|%253F|%253A|%2540|%2526|%253D|%252B|%2524|%2523/g, // ;,/?:@&=+$#
                substring => '%' + substring.slice(3),
            );

            const fireResponse = (response: {
                body: string;
                status: number;
                headers: any;
            }) => {
                // ok determines whether the response will be transmitted on the event or
                // error channel. Unsuccessful status codes (not 2xx) will always be errors,
                // but a successful status code can still result in an error if the user
                // asked for JSON data and the body cannot be parsed as such.
                let ok = response.status >= 200 && response.status < 300;

                let body: any = response.body;

                // Check whether the body needs to be parsed as JSON (in many cases the browser
                // will have done that already).
                if (req.responseType === 'json' && typeof body === 'string') {
                    // Save the original body, before attempting XSSI prefix stripping.
                    const originalBody = body;
                    body = body.replace(XSSI_PREFIX, '');
                    try {
                        // Attempt the parse. If it fails, a parse error should be delivered to the user.
                        body = body !== '' ? JSON.parse(body) : null;
                    } catch (error) {
                        // Since the JSON.parse failed, it's reasonable to assume this might not have been a
                        // JSON response. Restore the original body (including any XSSI prefix) to deliver
                        // a better error response.
                        body = originalBody;

                        // If this was an error request to begin with, leave it as a string, it probably
                        // just isn't JSON. Otherwise, deliver the parsing error to the user.
                        if (ok) {
                            // Even though the response status was 2xx, this is still an error.
                            ok = false;
                            // The parse error contains the text of the body that failed to parse.
                            body = { error, text: body };
                        }
                    }
                }

                if (ok) {
                    // A successful response is delivered on the event stream.
                    observer.next(
                        new HttpResponse({
                            body,
                            headers: new HttpHeaders(response.headers),
                            status: response.status,
                        }),
                    );
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    observer.complete();
                } else {
                    // An unsuccessful request is delivered on the error channel.
                    observer.error(
                        new HttpErrorResponse({
                            // The error in this case is the response body (error from the server).
                            error: body,
                            headers: new HttpHeaders(response.headers),
                            status: response.status,
                        }),
                    );
                }
            };

            this.nativeHttp
                .sendRequest(
                    url,
                    this.buildRequestOptions(req, requestMethod, headers),
                )
                .then((response: HTTPResponse) => {
                    fireResponse({
                        body: response.data,
                        status: response.status,
                        headers: response.headers,
                    });
                })
                .catch((error: HTTPError) => {
                    fireResponse({
                        body: error.error,
                        status: error.status || 599, // https://httpstatuses.com/599
                        headers: error.headers,
                    });
                });
        });
    }

    private buildRequestOptions(
        req: HttpRequest<any>,
        requestMethod,
        headers,
    ): SendRequestOptions {
        let serializerType = detectDataSerializerType(req);
        const requestOptions: SendRequestOptions = {
            method: requestMethod,
            headers: { ...headers },
            serializer: serializerType,
        };
        if (req.responseType !== 'json') {
            requestOptions.responseType = req.responseType;
        }
        if (DATA_REQUEST_METHODS.indexOf(requestMethod.toUpperCase()) !== -1) {
            requestOptions.data = this.convertBody(req.body, serializerType);
        } else {
            requestOptions.params = this.convertHttpParams(req.params);
        }
        return requestOptions;
    }

    private convertBody(
        body: object | string | HttpParams,
        serializerType: DataSerializerType,
    ): { [x: string]: any } {
        let result;

        // if serializer utf8 it means body content type (text/...) should be string
        if (serializerType === 'utf8') {
            result = body;
        } else if (typeof body === 'string') {
            result = this.getBodyParams(body);
        } else if (Array.isArray(body)) {
            result = body;
        } else if (body instanceof HttpParams) {
            result = this.convertHttpParams(body);
        } else {
            result = { ...body };
        }
        return result;
    }

    private convertHttpParams(params: HttpParams): { [x: string]: any } {
        const result = {};
        for (let key of params.keys()) {
            result[key] = params.get(key);
        }
        return result;
    }

    private getBodyParams(query: string) {
        if (!query) {
            return {};
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params: { [name: string]: string }, param) => {
                let [key, value] = param.split('=');
                params[key] = value
                    ? decodeURIComponent(value.replace(/\+/g, ' '))
                    : '';
                return params;
            }, {});
    }
}
