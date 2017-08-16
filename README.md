# A solution to CORS problem with Ionic 3 and WKWebView

[![travis build](https://img.shields.io/travis/sneas/ionic-native-http-connection-backend.svg?style=flat-square&maxAge=2592000)](https://travis-ci.org/sneas/ionic-native-http-connection-backend)
[![version](https://img.shields.io/npm/v/ionic-native-http-connection-backend.svg?style=flat-square)](http://npm.im/ionic-native-http-connection-backend)
[![MIT License](https://img.shields.io/npm/l/component-library.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## Motivation

Even though there is a way to solve CORS issue without changing server's response header by using [Cordova HTTP plugin](https://ionicframework.com/docs/native/http/), the problem is it works only on device and doesn't provide all the power of Angular's `Http` service.

This project's been born as a solution to CORS problem allowing to use Angular `Http` service in both environments: browser and device.

## Installation

```bash
npm install ionic-native-http-connection-backend --save
ionic cordova plugin add https://github.com/sneas/cordova-HTTP
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