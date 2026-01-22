import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { DrawerActionConfig, DrawerActionHandlerService } from '@spryker/actions.drawer';
import { AnyContext, ContextService } from '@spryker/utils';
import { DrawerOptions, DrawerOptionsComponent, DrawerRef } from '@spryker/drawer';

// Do not use, should be fixed in ui-library
@Injectable({ providedIn: 'root' })
export class ContextReplacerDrawerActionHandlerService extends DrawerActionHandlerService {
    handleAction<C>(
        injector: Injector,
        config: DrawerActionConfig,
        context: C,
    ): Observable<DrawerRef<C, DrawerOptions<C>>> {
        const inputs = this.interpolateInputsRecursively(
            (config.options as DrawerOptionsComponent).inputs,
            context as AnyContext,
            injector,
        );

        return super.handleAction(
            injector,
            { ...config, options: { ...config.options, inputs } } as DrawerActionConfig,
            context,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private interpolateInputsRecursively(obj: any, context: AnyContext, injector: Injector): any {
        const contextService = injector.get(ContextService);

        if (typeof obj === 'string') {
            return contextService.interpolate(obj, context);
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.interpolateInputsRecursively(item, context, injector));
        }

        if (obj && typeof obj === 'object') {
            return Object.entries(obj).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: this.interpolateInputsRecursively(value, context, injector),
                }),
                {},
            );
        }

        return obj;
    }
}
