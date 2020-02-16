import {
    HttpBackend,
    HttpErrorResponse,
    HttpEvent,
    HttpHeaders,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, Observer } from 'rxjs';

import { HTTPError } from './http-error';
import { getRequestOptions } from './utils/request-options';

const XSSI_PREFIX = /^\)]}',?\n/;

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
                .sendRequest(req.urlWithParams, getRequestOptions(req))
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
}
