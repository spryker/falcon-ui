/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '../accessor';
import { CheckboxModule } from '@spryker/checkbox';

@Component({
    selector: 'fl-checkbox',
    standalone: true,
    imports: [CheckboxModule],
    templateUrl: './checkbox.component.html',
    providers: [provideValueAccessor(forwardRef(() => CheckboxComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input({ required: true }) id!: string;
    @Input({ required: true }) title!: string;
    @Input() name!: string;

    protected value = false;
    protected disabled = false;

    private onChange: (value: boolean) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: boolean): void {
        this.value = value;
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    protected valueChange(value: boolean): void {
        this.value = value;
        this.onChange(value);
    }

    protected blur(): void {
        this.onTouched();
    }
}
