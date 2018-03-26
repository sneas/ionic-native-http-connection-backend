import { HttpRequest } from '@angular/common/http';

import { checkExternalRequest } from './check-external-request';

describe('checkExternalRequest', () => {
    it('should detect http request as external', () => {
        expect(
            checkExternalRequest(new HttpRequest('GET', 'http://test.com')),
        ).toBeTruthy();
    });

    it('should detect https request as external', () => {
        expect(
            checkExternalRequest(new HttpRequest('GET', 'https://test.com')),
        ).toBeTruthy();
    });

    it('should detect relative path request as internal', () => {
        expect(
            checkExternalRequest(new HttpRequest('GET', '/test-endpoint')),
        ).toBeFalsy();
    });
});
