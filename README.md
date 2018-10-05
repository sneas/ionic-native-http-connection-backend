# ionic-native-http-connection-backend

[![version](https://img.shields.io/npm/v/ionic-native-http-connection-backend.svg?style=flat-square)](http://npm.im/ionic-native-http-connection-backend)
[![MIT License](https://img.shields.io/npm/l/component-library.svg?style=flat-square)](http://opensource.org/licenses/MIT)

This library adds `@ionic-native/http` (when available) as a connection backend to Angular's `Http` and `HttpClient`

## Motivation

Now that Apple promotes/requires the use of `WKWebView` instead of the deprecated `UIWebView`, Ionic has switched newly created apps over via their [`cordova-plugin-ionic-webview`](https://github.com/ionic-team/cordova-plugin-ionic-webview) 
(and Cordova offers it via their [`cordova-plugin-wkwebview-engine`](https://github.com/apache/cordova-plugin-wkwebview-engine)). That causes requests that used to work just fine to fail with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) errors.

The real solution of course is to fix the CORS issues server side - but this may not be possible with e.g. 3rd party APIs.

Even though there is a way to solve CORS issues without changing server's response header by using [`@ionic-native/http`](https://ionicframework.com/docs/native/http/), this only works on device and doesn't provide all the power of Angular's `Http` and `HttpClient`.

## How it works

- The library provides a `HttpBackend` interface for Angular's `HttpClient`
- This `HttpBackend` interface tries to use `@ionic-native/http` whenever it is possible (= on device with installed plugin)
- If `HttpBackend` finds it impossible to use `@ionic-native/http`, it falls back to standard Angular code (`HttpXhrBackend`, which uses `XmlHttpRequest`)

This strategy allows developers to use Angular's `HttpClient` transparently in both environments: Browser and Device.

## Installation

```bash
npm install --save ionic-native-http-connection-backend
```

Then follow instructions at https://ionicframework.com/docs/native/http/#installation

## Usage

Add `NativeHttpModule`, `NativeHttpBackend` and `NativeHttpFallback` into the application's module

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

### Angular <4.3

[DEPRECATED.md](DEPRECATED.md)

## Contributing

Contributing guidelines could be found in [CONTRIBUTING.md](CONTRIBUTING.md)

## Troubleshooting

[TROUBLESHOOTING.md](TROUBLESHOOTING.md)
