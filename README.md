# A solution to CORS problem of Ionic and WKWebView

[![travis build](https://img.shields.io/travis/sneas/ionic-native-http-connection-backend.svg?style=flat-square&maxAge=2592000)](https://travis-ci.org/sneas/ionic-native-http-connection-backend)
[![version](https://img.shields.io/npm/v/ionic-native-http-connection-backend.svg?style=flat-square)](http://npm.im/ionic-native-http-connection-backend)
[![MIT License](https://img.shields.io/npm/l/component-library.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## Motivation

Even though there is a way to solve CORS issue without changing server's response header by using [Cordova HTTP plugin](https://ionicframework.com/docs/native/http/), the problem is it works only on device and doesn't provide all the power of Angular's `Http` service.

This project's been born as a solution to CORS problem allowing to use Angular `Http` service in both environments: browser and device.

## Installation

```bash
npm install ionic-native-http-connection-backend --save
ionic cordova plugin add cordova-plugin-http2
```

## Usage

Add `NativeHttpModule` and `NativeHttpFallback` into your application's module

```typescript
import { NgModule } from '@angular/core';
import { NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';
import { RequestOptions, Http } from '@angular/http';

@NgModule({
    declarations: [],
    imports: [
        NativeHttpModule
    ],
    bootstrap: [],
    entryComponents: [],
    providers: [
        {provide: Http, useClass: Http, deps: [NativeHttpFallback, RequestOptions]}
    ],
})
export class AppModule {
}
```

## Known issues

* HTTP method `PATCH` is not supported
* `Response.url` is missing due to limitation of `cordova-HTTP` plugin

## Troubleshooting

### I followed the installation and usage instructions but still receive CORS issue on app start

Wrap the first request with `Platform.ready()`. The code will resemble the listing below.

```typescript
this.platform.ready().then(() => {
  this.http.get('url')
    // subscribe logic goes here
});
```

`ionic-native-http-connection-backend` uses `cordova-plugin-http2` to perform HTTP requests. There is a chance plugin could be initialized in few seconds after app has started. Using `ionic-native-http-connection-backend` before `cordova-plugin-http2` has been initialized falls it back to `XmlHttpRequest` usage.

The above instruction relates to requests performed on app start only. There is no need to wrap all the HTTP requests with `Platform.ready`.

This is a temporary solution. The issue has been created. Check https://github.com/sneas/ionic-native-http-connection-backend/issues/14 for it's status.