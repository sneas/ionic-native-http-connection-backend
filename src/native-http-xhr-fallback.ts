import { ConnectionBackend, Request, XHRBackend, Connection } from '@angular/http';
import { Injectable } from '@angular/core';
import { NativeHttpBackend } from './native-http-backend';
import { checkAvailability } from '@ionic-native/core';

@Injectable()
export class NativeHttpXhrFallback implements ConnectionBackend {

    protected nativeIsForced: boolean | null = null;
    protected nativeIsAvailable: boolean | null = null;

    constructor(
        private nativeHttpBackend: NativeHttpBackend,
        private xhrBackend: XHRBackend
    ) {
    }

    createConnection(request: Request): Connection {
        /**
         * Native HTTP Cordova plugin doesn't like local requests
         *
         * @type {boolean}
         */
        const isOutgoingRequest = /^(http|https):\/\//.test(request.url);

        if (isOutgoingRequest && this.isNativeHttpAvailable()) {
            return this.nativeHttpBackend.createConnection(request);
        } else {
            return this.xhrBackend.createConnection(request);
        }
    }

    /**
     * Enable/disable forced native HTTP usage without preliminary check. Helpful for unit testing
     *
     * @param {boolean} isEnabled
     */
    forceNative(isEnabled: boolean) {
        this.nativeIsForced = isEnabled;
    }

    protected isNativeHttpAvailable() {
        if (this.nativeIsForced !== null) {
            return this.nativeIsForced;
        }

        if (this.nativeIsAvailable === null) {
            this.nativeIsAvailable = checkAvailability('cordovaHTTP') === true;
        }

        return this.nativeIsAvailable;
    }
}
