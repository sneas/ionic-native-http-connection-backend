import { HttpParams } from '@angular/common/http';
import { collectionToObject } from './collection-to-object';

describe('collectionToObject', () => {
    it('should convert collection into object', () => {
        const httpParams = new HttpParams({
            fromObject: {
                a: 'b',
                b: ['c', 'd'],
            },
        });

        expect(collectionToObject(httpParams)).toEqual({
            a: 'b',
            b: ['c', 'd'],
        });
    });
});
