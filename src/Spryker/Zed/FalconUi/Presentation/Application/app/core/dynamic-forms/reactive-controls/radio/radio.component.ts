/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { RadioModule } from '@spryker/radio';
import { provideValueAccessor } from '../accessor';

@Component({
    selector: 'fl-radio',
    templateUrl: './radio.component.html',
    standalone: true,
    imports: [RadioModule],
    providers: [provideValueAccessor(forwardRef(() => RadioComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class RadioComponent implements ControlValueAccessor {
    @Input({ required: true }) id!: string;
    @Input() name!: string;
    @Input() options: string[] = [];

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
