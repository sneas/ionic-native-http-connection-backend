import { Injectable } from '@angular/core';
import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { NativeHttpBackend } from './native-http-backend';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import { checkAvailability } from '@ionic-native/core';
import { checkExternalRequest } from './utils/check-external-request';

@Injectable()
export class NativeHttpFallback implements HttpBackend {
    constructor(
        private platform: Platform,
        private cordovaHttpBackend: NativeHttpBackend,
        private fallbackBackend: HttpBackend,
    ) {}

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return Observable.fromPromise(this.platform.ready()).switchMap(() => {
            /**
             * Native HTTP Cordova plugin doesn't like local requests
             */
            const isExternalRequest = checkExternalRequest(req);

            if (
                isExternalRequest &&
                checkAvailability('cordova.plugin.http') === true
            ) {
                return this.cordovaHttpBackend.handle(req);
            } else {
                return this.fallbackBackend.handle(req);
            }
        });
    }
}
