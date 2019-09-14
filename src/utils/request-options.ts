import { HttpRequest } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { bodyToObject } from './http-params';
import { collectionToObject } from './collection-to-object';

type RequestOptions = Parameters<typeof HTTP.prototype.sendRequest>[1];

const DATA_REQUEST_METHODS = ['post', 'put', 'patch'];

export const paramsOrData = (
    req: HttpRequest<any>,
): Pick<RequestOptions, 'params' | 'data'> => {
    if (!DATA_REQUEST_METHODS.includes(req.method.toLowerCase())) {
        return {
            params: collectionToObject(req.params),
        };
    }

    if (
        (req.headers.get('content-type') || '')
            .toLowerCase()
            .indexOf('text/') === 0
    ) {
        return {
            data: req.body,
        };
    }

    return {
        data: bodyToObject(req.body),
    };
};
