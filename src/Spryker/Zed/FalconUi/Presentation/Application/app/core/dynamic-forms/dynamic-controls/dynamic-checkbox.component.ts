import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { CheckboxComponent } from '../reactive-controls/checkbox/checkbox.component';

@Component({
    selector: 'fl-dynamic-checkbox',
    standalone: true,
    imports: [...sharedDynamicControlDeps, CheckboxComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            <fl-checkbox
                [title]="control.config.label"
                [id]="control.controlKey"
                [formControlName]="control.controlKey"
                control
            >
            </fl-checkbox>
        </spy-form-item>
    `,
    styles: [
        `
            :host > div {
                display: flex;
                align-items: center;
                margin-top: 10px;
            }
        `,
    ],
})
export class DynamicCheckboxComponent extends BaseDynamicControl {}
