import { CommonModule } from '@angular/common';
import { Directive, HostBinding, inject, OnDestroy, OnInit, StaticProvider } from '@angular/core';
import {
    AbstractControl,
    ControlContainer,
    FormArray,
    FormControl,
    FormGroup,
    FormGroupDirective,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CONTROL_DATA } from '../control-data.token';
import { DynamicControl, VALIDATION_ERROR_MESSAGES, ValidationErrorMessages } from '../dynamic-forms.model';
import { FormItemModule } from '@spryker/form-item';
import { ErrorStateMatcher } from '../error-state-matcher.service';

export const sharedDynamicControlDeps = [FormItemModule, CommonModule, ReactiveFormsModule];

export const dynamicControlProvider: StaticProvider = {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true }),
};

@Directive()
export class BaseDynamicControl implements OnInit, OnDestroy {
    @HostBinding('class') hostClass = 'form-field';

    protected readonly control = inject(CONTROL_DATA);

    protected formControl: AbstractControl =
        this.control.config.controlInstance ||
        new FormControl(this.control.config.value, this.resolveValidators(this.control.config));

    private readonly parentGroupDir = inject(ControlContainer);
    private readonly errorStateMatcher = inject(ErrorStateMatcher);
    private readonly errorMessages = inject(VALIDATION_ERROR_MESSAGES).reduce<ValidationErrorMessages>(
        (acc, curr) => ({ ...acc, ...curr }),
        Object.create(null),
    );
    private valueChangesSubscription?: Subscription;

    private get formDirective() {
        return this.parentGroupDir.formDirective as FormGroupDirective;
    }

    protected get shouldShowError(): boolean {
        return this.errorStateMatcher.isErrorVisible(this.formControl, this.formDirective);
    }

    protected get errorText(): string | null {
        if (this.formControl.hasError('serverError')) {
            const serverError = this.formControl.getError('serverError');
            return Array.isArray(serverError) ? serverError.join(', ') : serverError;
        }

        if (!this.shouldShowError || !this.formControl.errors) {
            return null;
        }

        const [firstErrorKey, firstErrorValue] = Object.entries(this.formControl.errors)[0];

        if (!this.errorMessages[firstErrorKey]) {
            // eslint-disable-next-line no-console
            console.warn(`Missing message for ${firstErrorKey} validator...`);
            return null;
        }

        return this.errorMessages[firstErrorKey](firstErrorValue);
    }

    ngOnInit(): void {
        this.control.config.controlInstance = this.formControl;
        if (this.parentGroupDir.control instanceof FormGroup) {
            this.parentGroupDir.control.addControl(this.control.controlKey, this.formControl);
        }
        if (this.parentGroupDir.control instanceof FormArray) {
            this.parentGroupDir.control.push(this.formControl);
        }

        this.valueChangesSubscription = this.formControl.valueChanges.subscribe(() => {
            this.clearServerError();
        });
    }

    ngOnDestroy(): void {
        this.valueChangesSubscription?.unsubscribe();

        if (this.formDirective.submitted) {
            this.control.config.value = this.formControl.value;
            this.control.config.controlInstance = undefined;
        }
        if (this.parentGroupDir.control instanceof FormGroup) {
            (this.parentGroupDir.control as FormGroup).removeControl(this.control.controlKey);
        }
        if (this.parentGroupDir.control instanceof FormArray) {
            const index = this.parentGroupDir.control.controls.indexOf(this.formControl);
            this.parentGroupDir.control.removeAt(index);
        }
    }

    private clearServerError(): void {
        if (this.formControl.hasError('serverError')) {
            const errors = { ...this.formControl.errors };
            delete errors['serverError'];
            this.formControl.setErrors(Object.keys(errors).length > 0 ? errors : null, { emitEvent: false });
        }
    }

    private resolveValidators({ validators = {} }: DynamicControl) {
        return Object.keys(validators).map((validatorKey) => {
            const validatorValue = validators[validatorKey];
            if (validatorKey === 'required') {
                return Validators.required;
            }
            if (validatorKey === 'email') {
                return Validators.email;
            }
            if (validatorKey === 'requiredTrue') {
                return Validators.requiredTrue;
            }
            if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
                return Validators.minLength(validatorValue);
            }
            if (validatorKey === 'maxLength' && typeof validatorValue === 'number') {
                return Validators.maxLength(validatorValue);
            }
            return Validators.nullValidator;
        });
    }
}
