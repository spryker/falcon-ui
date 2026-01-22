import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TabComponent, TabsComponent, TabsMode, TabsModule } from '@spryker/tabs';
import { ComponentBuilderComponent } from '../../core/component-builder/component-builder.component';
import { DynamicComponentConfig } from '../../core/component-builder/component-builder';

interface TabConfig {
    spyTitle: TabComponent['spyTitle'];
    disabled: TabComponent['disabled'];
    hasWarning: TabComponent['hasWarning'];
    iconName?: TabComponent['iconName'];
    slots: DynamicComponentConfig[];
}

@Component({
    selector: 'fl-dynamic-tabs',
    standalone: true,
    imports: [TabsModule, ComponentBuilderComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <spy-tabs [tab]="tab" [mode]="mode" [animateSlides]="animateSlides">
            @for (tabConfig of tabs; track $index) {
                <spy-tab
                    [spyTitle]="tabConfig.spyTitle"
                    [disabled]="tabConfig.disabled"
                    [hasWarning]="tabConfig.hasWarning"
                    [iconName]="tabConfig.iconName"
                >
                    <fl-component-builder [configuration]="tabConfig.slots" />
                </spy-tab>
            }
        </spy-tabs>
    `,
})
export class DynamicTabsComponent {
    @Input() tab: TabsComponent['tab'] = 0;
    @Input() mode: TabsComponent['mode'] = TabsMode.Line;
    @Input() animateSlides: TabsComponent['animateSlides'] = false;
    @Input() tabs: TabConfig[] = [];
}
