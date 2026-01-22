import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { DatePickerComponent } from '../reactive-controls/date-picker/date-picker.component';

@Component({
    selector: 'fl-dynamic-date-picker',
    standalone: true,
    imports: [...sharedDynamicControlDeps, DatePickerComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-date-picker [id]="control.controlKey" [formControlName]="control.controlKey" control></fl-date-picker>
        </spy-form-item>
    `,
})
export class DynamicDatePickerComponent extends BaseDynamicControl {}
