import {
    BaseResponseOptions, ConnectionBackend, Request, RequestMethod, RequestOptions
} from '@angular/http';
import { NativeHttpBackend, NativeHttpConnection } from './native-http-backend';
import { HTTP } from '@ionic-native/http';
import { NativeHttpFallback } from './native-http-fallback';
import { MockBackend } from '@angular/http/testing';

describe('NativeHttpFallback', () => {
    let nativeHttpFallback: NativeHttpFallback;
    let fallbackBackend: ConnectionBackend;
    let nativeHttpBackend: NativeHttpBackend;

    beforeEach(() => {
        nativeHttpBackend = new NativeHttpBackend(new HTTP(), new BaseResponseOptions());
        fallbackBackend = new MockBackend();
        nativeHttpFallback = new NativeHttpFallback(nativeHttpBackend, fallbackBackend);
    });

    it('should return NativeHttpConnection in case of plugin exists and outgoing request', () => {
        nativeHttpFallback.forceNative(true);
        const connection = nativeHttpFallback.createConnection(new Request(new RequestOptions({
            url: 'http://google.com',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeTruthy();
    });

    it('should return fallback connection in case of plugin exists and local request', () => {
        nativeHttpFallback.forceNative(true);
        const connection = nativeHttpFallback.createConnection(new Request(new RequestOptions({
            url: '/api',
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });

    it('should return fallback connection in case of plugin doesn\'t exist', () => {
        nativeHttpFallback.forceNative(false);
        const connection = nativeHttpFallback.createConnection(new Request(new RequestOptions({
            method: RequestMethod.Post
        })));
        expect(connection instanceof NativeHttpConnection).toBeFalsy();
    });
});
