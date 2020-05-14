import { HTTP } from '@ionic-native/http/ngx';

export type RequestOptions =
    | Parameters<typeof HTTP.prototype.sendRequest>[1]
    | {
          data?: Object | FormData | string;
      };
