import { InjectionToken, Provider, Type } from '@angular/core';

export type DynamicComponentRegistryItem = Record<string, Type<unknown> | (() => Promise<Type<unknown>>)>;

export const DYNAMIC_COMPONENTS = new InjectionToken<DynamicComponentRegistryItem[]>('DYNAMIC_COMPONENTS');

export function registerDynamicComponents(components: DynamicComponentRegistryItem): Provider {
    return {
        provide: DYNAMIC_COMPONENTS,
        useValue: components,
        multi: true,
    };
}

export const SLOT_ORDER = new InjectionToken<string[]>('SLOT_ORDER');

export function WithSlots(order: string[]): ClassDecorator {
    return (target: any) => {
        const existingProviders = target.ɵcmp?.providers || target.providers || [];
        const slotProvider = { provide: SLOT_ORDER, useValue: order };
        target.providers = [...existingProviders, slotProvider];
    };
}

export interface DynamicComponentConfig {
    component?: string;
    content?: string;
    inputs?: Record<string, unknown>;
    slots?: (DynamicComponentConfig & { slot: string })[];
    className?: string | string[];
    style?: Record<string, string>;
    attrs?: Record<string, string>;
    id?: string;
    qa?: string;
}

export function getSlotOrderFromComponent<T>(
    componentType: Type<T>,
    slots?: Record<string, DynamicComponentConfig[]>,
): string[] {
    const fallback = Object.keys(slots ?? {});
    const providers = (componentType as any).ɵcmp?.providers ?? (componentType as any).providers;
    if (!providers) return fallback;

    const slotProvider = providers.find((p: any) => p.provide === SLOT_ORDER);
    return slotProvider.useValue ?? fallback;
}
