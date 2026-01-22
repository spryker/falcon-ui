import { APP_INITIALIZER } from '@angular/core';
import { DynamicComponentConfig } from '../../component-builder/component-builder';
import { AppInitService } from './app-init.service';

export interface View extends DynamicComponentConfig {
    title?: string;
}

export interface FeatureEntity {
    entity: string;
    navigation: {
        title: string;
    };
    view: {
        root: View;
        [key: string]: View;
    };
}

export interface FeatureConfiguration {
    feature: string;
    navigation: {
        label: string;
        parent: string;
    };
    entities: Record<string, FeatureEntity>;
}

export interface SprykerFeatureResponse {
    id: string;
    type: 'spryker-features';
    attributes: {
        sprykerFeatureName: string;
        configuration: FeatureConfiguration;
    };
    links: {
        self: string;
    };
}

export interface FLRouteData {
    breadcrumbs: { label: string; path?: string }[];
    feature: string;
    title: string;
    entityKey: string;
    configuration: View;
}

export const appInitProvider = {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [AppInitService],
    useFactory: (init: AppInitService) => () => init.load(),
};
