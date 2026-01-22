import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { DynamicControl } from '../dynamic-forms.model';
import { FormGroupDirective } from '@angular/forms';
import { distinctUntilChanged, filter, map, pairwise, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Directive({
    selector: '[activateControlIf]',
    standalone: true,
})
export class ActivateControlIfDirective implements OnInit, OnDestroy {
    @Input('activateControlIf') config?: DynamicControl['activationConfig'];

    private readonly vcr = inject(ViewContainerRef);
    private readonly templateRef = inject(TemplateRef);
    private readonly rootFormGroup = inject(FormGroupDirective).form;

    private readonly isControlRegistered$ = this.rootFormGroup.valueChanges.pipe(
        startWith(this.rootFormGroup.value),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        map(() => !!this.rootFormGroup.get(this.config?.controlPath!)),
        distinctUntilChanged(),
    );

    private readonly registeredControl$ = this.isControlRegistered$.pipe(
        filter(Boolean),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        map(() => this.rootFormGroup.get(this.config?.controlPath!)),
    );

    private readonly controlRemoved$ = this.isControlRegistered$.pipe(
        pairwise(),
        filter(([prevValue, currentValue]) => prevValue === true && currentValue === false),
    );

    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        if (!this.config) {
            this.vcr.createEmbeddedView(this.templateRef);
            return;
        }
        this.registeredControl$
            .pipe(
                switchMap((control) => control!.valueChanges.pipe(startWith(control!.value))),
                takeUntil(this.destroy$),
            )
            .subscribe((value) => {
                this.vcr.clear();
                if (this.config?.hasValue === value || (this.config?.hasValue === '*' && value)) {
                    this.vcr.createEmbeddedView(this.templateRef);
                }
            });

        this.controlRemoved$.pipe(takeUntil(this.destroy$)).subscribe(() => this.vcr.clear());
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
