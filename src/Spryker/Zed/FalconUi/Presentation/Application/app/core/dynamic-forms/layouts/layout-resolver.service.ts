import { inject, Injectable, Type } from '@angular/core';
import { CONTROL_LAYOUT_COMPONENTS, ControlLayoutComponent, ControlLayoutRegistry } from './layout.model';

@Injectable({ providedIn: 'root' })
export class LayoutResolverService {
    private readonly layouts =
        inject(CONTROL_LAYOUT_COMPONENTS, { optional: true })?.reduce<ControlLayoutRegistry>(
            (acc, curr) => ({ ...acc, ...curr }),
            {},
        ) || {};

    private readonly cache = new Map<string, Type<ControlLayoutComponent>>();

    async resolve(layoutName?: string): Promise<Type<ControlLayoutComponent> | null> {
        if (!layoutName) {
            return null;
        }

        if (this.cache.has(layoutName)) {
            return this.cache.get(layoutName)!;
        }

        const layoutLoader = this.layouts[layoutName];

        if (!layoutLoader) {
            // eslint-disable-next-line no-console
            console.warn(
                `[LayoutResolver] Layout "${layoutName}" not found. Available layouts:`,
                Object.keys(this.layouts),
            );
            return null;
        }

        const component = await layoutLoader();

        this.cache.set(layoutName, component);

        return component;
    }
}
