import {
    BaseResponseOptions, BrowserXhr, ConnectionBackend, CookieXSRFStrategy, Request, RequestMethod, RequestOptions,
    XHRBackend,
    XSRFStrategy
} from '@angular/http';
import { NativeHttpBackend, NativeHttpConnection } from './native-http-backend';
import { HTTP } from './cordova-http-plugin';
import { NativeHttpFallback } from './native-http-fallback';
import { MockBackend } from '@angular/http/testing';

class XSRFStrategyMock implements XSRFStrategy {

    configureRequest(req: Request): void {
    }
}

describe('NativeHttpFallback', () => {
    let natviveHttpFallback: NativeHttpFallback;
    let fallbackBackend: ConnectionBackend;
    let nativeHttpBackend: NativeHttpBackend;

    beforeEach(() => {
        nativeHttpBackend = new NativeHttpBackend(new HTTP(), new BaseResponseOptions());
        fallbackBackend = new MockBackend();
        natviveHttpFallback = new NativeHttpFallback(nativeHttpBackend, fallbackBackend);
    });

    it('should return NativeHttpConnection in case of plugin exists and outgoing request', () => {
        natviveHttpFallback.forceNative(true);
        const connection = natviveHttpFallback.createConnection(new Request(new RequestOptions({
            url: 'http://google.com',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeTruthy();
    });

    it('should return fallback connection in case of plugin exists and local request', () => {
        natviveHttpFallback.forceNative(true);
        const connection = natviveHttpFallback.createConnection(new Request(new RequestOptions({
            url: '/api',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });

    it('should return fallback connection in case of plugin doesn\'t exist', () => {
        natviveHttpFallback.forceNative(false);
        const connection = natviveHttpFallback.createConnection(new Request(new RequestOptions({
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });
});
