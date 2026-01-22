/* eslint-disable no-console */
import { Component, inject, ViewChild, ViewContainerRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBuilderService } from './component-builder.service';
import { View } from '../services/app-init/app-init.model';

@Component({
    selector: 'fl-component-builder',
    standalone: true,
    template: `<ng-container #root></ng-container>`,
})
export class ComponentBuilderComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly builder = inject(ComponentBuilderService);

    @Input() configuration?: View | View[];

    @ViewChild('root', { read: ViewContainerRef, static: true }) private root!: ViewContainerRef;

    ngOnInit(): void {
        const configuration = this.configuration ?? this.route.snapshot.data.configuration;

        if (configuration) {
            const views = Array.isArray(configuration) ? configuration : [configuration];

            this.buildSequentially(views);
        } else {
            console.error('No configuration found in route data');
        }
    }

    private async buildSequentially(views: View[]): Promise<void> {
        for (const view of views) {
            await this.builder.buildComponent(this.root, view);
        }
    }
}
