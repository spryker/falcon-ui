import {
    registerDynamicFormControls,
    registerValidationErrorMessages,
} from '../core/dynamic-forms/dynamic-forms.model';
import { registerDynamicComponents } from '../core/component-builder/component-builder';
import { registerControlLayoutComponents } from '../core/dynamic-forms/layouts/layout.model';

export const appComponentsProviders = [
    registerDynamicComponents({
        LayoutComponent: () => import('../components/layout/layout.component').then((c) => c.LayoutComponent),
        ComponentBuilderComponent: () =>
            import('../core/component-builder/component-builder.component').then((c) => c.ComponentBuilderComponent),
        DynamicFormComponent: () =>
            import('../core/dynamic-forms/dynamic-form/dynamic-form.component').then((c) => c.DynamicFormComponent),
        DynamicTabsComponent: () =>
            import('../components/dynamic-tabs/dynamic-tabs.component').then((c) => c.DynamicTabsComponent),
    }),
    registerDynamicFormControls({
        input: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-input.component').then(
                (c) => c.DynamicInputComponent,
            ),
        select: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-select.component').then(
                (c) => c.DynamicSelectComponent,
            ),
        checkbox: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-checkbox.component').then(
                (c) => c.DynamicCheckboxComponent,
            ),
        datepicker: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-date-picker.component').then(
                (c) => c.DynamicDatePickerComponent,
            ),
        toggle: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-toggle.component').then(
                (c) => c.DynamicToggleComponent,
            ),
        radio: () =>
            import('../core/dynamic-forms/dynamic-controls/dynamic-radio.component').then(
                (c) => c.DynamicRadioComponent,
            ),
    }),
    registerControlLayoutComponents({
        card: () =>
            import('../core/dynamic-forms/layouts/card-control-layout.component').then(
                (c) => c.CardControlLayoutComponent,
            ),
    }),
    registerValidationErrorMessages({
        required: () => `This field is required`,
        requiredTrue: () => `This field is required`,
        email: () => `It should be a valid email`,
        minlength: ({ requiredLength }) => `The length should be at least ${requiredLength} characters.`,
        maxlength: ({ requiredLength }) => `The length should be at most ${requiredLength} characters.`,
    }),
];
