import { Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export function provideValueAccessor(component: unknown): Provider {
    return {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: component,
    };
}
