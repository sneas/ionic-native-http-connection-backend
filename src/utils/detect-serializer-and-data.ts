import { HttpParams, HttpRequest } from '@angular/common/http';
import { RequestOptions } from './types';
import { bodyToObject } from './http-params';
import { httpParamsToFormData } from './http-params-to-form-data';
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
        req.headers.get('Content-Type') || req.detectContentTypeHeader() || '';

    if (contentType.indexOf('text/') === 0) {
        return {
            serializer: 'utf8',
            data: req.body,
        };
    }

    if (contentType.indexOf('application/json') === 0) {
        return {
            serializer: 'utf8',
            data: bodyToUtf8(req.body),
        };
    }

    if (
        contentType.indexOf('application/x-www-form-urlencoded') === 0 &&
        req.body instanceof HttpParams
    ) {
        return {
            serializer: 'multipart',
            data: httpParamsToFormData(req.body),
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
