import {
    BaseResponseOptions,
    ConnectionBackend,
    Request,
    RequestMethod,
    RequestOptions,
} from '@angular/http';
import {
    NativeHttpBackendD,
    NativeHttpConnectionD,
} from './native-http-backend';
import { HTTP } from '@ionic-native/http';
import { NativeHttpFallbackD } from './native-http-fallback';
import { MockBackend } from '@angular/http/testing';

describe('NativeHttpFallbackD', () => {
    let nativeHttpFallback: NativeHttpFallbackD;
    let fallbackBackend: ConnectionBackend;
    let nativeHttpBackend: NativeHttpBackendD;

    beforeEach(() => {
        nativeHttpBackend = new NativeHttpBackendD(
            new HTTP(),
            new BaseResponseOptions(),
        );
        fallbackBackend = new MockBackend();
        nativeHttpFallback = new NativeHttpFallbackD(
            nativeHttpBackend,
            fallbackBackend,
        );
    });

    it('should return NativeHttpConnectionD in case of plugin exists and outgoing request', () => {
        nativeHttpFallback.forceNative(true);
        const connection = nativeHttpFallback.createConnection(
            new Request(
                new RequestOptions({
                    url: 'http://google.com',
                    method: RequestMethod.Post,
                }),
            ),
        );
        expect(connection instanceof NativeHttpConnectionD).toBeTruthy();
    });

    it('should return fallback connection in case of plugin exists and local request', () => {
        nativeHttpFallback.forceNative(true);
        const connection = nativeHttpFallback.createConnection(
            new Request(
                new RequestOptions({
                    url: '/api',
                    method: RequestMethod.Post,
                }),
            ),
        );
        expect(connection instanceof NativeHttpConnectionD).toBeFalsy();
    });

    it("should return fallback connection in case of plugin doesn't exist", () => {
        nativeHttpFallback.forceNative(false);
        const connection = nativeHttpFallback.createConnection(
            new Request(
                new RequestOptions({
                    method: RequestMethod.Post,
                }),
            ),
        );
        expect(connection instanceof NativeHttpConnectionD).toBeFalsy();
    });
});
