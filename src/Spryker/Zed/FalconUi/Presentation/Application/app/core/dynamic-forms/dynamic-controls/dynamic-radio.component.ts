import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { RadioComponent } from '../reactive-controls/radio/radio.component';

@Component({
    selector: 'fl-dynamic-radio',
    standalone: true,
    imports: [...sharedDynamicControlDeps, RadioComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-radio
                [name]="control.controlKey"
                [id]="control.controlKey"
                [options]="radioOptions"
                [formControlName]="control.controlKey"
                control
            >
            </fl-radio>
        </spy-form-item>
    `,
})
export class DynamicRadioComponent extends BaseDynamicControl {
    protected get radioOptions(): string[] {
        return (this.control.config.options ?? []).map((option) =>
            typeof option === 'string' ? option : option.value,
        );
    }
}
