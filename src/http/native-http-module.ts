import { NgModule } from '@angular/core';
import { HttpModule, XHRBackend } from '@angular/http';
import { NativeHttpBackendD } from './native-http-backend';
import { NativeHttpFallbackD } from './native-http-fallback';
import { HTTP } from '@ionic-native/http';

/**
 * @deprecated and will be gone. Use NativeHttpModule instead
 */
@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        HTTP,
        NativeHttpBackendD,
        { provide: NativeHttpFallbackD, useClass: NativeHttpFallbackD, deps: [NativeHttpBackendD, XHRBackend] },
    ]
})
export class NativeHttpModuleD {
}
