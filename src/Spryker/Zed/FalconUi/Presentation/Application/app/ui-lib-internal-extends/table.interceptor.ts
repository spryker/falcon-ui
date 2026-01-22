import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

interface TableBody {
    totalItems: number;
    member: Record<string, unknown>[];
    pageSize?: number;
}

// Do not use, should be fixed in ui-library
export const tableInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('glue-backend')) {
        return next(req.clone()).pipe(
            map((event: HttpEvent<unknown>) => {
                const body = 'body' in event ? (event.body as TableBody) : null;
                const isTable =
                    event instanceof HttpResponse &&
                    body !== null &&
                    body.totalItems !== undefined &&
                    body.member !== undefined;

                if (!isTable || !Array.isArray(body.member)) {
                    return event;
                }

                // Parse URL from the actual request (use urlWithParams to get query params)
                const fullUrl = req.urlWithParams;
                const url = new URL(fullUrl, window.location.origin);
                const pageParam = url.searchParams.get('page');
                const pageSizeParam = url.searchParams.get('pageSize');
                const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
                const currentPageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

                const totalPages = Math.ceil(body.totalItems / currentPageSize);
                const transformedBody = {
                    ...body,
                    data: body.member,
                    page: currentPage,
                    pageSize: currentPageSize,
                    total: body.totalItems,
                    pages: totalPages,
                };

                return event.clone({ body: transformedBody });
            }),
        );
    }

    return next(req);
};
