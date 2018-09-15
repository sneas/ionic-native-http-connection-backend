import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checkAvailability } from '@ionic-native/core';
import { Platform } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NativeHttpBackend } from './native-http-backend';
import { checkExternalRequest } from './utils/check-external-request';

@Injectable()
export class NativeHttpFallback implements HttpBackend {
    constructor(
        private platform: Platform,
        private cordovaHttpBackend: NativeHttpBackend,
        private fallbackBackend: HttpBackend,
    ) {}

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return from(this.platform.ready()).pipe(
            switchMap(() => {
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
            }),
        );
    }
}
