import { Plugin, Cordova } from '@ionic-native/core';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Injectable } from '@angular/core';

@Plugin({
    pluginName: 'HTTP2',
    plugin: 'cordova-plugin-http2',
    pluginRef: 'cordovaHTTP2',
    repo: 'https://github.com/sneas/cordova-HTTP2',
    platforms: ['Android', 'iOS']
})
@Injectable()
export class HTTP2 extends HTTP {
    /* tslint:disable */
    @Cordova()
    postJson(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    @Cordova()
    put(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    @Cordova()
    delete(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }
    /* tslint:enable */
}
