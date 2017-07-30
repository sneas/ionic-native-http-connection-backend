import { Plugin, Cordova } from '@ionic-native/core';
import { HTTP as NativeHTTP, HTTPResponse } from '@ionic-native/http';
import { Injectable } from '@angular/core';

@Plugin({
    pluginName: 'HTTP',
    plugin: 'cordova-plugin-http',
    pluginRef: 'cordovaHTTP',
    repo: 'https://github.com/wymsee/cordova-HTTP',
    platforms: ['Android', 'iOS']
})
@Injectable()
export class HTTP extends NativeHTTP {
    /* tslint:disable */
    @Cordova()
    postJson(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    @Cordova()
    put(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    @Cordova()
    delete(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }
    /* tslint:enable */
}
