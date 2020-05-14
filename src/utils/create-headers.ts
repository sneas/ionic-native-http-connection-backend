import { HttpHeaders, HttpRequest } from '@angular/common/http';

type Headers = Record<string, string>;

export const buildHeaders = (headers: HttpHeaders): Headers => {
    return headers.keys().reduce((headersObject, key) => {
        return {
            ...headersObject,
            [key]: headers.getAll(key).join(','),
        };
    }, {});
};

export const createHeaders = (req: HttpRequest<any>): Headers => {
    let headers = req.headers;

    if (!req.headers.has('Content-Type')) {
        const detectedContentType = req.detectContentTypeHeader();
        if (detectedContentType) {
            headers = headers.append('Content-Type', detectedContentType);
        }
    }

    return buildHeaders(headers);
};
