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

### Angular < 4.3

[DEPRECATED.md](DEPRECATED.md)

## Contributing

Contributing guidelines could be found in [CONTRIBUTING.md](CONTRIBUTING.md)

## Troubleshooting

[TROUBLESHOOTING.md](TROUBLESHOOTING.md)
