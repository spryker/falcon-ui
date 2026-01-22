import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumnComponent, TableColumnContext } from '@spryker/table';
import { TableColumnDateConfig } from '@spryker/table.column.date';

// Do not use, should be fixed in ui-library
@Component({
    selector: 'spy-table-column-date',
    standalone: true,
    imports: [CommonModule],
    template: `
        <ng-container *ngIf="context?.displayValue">
            {{ context.displayValue | date: config?.format || 'shortDate' }}
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnDateComponent implements TableColumnComponent<TableColumnDateConfig> {
    @Input() config?: TableColumnDateConfig;
    @Input() context?: TableColumnContext;
    @Input() items?: unknown;
}
