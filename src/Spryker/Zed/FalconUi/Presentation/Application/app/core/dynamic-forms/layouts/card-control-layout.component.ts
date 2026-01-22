import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '@spryker/card';
import { ControlLayoutComponent } from './layout.model';

@Component({
    selector: 'fl-card-control-layout',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <spy-card [spyTitle]="options?.['title']">
            <ng-container *ngTemplateOutlet="content"></ng-container>
        </spy-card>
    `,
    styles: [
        `
            :host {
                display: block;
                margin-bottom: 24px;
            }
        `,
    ],
})
export class CardControlLayoutComponent implements ControlLayoutComponent {
    @Input({ required: true }) content!: TemplateRef<unknown>;
    @Input() options?: Record<string, unknown>;
}
