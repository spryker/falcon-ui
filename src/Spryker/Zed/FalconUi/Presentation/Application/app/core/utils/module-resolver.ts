import { Type, NgModule } from '@angular/core';

export function resolveModuleDependencies(module: Type<any>): Type<any>[] {
    const modules = new Set<Type<any>>();

    function collectModules(mod: Type<any>) {
        if (modules.has(mod)) return;
        modules.add(mod);

        const ngModule = (mod as any).ɵmod;

        ngModule?.imports?.forEach((importedModule: Type<any>) => {
            if (importedModule) {
                collectModules(importedModule);
            }
        });
    }

    collectModules(module);
    return Array.from(modules);
}

export function createMultiModuleBundle(sourceModules: Type<any>[], name: string = 'MultiModuleBundle'): Type<any> {
    const allDependencies: Type<any>[] = [];

    for (const mod of sourceModules) {
        allDependencies.push(...resolveModuleDependencies(mod));
    }

    @NgModule({
        imports: allDependencies,
        exports: allDependencies,
    })
    class MultiModuleBundle {}

    Object.defineProperty(MultiModuleBundle, 'name', { value: name });

    return MultiModuleBundle;
}
