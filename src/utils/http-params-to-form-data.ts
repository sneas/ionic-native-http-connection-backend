import { HttpParams } from '@angular/common/http';

export const httpParamsToFormData = (params: HttpParams): FormData => {
    const formData = new FormData();

    params.keys().forEach((key) => {
        params.getAll(key).forEach((value) => {
            formData.append(key, value);
        });
    });

    return formData;
};
