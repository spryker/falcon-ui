/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ToggleModule } from '@spryker/toggle';
import { provideValueAccessor } from '../accessor';

@Component({
    selector: 'fl-toggle',
    templateUrl: './toggle.component.html',
    standalone: true,
    imports: [ToggleModule],
    providers: [provideValueAccessor(forwardRef(() => ToggleComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ToggleComponent implements ControlValueAccessor {
    @Input({ required: true }) id!: string;
    @Input() name!: string;

    protected value?: boolean;
    protected disabled = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange = (value: boolean) => {};
    private onTouched = () => {};

    writeValue(obj: boolean): void {
        this.value = obj;
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
        this.onChange(value);
    }

    protected blur(): void {
        this.onTouched();
    }
}
