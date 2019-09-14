import { HttpRequest } from '@angular/common/http';

export type DataSerializer = 'json' | 'urlencoded' | 'utf8';

export const getSerializerByContentType = (
    contentType: string = '',
): DataSerializer => {
    contentType = contentType.toLowerCase();

    if (contentType.indexOf('text/') === 0) {
        return 'utf8';
    }

    if (contentType.indexOf('application/json') === 0) {
        return 'json';
    }

    if (contentType.indexOf('application/x-www-form-urlencoded') === 0) {
        return 'urlencoded';
    }

    return null;
};

export const guessSerializer = (req: HttpRequest<any>): DataSerializer => {
    const method = req.method.toLowerCase();

    if (method === 'post' || method === 'put' || method === 'patch') {
        // 1 stands for ContentType.JSON. Angular doesn't export ContentType
        if (typeof req.body !== 'string') {
            return 'json';
        }
    }

    return 'urlencoded';
};

export const detectSerializer = (req: HttpRequest<any>): DataSerializer => {
    return (
        getSerializerByContentType(req.headers.get('content-type') || '') ||
        guessSerializer(req)
    );
};
