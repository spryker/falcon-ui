import { SelectModule, SelectOptionItem } from '@spryker/select';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, SimpleChanges } from '@angular/core';
import {
    TableFilterSelect,
    TableFilterSelectComponent as TableFilterSelectComponentCore,
} from '@spryker/table.filter.select';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spryker/locale';
import { DatasourceConfig } from '@spryker/datasource';

declare module '@spryker/table.filter.select' {
    interface TableFilterSelectOptions {
        datasource: DatasourceConfig;
    }
}

// Do not use, should be fixed in ui-library
@Component({
    standalone: true,
    selector: 'spy-table-filter-select',
    template: `
        <spy-select
            [options]="selectOptions"
            [(value)]="value"
            (valueChange)="valueChange.emit($event)"
            [multiple]="config?.typeOptions?.multiselect"
            [datasource]="datasource"
            [placeholder]="('table.filter.select.filter:title' | spyI18n: { title: config?.title ?? '' } | async) ?? ''"
        ></spy-select>
    `,
    imports: [SelectModule, CommonModule, I18nModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TableFilterSelectComponent extends TableFilterSelectComponentCore {
    datasource?: DatasourceConfig;

    ngOnChanges(changes: SimpleChanges): void {
        const config = changes.config as unknown as TableFilterSelect;

        if (config) {
            const values = this.config?.typeOptions?.values;
            this.selectOptions = values?.map(({ value, title }) => ({
                value,
                title,
            })) as SelectOptionItem[];

            const datasource = this.config?.typeOptions?.datasource;

            this.datasource = datasource
                ? {
                      ...datasource,
                      transform: {
                          type: 'select',
                          valueField: datasource.valueField,
                          titleField: datasource.titleField,
                      },
                  }
                : undefined;
        }
    }
}
