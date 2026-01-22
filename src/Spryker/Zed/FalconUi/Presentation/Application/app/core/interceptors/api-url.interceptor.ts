import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config/config.service';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigService);

    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
        return next(req);
    }

    return next(req.clone({ url: `${configService.getConfig().apiPlatformUrl}${req.url}` }));
};
