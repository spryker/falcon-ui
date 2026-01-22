import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ConfigService } from '../services/config/config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigService);

    return from(configService.getAccessToken()).pipe(
        switchMap((token) => {
            if (token) {
                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                return next(authReq);
            }

            return next(req);
        }),
    );
};
