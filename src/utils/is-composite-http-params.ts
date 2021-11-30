import { HttpParams } from '@angular/common/http';

export const isCompositeHttpParams = (params: HttpParams): boolean =>
    params.keys().some((key) => params.getAll(key).length > 1);
