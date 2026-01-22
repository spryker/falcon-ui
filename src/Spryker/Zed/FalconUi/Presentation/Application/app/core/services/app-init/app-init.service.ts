import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Route, Router } from '@angular/router';
import { FeatureConfiguration, FeatureEntity } from './app-init.model';
import { ComponentBuilderComponent } from '../../component-builder/component-builder.component';
import { ConfigService } from '../config/config.service';

const toKebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

@Injectable({ providedIn: 'root' })
export class AppInitService {
    private readonly router = inject(Router);
    private readonly document = inject(DOCUMENT);
    private readonly configService = inject(ConfigService);
    private readonly window = this.document.defaultView!;

    async load(): Promise<void> {
        const accessToken = await this.configService.getAccessToken();

        if (!accessToken) {
            console.error('[AppInitService] Failed to obtain access token');
        }

        const response = await (
            await fetch(this.configService.getConfig().apiUrl, {
                headers: {
                    Accept: 'application/ld+json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        ).json();
        const routes: Route[] = [];

        for (const _feature of response.member) {
            const { feature, entities, navigation } = _feature.configuration as FeatureConfiguration;
            const featurePath = toKebab(feature);

            routes.push(
                ...Object.entries(entities).flatMap(([entityKey, entityConfig]: [string, FeatureEntity]) => {
                    const keyPath = toKebab(entityKey);
                    const rootPath = `${featurePath}/${keyPath}`;
                    const breadcrumbs = [
                        { label: navigation.label },
                        { label: entityConfig.navigation.title, path: `/${rootPath}` },
                    ];

                    const rootRoute: Route = {
                        path: rootPath,
                        component: ComponentBuilderComponent,
                        data: {
                            breadcrumbs,
                            feature,
                            title: entityConfig.navigation.title,
                            entityKey,
                            configuration: entityConfig.view.root,
                        },
                    };

                    const subRoutes: Route[] = Object.entries(entityConfig.view)
                        .filter(([viewKey]) => viewKey !== 'root')
                        .map(([viewKey, configuration]) => {
                            const path = `${rootPath}/${toKebab(viewKey)}`;

                            return {
                                path,
                                component: ComponentBuilderComponent,
                                data: {
                                    breadcrumbs: [...breadcrumbs, { label: configuration.title, path: `/${path}` }],
                                    feature,
                                    title: configuration.title,
                                    entityKey,
                                    configuration,
                                },
                            };
                        });

                    return [rootRoute, ...subRoutes];
                }),
            );
        }

        this.router.resetConfig([...this.router.config, ...routes]);

        this.enableHybridRouting();
    }

    private enableHybridRouting(): void {
        this.document.addEventListener('click', async (event) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a') as HTMLAnchorElement | null;

            if (!link?.href) return;

            const url = new URL(link.href);

            if (url.origin !== this.window.location.origin) return;

            const routeMatch = this.router.config.some((route) => url.pathname.replace(/^\//, '') === route.path);

            if (!routeMatch) return;

            event.preventDefault();
            await this.router.navigateByUrl(url.pathname + url.search);
            this.updateActiveMenu();
        });

        this.window.addEventListener('popstate', async () => {
            const path = this.window.location.pathname + this.window.location.search;
            const match = this.router.config.some((r) => path.replace(/^\//, '').startsWith(r.path!));
            if (match) await this.router.navigateByUrl(path);
            this.updateActiveMenu();
        });
    }

    private updateActiveMenu(): void {
        const currentPath = this.window.location.pathname;
        const items = this.document.querySelectorAll<HTMLLIElement>('li.item');

        items.forEach((li) => {
            const a = li.querySelector<HTMLAnchorElement>('a[href]');

            if (!a) return;

            const hrefPath = new URL(a.href, this.window.location.origin).pathname;
            const isActive = currentPath === hrefPath || (currentPath.startsWith(hrefPath + '/') && hrefPath !== '/');

            li.classList.toggle('active', isActive);
        });
    }
}
