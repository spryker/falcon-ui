import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { ToggleComponent } from '../reactive-controls/toggle/toggle.component';

@Component({
    selector: 'fl-dynamic-toggle',
    standalone: true,
    imports: [...sharedDynamicControlDeps, ToggleComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-toggle
                [name]="control.controlKey"
                [id]="control.controlKey"
                [formControlName]="control.controlKey"
                control
            >
            </fl-toggle>
        </spy-form-item>
    `,
})
export class DynamicToggleComponent extends BaseDynamicControl {}
