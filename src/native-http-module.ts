import { NgModule } from '@angular/core';
import { HttpModule, XHRBackend } from '@angular/http';
import { HTTP } from './cordova-http-plugin';
import { NativeHttpBackend } from './native-http-backend';
import { NativeHttpFallback } from './native-http-fallback';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        HTTP,
        NativeHttpBackend,
        { provide: NativeHttpFallback, useClass: NativeHttpFallback, deps: [NativeHttpBackend, XHRBackend] },
    ]
})
export class NativeHttpModule {
}
