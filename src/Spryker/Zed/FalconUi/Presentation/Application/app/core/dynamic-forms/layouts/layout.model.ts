import { InjectionToken, Provider, Type } from '@angular/core';
import { TemplateRef } from '@angular/core';

export interface ControlLayoutComponent {
    content: TemplateRef<unknown>;
    options?: Record<string, unknown>;
}

export interface ControlLayoutRegistry {
    [key: string]: () => Promise<Type<ControlLayoutComponent>>;
}

export const CONTROL_LAYOUT_COMPONENTS = new InjectionToken<ControlLayoutRegistry[]>('CONTROL_LAYOUT_COMPONENTS');

export function registerControlLayoutComponents(layouts: ControlLayoutRegistry): Provider {
    return {
        provide: CONTROL_LAYOUT_COMPONENTS,
        useValue: layouts,
        multi: true,
    };
}
