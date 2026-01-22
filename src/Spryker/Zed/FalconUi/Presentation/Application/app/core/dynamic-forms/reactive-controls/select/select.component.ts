/* eslint-disable @typescript-eslint/no-empty-function */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { SelectOption, SelectValueSelected, SelectModule } from '@spryker/select';
import { provideValueAccessor } from '../accessor';
import { DatasourceConfig } from '@spryker/datasource';

@Component({
    selector: 'fl-select',
    standalone: true,
    imports: [SelectModule],
    templateUrl: './select.component.html',
    providers: [provideValueAccessor(forwardRef(() => SelectComponent))],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SelectComponent implements ControlValueAccessor, OnChanges {
    @Input() id?: string;
    @Input() name?: string;
    @Input() options?: SelectOption[];
    @Input() multiple?: boolean;
    @Input() placeholder: string = '';
    @Input() datasource?: DatasourceConfig;

    _datasource?: DatasourceConfig;

    protected value?: SelectValueSelected;
    protected disabled = false;

    // Store pending value for datasource race condition workaround
    // spy-select resets value to '' when datasource options load
    private pendingValue?: SelectValueSelected;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange = (value: SelectValueSelected) => {};
    private onTouched = () => {};

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasource) {
            this._datasource = this.datasource
                ? {
                      ...this.datasource,
                      transform: {
                          type: 'select',
                          valueField: this.datasource.valueField,
                          titleField: this.datasource.titleField,
                      },
                  }
                : undefined;
        }
    }

    writeValue(obj: SelectValueSelected): void {
        this.value = obj;
        // Store pending value for datasource - spy-select resets value when options load
        if (this.datasource && obj) {
            this.pendingValue = obj;
        }
        this.cdr.markForCheck();
    }

    registerOnChange(fn: (value: SelectValueSelected) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    protected valueChange(value: SelectValueSelected): void {
        // Workaround: spy-select resets value to '' when datasource options load
        // Restore pending value if it was reset
        if (value === '' && this.pendingValue) {
            this.value = this.pendingValue;
            this.pendingValue = undefined;
            this.cdr.markForCheck();
            return;
        }
        this.pendingValue = undefined;
        this.onChange(value);
    }

    protected blur(): void {
        this.onTouched();
    }
}
