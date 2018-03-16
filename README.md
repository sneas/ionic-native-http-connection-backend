# A solution to CORS problem of Ionic and WKWebView

[![travis build](https://img.shields.io/travis/sneas/ionic-native-http-connection-backend.svg?style=flat-square&maxAge=2592000)](https://travis-ci.org/sneas/ionic-native-http-connection-backend)
[![version](https://img.shields.io/npm/v/ionic-native-http-connection-backend.svg?style=flat-square)](http://npm.im/ionic-native-http-connection-backend)
[![MIT License](https://img.shields.io/npm/l/component-library.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## Motivation

Even though there is a way to solve CORS issue without changing server's response header by using [Cordova HTTP plugin](https://ionicframework.com/docs/native/http/), the problem is it works only on device and doesn't provide all the power of Angular's `Http` and `HttpClient` services.

This project's been born as a solution to CORS problem allowing to use Angular's `Http` and `HttpClient` services in both environments: browser and device.

## Installation

```bash
npm install --save @ionic-native/http ionic-native-http-connection-backend
ionic cordova plugin add cordova-plugin-advanced-http
```

## Usage

Angular > 4.3 provides two modules for HTTP requests:

- `HttpClientModule` (imports from `@angular/common/http`).
- Deprecated `HttpModule` (imports from `@angular/http`).

`ionic-native-http-connection-backend` supports both modules.

### HttpClientModule (@angular/common/http)

Add `NativeHttpModule` and `NativeHttpFallback` into the application's module

```typescript
import { NgModule } from '@angular/core';
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { Platform } from 'ionic-angular';

@NgModule({
    declarations: [],
    imports: [
        NativeHttpModule
    ],
    bootstrap: [],
    entryComponents: [],
    providers: [
        {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
    ],
})
export class AppModule {
}
```

### Deprecated HttpModule (@angular/http)

Add `NativeHttpModuleD` and `NativeHttpFallbackD` into the application's module

```typescript
import { NgModule } from '@angular/core';
import { NativeHttpFallbackD, NativeHttpModuleD } from 'ionic-native-http-connection-backend';
import { RequestOptions, Http } from '@angular/http';

@NgModule({
    declarations: [],
    imports: [
        NativeHttpModuleD
    ],
    bootstrap: [],
    entryComponents: [],
    providers: [
        {provide: Http, useClass: Http, deps: [NativeHttpFallbackD, RequestOptions]}
    ],
})
export class AppModule {
}
```

## Contributing

Contributing guidelines could be found in [CONTRIBUTING.md](CONTRIBUTING.md)

## Troubleshooting

### (HttpModule, @angular/http) I followed installation and usage instructions but still receive CORS issue on app start

Wrap the first request with `Platform.ready()`. The code will resemble the listing below.

```typescript
this.platform.ready().then(() => {
  this.http.get('url')
    // subscribe logic goes here
});
```

`ionic-native-http-connection-backend` uses `cordova-plugin-advanced-http` to perform HTTP requests. There is a chance plugin could be initialized in few seconds after app has started. Using `ionic-native-http-connection-backend` before `cordova-plugin-advanced-http` has been initialized falls it back to `XmlHttpRequest` usage.

The above instruction relates to requests performed on app start only. There is no need to wrap all the HTTP requests with `Platform.ready`.

This is a temporary solution. The issue has been created. Check https://github.com/sneas/ionic-native-http-connection-backend/issues/14 for it's status.

### I followed the installation and usage instructions but still experience CORS issues on device

Sometimes `cordova-plugin-advanced-http` displays as installed but in fact it's not which forces the lib to fall back to XMLHttpRequest usage.

To make sure `cordova-plugin-advanced-http` is installed correctly and works properly change any project's page class to correspond the code below. The example below is for `HomePage`.

```typescript
import { Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

export class HomePage {
    constructor(
        private platform: Platform,
        private nativeHttp: HTTP,
    ) {
        this.platform.ready().then(() => {
            this.nativeHttp.post('https://httpbin.org/post', {a: 'b'}, {})
                .then(() => {
                    console.log('cordova-plugin-advanced-http is installed properly');
                });
        });
    }
}
```

Run the app on device and watch console output. Absence of the message `cordova-plugin-advanced-http is installed properly` in console output says `cordova-plugin-advanced-http` has not been installed or recognized. Try to reinstall it and give it another chance.