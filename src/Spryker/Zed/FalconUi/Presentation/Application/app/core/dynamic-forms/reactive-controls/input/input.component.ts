/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { InputModule } from '@spryker/input';
import { InputPasswordModule } from '@spryker/input.password';
import { provideValueAccessor } from '../accessor';

@Component({
    selector: 'fl-input',
    templateUrl: './input.component.html',
    standalone: true,
    imports: [InputModule, InputPasswordModule],
    providers: [provideValueAccessor(forwardRef(() => InputComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements ControlValueAccessor {
    @Input({ required: true }) id!: string;
    @Input() name!: string;
    @Input() placeholder!: string;
    @Input({ required: true }) type!: string;

    protected value?: string;
    protected disabled = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange = (value: string) => {};
    private onTouched = () => {};

    writeValue(obj: string): void {
        this.value = obj;
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    protected valueChange(value: string): void {
        this.onChange(value);
    }

    protected blur(): void {
        this.onTouched();
    }
}
