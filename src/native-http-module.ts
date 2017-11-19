import { NgModule } from '@angular/core';
import { HttpModule, XHRBackend } from '@angular/http';
import { NativeHttpBackend } from './native-http-backend';
import { NativeHttpFallback } from './native-http-fallback';
import { HTTP } from '@ionic-native/http';

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
