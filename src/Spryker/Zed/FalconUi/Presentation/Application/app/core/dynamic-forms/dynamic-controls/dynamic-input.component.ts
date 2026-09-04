import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { InputComponent } from '../reactive-controls/input/input.component';

@Component({
    selector: 'fl-dynamic-input',
    standalone: true,
    imports: [...sharedDynamicControlDeps, InputComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [class.hidden]="control.config.type === 'hidden'" [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-input
                [id]="control.controlKey"
                [type]="control.config.type ?? 'text'"
                [formControlName]="control.controlKey"
                control
            ></fl-input>
        </spy-form-item>
    `,
    styles: [
        `
            .hidden {
                display: none;
            }
        `,
    ],
})
export class DynamicInputComponent extends BaseDynamicControl {}
