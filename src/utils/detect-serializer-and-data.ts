import { HttpParams, HttpRequest } from '@angular/common/http';
import { RequestOptions } from './types';
import { bodyToObject } from './http-params';
import { httpParamsToFormData } from './http-params-to-form-data';
import { bodyToUtf8 } from './body-to-utf8';

const DATA_REQUEST_METHODS = ['post', 'put', 'patch'];

const HTTP_SERIALIZERS = ['json', 'urlencoded', 'utf8', 'multipart', 'raw'];
const HTTP_TRANSFORMERS =['none', 'bodyToObject', 'httpParamsToFormData', 'bodyToUtf8'];

export const detectSerializerAndData = (
    req: HttpRequest<any>,
): Partial<RequestOptions> => {
    if (!DATA_REQUEST_METHODS.includes(req.method.toLowerCase())) {
        return {
            serializer: 'urlencoded',
        };
    }

    const serializer: string = req.headers.get('X-Http-Serializer');
    const transformer: string = req.headers.get('X-Http-Transformer');

    if (serializer && HTTP_SERIALIZERS.indexOf(serializer) === -1) {
      throw new Error(`Serializer '${serializer}' is not allowed. Allowed serializers are: ${HTTP_SERIALIZERS.join(',')}`)
    }
    if (transformer && HTTP_TRANSFORMERS.indexOf(transformer) === -1) {
        throw new Error(`Transformer '${transformer}' is not allowed. Allowed transformers are ${HTTP_TRANSFORMERS.join(',')}`)
    }
    if (HTTP_SERIALIZERS.indexOf(serializer) !== -1 && HTTP_TRANSFORMERS.indexOf(transformer) !== -1) {
        let data ;
        switch (transformer){
            case 'none':
                data = req.body
                break;
            case 'bodyToObject':
                data = bodyToObject(req.body)
                break;
            case 'httpParamsToFormData':
                data = httpParamsToFormData(req.body)
                break;
            case 'bodyToUtf8':
                data = bodyToUtf8(req.body)
                break;
        }
        return {
            serializer:serializer as any,
            data: data
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
