# Troubleshooting

## I followed the installation and usage instructions but still experience CORS issues on device

Sometimes `cordova-plugin-advanced-http` displays as installed but in fact it's not which forces the lib to fall back to XMLHttpRequest usage.

To make sure `cordova-plugin-advanced-http` is installed correctly and works properly change any project's page class to correspond the code below. The example below is for `HomePage`.

```typescript
import { Platform } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

export class HomePage {
    constructor(
        private platform: Platform,
        private nativeHttp: HTTP,
    ) {
        this.platform.ready().then(() => {
            this.nativeHttp
                .sendRequest('https://httpbin.org/post', {
                    method: 'post',
                    data: { a: 'b' },
                    serializer: 'json',
                })
                .then(data => {
                    console.log(
                        'cordova-plugin-advanced-http is installed properly',
                        data,
                    );
                });
        });
    }
}
```

Run the app on device and watch console output. Absence of the message `cordova-plugin-advanced-http is installed properly` in console output says `cordova-plugin-advanced-http` has not been installed or recognized. Try to reinstall it and give it another chance.
