import { HttpParams } from '@angular/common/http';
import { collectionToObject } from './collection-to-object';

export type HttpParamsObject = { [x: string]: string };

export const queryToObject = (query: string): HttpParamsObject => {
    if (!query) {
        return {};
    }

    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params: { [name: string]: string }, param) => {
            let [key, value] = param.split('=');
            params[key] = value
                ? decodeURIComponent(value.replace(/\+/g, ' '))
                : '';
            return params;
        }, {});
};

export const bodyToObject = (
    body: HttpParamsObject | string | HttpParams,
): HttpParamsObject => {
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch (e) {
            return queryToObject(body);
        }
    } else if (body instanceof HttpParams) {
        return collectionToObject(body);
    } else {
        return body;
    }
};
