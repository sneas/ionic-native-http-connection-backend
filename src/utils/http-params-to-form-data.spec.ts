import { httpParamsToFormData } from './http-params-to-form-data';
import { HttpParams } from '@angular/common/http';

describe('httpParamsToFormData', () => {
    it('should respect a single param', () => {
        const httpParams = new HttpParams().append('a', '1');
        const formData = httpParamsToFormData(httpParams);

        expect(formData.getAll('a')).toEqual(['1']);
    });

    it('should respect multiple params', () => {
        const httpParams = new HttpParams().append('a', '1').append('a', '2');
        const formData = httpParamsToFormData(httpParams);

        expect(formData.getAll('a')).toEqual(['1', '2']);
    });
});
