import { HttpRequest } from '@angular/common/http';
import { RequestOptions } from './types';
import { bodyToObject } from './http-params';
import { bodyToUtf8 } from './body-to-utf8';

const DATA_REQUEST_METHODS = ['post', 'put', 'patch'];

export const detectSerializerAndData = (
    req: HttpRequest<any>,
): Partial<RequestOptions> => {
    if (!DATA_REQUEST_METHODS.includes(req.method.toLowerCase())) {
        return {
            serializer: 'urlencoded',
        };
    }

    const contentType =
        req.headers.get('Content-Type') ?? req.detectContentTypeHeader() ?? '';

    if (contentType.indexOf('text/') === 0) {
        return {
            serializer: 'utf8',
            data: req.body,
        };
    }

    if (/^application\/(.*)?json(;.*)?$/gi.test(contentType)) {
        return {
            serializer: 'utf8',
            data: bodyToUtf8(req.body),
        };
    }

    if (req.body instanceof FormData) {
        return {
            serializer: 'multipart',
            data: req.body,
        };
    }

    if (req.body === null || req.body === undefined) {
        return {
            serializer: 'urlencoded',
            data: {},
        };
    }

    return {
        serializer: 'urlencoded',
        data: bodyToObject(req.body),
    };
};
