/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DatePickerModule } from '@spryker/date-picker';
import { provideValueAccessor } from '../accessor';

@Component({
    selector: 'fl-date-picker',
    templateUrl: './date-picker.component.html',
    standalone: true,
    imports: [DatePickerModule],
    providers: [provideValueAccessor(forwardRef(() => DatePickerComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input({ required: true }) id!: string;
    @Input() name!: string;
    @Input() placeholder!: string;

    protected value?: string;
    protected disabled = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange = (value: string) => {};
    private onTouched = () => {};

    writeValue(obj: string): void {
        this.value = obj?.trim();
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

    protected dateChange(date: Date): void {
        this.onChange(date.toISOString());
    }

    protected blur(): void {
        this.onTouched();
    }
}
