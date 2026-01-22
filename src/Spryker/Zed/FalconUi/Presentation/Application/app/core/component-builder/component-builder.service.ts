import {
    Injectable,
    ViewContainerRef,
    Injector,
    ComponentRef,
    Type,
    inject,
    createComponent,
    EnvironmentInjector,
    ApplicationRef,
} from '@angular/core';
import {
    DYNAMIC_COMPONENTS,
    DynamicComponentConfig,
    DynamicComponentRegistryItem,
    getSlotOrderFromComponent,
} from './component-builder';

@Injectable({ providedIn: 'root' })
export class ComponentBuilderService {
    private readonly injector = inject(Injector);
    private readonly registry = inject(DYNAMIC_COMPONENTS).reduce<DynamicComponentRegistryItem>(
        (acc, curr) => ({ ...acc, ...curr }),
        Object.create(null),
    );
    private readonly appRef = inject(ApplicationRef);
    private readonly envInjector = inject(EnvironmentInjector);

    async buildComponent<T>(
        container: ViewContainerRef,
        config: DynamicComponentConfig,
    ): Promise<ComponentRef<T> | null> {
        if (config.content && !config.component) {
            const textNode = document.createTextNode(config.content);
            const parentElement = (container.element.nativeElement as HTMLElement).parentElement;

            if (parentElement) {
                parentElement.appendChild(textNode);
            } else {
                const commentNode = container.element.nativeElement;
                commentNode.parentNode?.insertBefore(textNode, commentNode.nextSibling);
            }

            return null;
        }

        if (!config.component) {
            throw new Error('Dynamic component config must have either "component" or "content" property');
        }

        const componentType = await this.resolveComponent(config.component);
        const slots = config.slots
            ? (Object.groupBy(config.slots, (s) => s.slot) as Record<string, DynamicComponentConfig[]>)
            : undefined;

        const slotOrder = getSlotOrderFromComponent(componentType, slots);

        const projectableNodes = slots ? await this.prepareProjectableNodes(slots, slotOrder, container.injector) : [];

        const componentRef = container.createComponent(componentType, {
            injector: container.injector,
            environmentInjector: this.envInjector,
            projectableNodes: projectableNodes.length > 0 ? projectableNodes : undefined,
        });

        this.applyInputs(componentRef, config);
        this.applyHostAttributes(componentRef, config);
        componentRef.changeDetectorRef.detectChanges();

        return componentRef as ComponentRef<T>;
    }

    private async prepareProjectableNodes(
        slots: Record<string, DynamicComponentConfig[]>,
        slotOrder: string[],
        parentInjector: Injector,
    ): Promise<Node[][]> {
        const projectableNodes: Node[][] = [];

        for (const slotName of slotOrder) {
            const children = slots[slotName] ?? [];
            const slotNodes: Node[] = [];

            for (const childConfig of children) {
                const childNode = await this.createDynamicNode(childConfig, parentInjector, slotName);
                slotNodes.push(childNode);
            }

            projectableNodes.push(slotNodes);
        }

        return projectableNodes;
    }

    private async createDynamicNode(
        config: DynamicComponentConfig,
        parentInjector: Injector,
        slotName?: string,
    ): Promise<Node> {
        if (config.content) {
            const textNode = document.createTextNode(config.content);
            return textNode;
        }

        if (!config.component) {
            throw new Error('Dynamic component config must have either "component" or "content" property');
        }

        const componentType = await this.resolveComponent(config.component);
        const slots = config.slots
            ? (Object.groupBy(config.slots, (s) => s.slot) as Record<string, DynamicComponentConfig[]>)
            : undefined;
        const projectableNodes = slots
            ? await this.prepareProjectableNodes(slots, getSlotOrderFromComponent(componentType, slots), parentInjector)
            : undefined;

        const componentRef = createComponent(componentType, {
            environmentInjector: this.envInjector,
            elementInjector: parentInjector ?? this.injector,
            projectableNodes,
        });

        this.applyInputs(componentRef, config);

        this.appRef.attachView(componentRef.hostView);

        const hostElement = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

        this.applyHostAttributes(componentRef, config);

        if (slotName && hostElement) {
            hostElement.setAttribute('slot', slotName);
        }

        componentRef.changeDetectorRef.detectChanges();

        return hostElement;
    }

    private async resolveComponent<T>(ref: string): Promise<Type<T>> {
        const component = this.registry[ref];

        if (!component) throw new Error(`Dynamic component "${ref}" not found in registry`);

        try {
            const result = (component as () => Promise<Type<T>> | Type<T>)();
            return result instanceof Promise ? await result : (component as Type<T>);
        } catch {
            return component as Type<T>;
        }
    }

    private applyInputs<T>(componentRef: ComponentRef<T>, config: DynamicComponentConfig) {
        if (!config.inputs) return;

        Object.entries(config.inputs ?? {}).forEach(([key, value]) => {
            componentRef.setInput(key, value);
        });
    }

    private applyHostAttributes<T>(componentRef: ComponentRef<T>, config: DynamicComponentConfig) {
        const hostEl = (componentRef.hostView as any).rootNodes?.[0] as HTMLElement;
        if (!hostEl) return;

        if (config.className) {
            hostEl.classList.add(
                ...(Array.isArray(config.className) ? config.className : config.className.split(/\s+/)),
            );
        }

        if (config.style) {
            Object.entries(config.style).forEach(([k, v]) => hostEl.style.setProperty(k, v));
        }

        if (config.attrs) {
            Object.entries(config.attrs).forEach(([k, v]) => hostEl.setAttribute(k, v));
        }

        if (config.id) {
            hostEl.setAttribute('data-id', config.id);
            hostEl.setAttribute('data-qa', config.id);
        }

        if (config.qa) {
            hostEl.setAttribute('data-qa', config.qa);
        }
    }
}
