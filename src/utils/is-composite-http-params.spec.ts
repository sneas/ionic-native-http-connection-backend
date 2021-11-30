import { HttpParams } from '@angular/common/http';
import { isCompositeHttpParams } from './is-composite-http-params';

describe('isCompositeHttpParams', () => {
    it('return false for non-composite params', () => {
        expect(isCompositeHttpParams(new HttpParams())).toBeFalsy();
        expect(
            isCompositeHttpParams(new HttpParams().set('a', 'b').set('b', 'c')),
        ).toBeFalsy();
    });

    it('should return true for composite params', () => {
        expect(
            isCompositeHttpParams(
                new HttpParams()
                    .set('client_id', 'my-client-id')
                    .set('username', 'my-username')
                    .set('password', 'my-password')
                    .set('a', 'b')
                    .append('a', 'c'),
            ),
        ).toBeTruthy();
    });
});
