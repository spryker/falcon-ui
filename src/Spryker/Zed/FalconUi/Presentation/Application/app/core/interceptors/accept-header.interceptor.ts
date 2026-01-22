import { HttpInterceptorFn } from '@angular/common/http';

export const acceptHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        setHeaders: {
            Accept: 'application/ld+json',
        },
    });

    return next(modifiedReq);
};
