import { Component, computed, inject, input, TemplateRef } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { LayoutResolverService } from './layouts/layout-resolver.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { from, switchMap } from 'rxjs';

@Component({
    selector: 'fl-control-layout-wrapper',
    standalone: true,
    imports: [CommonModule, NgComponentOutlet],
    template: `
        @if ($layoutComponent(); as layoutComponent) {
            <ng-container
                [ngComponentOutlet]="layoutComponent"
                [ngComponentOutletInputs]="{ content: $content(), options: $layout() }"
            />
        } @else {
            <ng-container *ngTemplateOutlet="$content()" />
        }
    `,
})
export class ControlLayoutWrapperComponent {
    private readonly layoutResolver = inject(LayoutResolverService);

    $layout = input<
        | {
              template: string;
              [key: string]: unknown;
          }
        | null
        | undefined
    >(null, { alias: 'layout' });
    $content = input<TemplateRef<unknown> | null>(null, { alias: 'content' });

    private $layoutName = computed(() => this.$layout()?.template);

    $layoutComponent = toSignal(
        toObservable(this.$layoutName).pipe(switchMap((name) => from(this.layoutResolver.resolve(name)))),
        { initialValue: null },
    );
}
