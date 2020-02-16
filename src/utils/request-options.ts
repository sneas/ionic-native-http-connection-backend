import { HttpRequest } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { bodyToObject } from './http-params';
import { collectionToObject } from './collection-to-object';
import { detectSerializer } from './data-serializer';
import { detectResponseType } from './response-type';

type RequestOptions = Parameters<typeof HTTP.prototype.sendRequest>[1];

type HTTPRequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';

const DATA_REQUEST_METHODS = ['post', 'put', 'patch'];

export const getRequestOptions = (req: HttpRequest<any>): RequestOptions => ({
    method: req.method.toLowerCase() as HTTPRequestMethod,
    headers: collectionToObject(req.headers),
    serializer: detectSerializer(req),
    responseType: detectResponseType(req.responseType),
    ...(!DATA_REQUEST_METHODS.includes(req.method.toLowerCase())
        ? null
        : getRequestData(req)),
});

export const getRequestData = (
    req: HttpRequest<any>,
): Pick<RequestOptions, 'data'> | null => {
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
