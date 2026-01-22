import { inject, Injectable, Type } from '@angular/core';
import { from, of, tap } from 'rxjs';
import { DYNAMIC_FORM_CONTROLS, DynamicControlType } from './dynamic-forms.model';
import { BaseDynamicControl } from './dynamic-controls/base-dynamic-control';

@Injectable({
    providedIn: 'root',
})
export class DynamicControlResolver {
    private readonly lazyControlComponents = inject(DYNAMIC_FORM_CONTROLS).reduce<DynamicControlType>(
        (acc, curr) => ({ ...acc, ...curr }),
        Object.create(null),
    );
    private readonly loadedControlComponents = new Map<string, Type<BaseDynamicControl>>();

    resolve(controlType: keyof DynamicControlType) {
        const loadedComponent = this.loadedControlComponents.get(controlType);
        if (loadedComponent) {
            return of(loadedComponent);
        }
        return from(this.lazyControlComponents[controlType]()).pipe(
            tap((comp) => this.loadedControlComponents.set(controlType, comp)),
        );
    }
}
