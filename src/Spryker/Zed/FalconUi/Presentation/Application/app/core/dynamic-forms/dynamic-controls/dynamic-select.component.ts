import { Component, OnInit } from '@angular/core';
import { SelectOption } from '@spryker/select';
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
                [options]="selectOptions"
                [datasource]="control.config.datasource"
                control
            >
            </fl-select>
        </spy-form-item>
    `,
})
export class DynamicSelectComponent extends BaseDynamicControl implements OnInit {
    protected get selectOptions(): SelectOption[] | undefined {
        return this.control.config.options?.map((option) =>
            typeof option === 'string' ? option : { title: option.label, value: option.value },
        );
    }
}
