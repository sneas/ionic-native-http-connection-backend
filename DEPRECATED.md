# HttpModule

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

## Troubleshooting

### I followed installation and usage instructions but still receive CORS issue on app start

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
