import { Component, OnInit } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { SelectComponent } from '../reactive-controls/select/select.component';

@Component({
    selector: 'fl-dynamic-select',
    standalone: true,
    imports: [...sharedDynamicControlDeps, SelectComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-select
                [formControlName]="control.controlKey"
                [id]="control.controlKey"
                [options]="control.config.options"
                [datasource]="control.config.datasource"
                control
            >
            </fl-select>
        </spy-form-item>
    `,
})
export class DynamicSelectComponent extends BaseDynamicControl implements OnInit {}
