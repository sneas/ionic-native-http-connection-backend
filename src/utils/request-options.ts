import { HttpRequest } from '@angular/common/http';
import { detectResponseType } from './response-type';
import { RequestOptions } from './types';
import { detectSerializerAndData } from './detect-serializer-and-data';
import { createHeaders } from './create-headers';

type HTTPRequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';

export const getRequestOptions = (req: HttpRequest<any>): RequestOptions => ({
    method: req.method.toLowerCase() as HTTPRequestMethod,
    headers: createHeaders(req),
    responseType: detectResponseType(req.responseType),
    ...detectSerializerAndData(req),
});
