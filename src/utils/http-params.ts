import { HttpParams } from '@angular/common/http';

export type HttpParamsObject = { [x: string]: string };

export const httpParamsToObject = (params: HttpParams): HttpParamsObject => {
    const result = {};
    for (let key of params.keys()) {
        result[key] = params.get(key);
    }
    return result;
};

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
        return queryToObject(body);
    } else if (body instanceof HttpParams) {
        return httpParamsToObject(body);
    } else {
        return body;
    }
};
