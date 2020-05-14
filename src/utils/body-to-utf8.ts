import { HttpParams } from '@angular/common/http';

export const bodyToUtf8 = (body: any): string => {
    if (body instanceof HttpParams) {
        return body.toString();
    }

    return JSON.stringify(body);
};
