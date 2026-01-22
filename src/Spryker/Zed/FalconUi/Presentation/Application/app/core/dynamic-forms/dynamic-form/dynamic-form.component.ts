import { ChangeDetectionStrategy, Component, DestroyRef, Injector, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, ButtonVariant } from '@spryker/button';
import { DynamicControl } from '../dynamic-forms.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicControlResolver } from '../dynamic-control-resolver.service';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { ActivateControlIfDirective } from '../dynamic-controls/activate-control-if.directive';
import { SortControlsPipe } from '../sort-controls.pipe';
import { ControlLayoutWrapperComponent } from '../control-layout-wrapper.component';
import { HttpClient } from '@angular/common/http';
import { ActionConfig, ActionsService } from '@spryker/actions';
import {
    catchError,
    defaultIfEmpty,
    ignoreElements,
    merge,
    Observable,
    of,
    shareReplay,
    Subject,
    switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'fl-dynamic-form',
    standalone: true,
    imports: [
        ActivateControlIfDirective,
        CommonModule,
        ReactiveFormsModule,
        ControlInjectorPipe,
        ButtonModule,
        SortControlsPipe,
        ControlLayoutWrapperComponent,
    ],
    templateUrl: './dynamic-form.component.html',
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
    protected readonly controlResolver = inject(DynamicControlResolver);
    protected readonly http = inject(HttpClient);
    protected readonly actions = inject(ActionsService);
    protected readonly injector = inject(Injector);
    protected readonly destroyRef = inject(DestroyRef);

    @Input({ required: true }) config!: {
        controls: DynamicControl[];
        submit: {
            url: string;
            method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
            actions: ActionConfig[];
            errorActions?: ActionConfig[];
            label: string;
            active?: boolean;
            variant?: ButtonVariant;
        };
    };

    protected form = new FormGroup({});

    protected submit$ = new Subject<void>();
    protected request$ = this.submit$.pipe(
        switchMap(() => this.onSubmit()),
        shareReplay({ bufferSize: 1, refCount: true }),
    );
    protected isSubmitting$ = merge(
        this.submit$.pipe(switchMap(() => of(true))),
        this.request$.pipe(switchMap(() => of(false))),
    );

    ngOnInit(): void {
        this.request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    triggerSubmit(event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        this.submit$.next();
    }

    protected onSubmit(): Observable<void> {
        if (!this.form.valid) {
            return of(void 0);
        }

        const method = this.config.submit.method ?? 'PATCH';
        const headers =
            method === 'PATCH'
                ? { 'Content-Type': 'application/merge-patch+json' }
                : { 'Content-Type': 'application/json' };

        return this.http
            .request(method, this.config.submit.url, {
                body: this.form.value,
                headers,
            })
            .pipe(
                switchMap((response) => this.triggerActions(this.config.submit.actions, response)),
                catchError((error) => this.triggerActions(this.config.submit.errorActions, error?.error ?? error)),
            );
    }

    private triggerActions(actions: ActionConfig[] | undefined, data: unknown): Observable<void> {
        if (!actions?.length) {
            return of(void 0);
        }

        const actions$ = actions.map((action) =>
            this.actions.trigger(this.injector, action, data as never).pipe(
                catchError((e) => {
                    console.error('[DynamicForm] Action error:', action.type, e);
                    return of(void 0);
                }),
            ),
        );

        return merge(...actions$).pipe(ignoreElements(), defaultIfEmpty(void 0));
    }

    setErrors(errors: Record<string, string | string[]>): void {
        Object.entries(errors).forEach(([fieldName, errorMessage]) => {
            let control = this.form.get(fieldName);

            if (!control) {
                const foundPath = this.findControlPath(fieldName);

                if (foundPath) {
                    control = this.form.get(foundPath);
                }
            }

            if (control) {
                control.setErrors({ serverError: errorMessage });
                control.markAsTouched();
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    `[DynamicForm] Control not found: "${fieldName}". Available controls:`,
                    this.getControlPaths(),
                );
            }
        });
    }

    private findControlPath(targetName: string, group: FormGroup = this.form, prefix = ''): string | null {
        for (const key of Object.keys(group.controls)) {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            const control = group.get(key);

            if (key === targetName) {
                return fullPath;
            }

            if (control instanceof FormGroup) {
                const found = this.findControlPath(targetName, control, fullPath);

                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    private getControlPaths(group: FormGroup = this.form, prefix = ''): string[] {
        const paths: string[] = [];
        Object.keys(group.controls).forEach((key) => {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            const control = group.get(key);

            if (control instanceof FormGroup) {
                paths.push(...this.getControlPaths(control, fullPath));
            } else {
                paths.push(fullPath);
            }
        });
        return paths;
    }
}
