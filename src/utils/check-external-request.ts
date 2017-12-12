import { HttpRequest } from '@angular/common/http';

export function checkExternalRequest(req: HttpRequest<any>) {
    return /^(http|https):\/\//.test(req.url);
}
