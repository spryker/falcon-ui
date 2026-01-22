import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FLRouteData } from '../../core/services/app-init/app-init.model';

@Component({
    selector: 'fl-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.styles.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'fl-layout' },
})
export class LayoutComponent {
    private readonly route = inject(ActivatedRoute);

    protected readonly data = this.route.snapshot.data as FLRouteData;
}
