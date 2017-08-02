import { NgModule } from '@angular/core';
import { XHRBackend } from '@angular/http';
import { HTTP } from './cordova-http-plugin';
import { NativeHttpBackend } from './native-http-backend';
import { NativeHttpFallback } from './native-http-fallback';

@NgModule({
    providers: [
        HTTP,
        NativeHttpBackend,
        { provide: NativeHttpFallback, useClass: NativeHttpFallback, deps: [NativeHttpBackend, XHRBackend] },
    ]
})
export class NativeHttpModule {
}
