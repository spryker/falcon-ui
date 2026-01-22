import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                window.location.href = '/acl/index/denied';
            }

            if (error.status === 401) {
                window.location.href = '/security-gui/login';
            }

            return throwError(() => error);
        }),
    );
};
