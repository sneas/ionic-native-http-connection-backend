import { HTTP } from '@awesome-cordova-plugins/http/ngx';

export type RequestOptions =
    | Parameters<typeof HTTP.prototype.sendRequest>[1]
    | {
          data?: Object | FormData | string;
      };
