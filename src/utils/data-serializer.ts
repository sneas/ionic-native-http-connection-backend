import { HttpRequest } from '@angular/common/http';

export type DataSerializerType = 'json' | 'urlencoded' | 'utf8';

export const getSerializerTypeByContentType = (
    contentType: string = '',
): DataSerializerType => {
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

export const detectDataSerializerType = (
    req: HttpRequest<any>,
): DataSerializerType => {
    const serializerByContentType = getSerializerTypeByContentType(
        req.headers.get('content-type') || '',
    );

    if (serializerByContentType !== null) {
        return serializerByContentType;
    }

    // No Content-Type present try to guess it by method & body
    if (
        req.method.toLowerCase() === 'post' ||
        req.method.toLowerCase() === 'put' ||
        req.method.toLowerCase() === 'patch'
    ) {
        // 1 stands for ContentType.JSON. Angular doesn't export ContentType
        if (typeof req.body !== 'string') {
            return 'json';
        }
    }

    return 'urlencoded';
};
