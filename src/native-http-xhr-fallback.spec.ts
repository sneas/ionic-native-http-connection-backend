import {
    BaseResponseOptions, BrowserXhr, CookieXSRFStrategy, Request, RequestMethod, RequestOptions, XHRBackend
} from '@angular/http';
import { NativeHttpBackend, NativeHttpConnection } from './native-http-backend';
import { HTTP } from './cordova-http-plugin';
import { NativeHttpXhrFallback } from './native-http-xhr-fallback';

describe('NativeHttpXhrFallback', () => {
    let xhrFallback: NativeHttpXhrFallback;
    let xhrBackend: XHRBackend;
    let nativeHttpBackend: NativeHttpBackend;

    beforeEach(() => {
        nativeHttpBackend = new NativeHttpBackend(new HTTP(), new BaseResponseOptions());
        xhrBackend = new XHRBackend(new BrowserXhr(), new BaseResponseOptions(), new CookieXSRFStrategy());
        xhrFallback = new NativeHttpXhrFallback(nativeHttpBackend, xhrBackend);
    });

    it('should return NativeHttpConnection in case of plugin exists and outgoing request', () => {
        xhrFallback.forceNative(true);
        const connection = xhrFallback.createConnection(new Request(new RequestOptions({
            url: 'http://google.com',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeTruthy();
    });

    it('should return fallback connection in case of plugin exists and local request', () => {
        xhrFallback.forceNative(true);
        const connection = xhrFallback.createConnection(new Request(new RequestOptions({
            url: '/api',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });

    it('should return fallback connection in case of plugin doesn\'t exist', () => {
        xhrFallback.forceNative(false);
        const connection = xhrFallback.createConnection(new Request(new RequestOptions({
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });
});
