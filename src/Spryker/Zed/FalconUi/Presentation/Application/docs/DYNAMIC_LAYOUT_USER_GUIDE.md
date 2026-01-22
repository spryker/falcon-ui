# Component Builder

With the Component Builder system, you can build pages from YAML configuration files instead of writing code. This allows rapid development of admin interfaces and data management pages.

## Prerequisites

-   Angular 18+ application
-   Component Builder system configured
-   Access to YAML configuration directory

---

## What is Component Builder?

Component Builder is a configuration-driven rendering system that:

-   Creates routes automatically from YAML files
-   Dynamically renders components from declarative configuration
-   Generates navigation menu items
-   Supports nested component composition with slots
-   Builds component trees at runtime without writing template code

## How it works

1. Create a YAML file in `src/SprykerFeature/[FeatureName]/resources/entity/[entity-name].yml`
2. System loads configuration via API at startup
3. Routes are created automatically (see [Routing Guide](./ROUTING.md))
4. Pages appear in navigation

---

## YAML file structure

The basic structure of a Component Builder YAML configuration using the new DSL:

```yaml
entity: EntityName

navigation:
    title: 'Display Name'

source:
    type: 'propel'
    schema: 'path/to/schema.xml'
    entity: 'spy_entity_name'

view:
    layout:
        use:
            - layout.entity.page

    components:
        layout.entity.page:
            id: 'page-layout'
            virtualRoute: 'root' # Main page
            component: LayoutComponent
            slots:
                content:
                    - use: table.entity.list

        table.entity.list:
            component: TableComponent
            inputs:
                config:
                    dataSource:
                        type: 'http'
                        url: '/api/entity'
                    columns:
                        - { id: 'name', title: 'Name' }
                        - { id: 'createdAt', title: 'Created At' }
```

> **Note:** The YAML above is written in the **new DSL** (`view.layout` + `view.components`). At runtime, the backend transformer converts it into the legacy `view.root` structure consumed by the frontend.

---

## Routing

Views automatically create routes based on naming convention. For detailed information about route generation and URL patterns, see [Routing Guide](./ROUTING.md).

**Quick reference:**

-   `root` → `/{feature-name}/{entity-name}`
-   `edit` → `/{feature-name}/{entity-name}/edit`
-   `create` → `/{feature-name}/{entity-name}/create`
-   Custom views → `/{feature-name}/{entity-name}/{view-name}`

All names are automatically converted to kebab-case.

---

## Component Configuration Interface

```yaml
component: ComponentName # Required: registered component name
content: 'text content' # Optional: plain text (alternative to component)
inputs: # Optional: component settings
    key: value
slots: # Optional: nested components
    - slot: 'slotName' # Optional: named slot
      component: ChildComponent
      inputs: { ... }
    - content: 'text' # Or simple text
className: 'css-class' # Optional: CSS class(es) - string or array
style: # Optional: inline styles
    color: 'red'
    'font-size': '16px'
attrs: # Optional: HTML attributes
    'data-attr': 'value'
id: 'unique-id' # Optional: HTML id
qa: 'test-id' # Optional: data-qa attribute
```

For a complete list of available components, see [Available Components](./AVAILABLE_COMPONENTS.md).

## Basic Example

```yaml
entity: Customer

navigation:
    title: 'Customers'

source:
    type: 'propel'
    schema: 'vendor/spryker/spryker/Bundles/Customer/src/Spryker/Zed/Customer/Persistence/Propel/schema/schema.xml'
    entity: 'spy_customer'

view:
    layout:
        use:
            - layout.customer.page

    components:
        layout.customer.page:
            id: 'page-layout'
            virtualRoute: 'root'
            component: LayoutComponent
            slots:
                content:
                    - use: table.customer.list

        table.customer.list:
            component: TableComponent
            inputs:
                config:
                    dataSource:
                        type: 'http'
                        url: '/api-platform/customers'
                    columns:
                        - { id: 'firstName', title: 'Name' }
                        - { id: 'email', title: 'Email' }
```

## Example with Multiple Views

```yaml
entity: Customer

navigation:
    title: 'Customers'

source:
    type: 'propel'
    schema: 'vendor/spryker/spryker/Bundles/Customer/src/Spryker/Zed/Customer/Persistence/Propel/schema/schema.xml'
    entity: 'spy_customer'

view:
    layout:
        use:
            - layout.customer.page
            - layout.customer.edit.page

    components:
        layout.customer.page:
            id: 'page-layout'
            virtualRoute: 'root'
            component: LayoutComponent
            slots:
                content:
                    - use: table.customer.list

        layout.customer.edit.page:
            id: 'edit-page-layout'
            virtualRoute: 'edit'
            component: LayoutComponent
            slots:
                content:
                    - use: form.customer.edit

        table.customer.list:
            component: TableComponent
            inputs:
                config:
                    dataSource:
                        type: 'http'
                        url: '/api-platform/customers'

        form.customer.edit:
            component: DynamicFormComponent
            inputs:
                config:
                    controls:
                        - name: 'firstName'
                          controlType: 'input'
                          type: 'text'
                          label: 'First Name'
```

After backend transformation, this configuration produces two routes:

-   `/customer-relation-management/customer` (list, from `virtualRoute: 'root'`)
-   `/customer-relation-management/customer/edit` (form, from `virtualRoute: 'edit'`)

## For Developers: Registering Components

To add custom components for use in Component Builder YAML configurations, register them in your module's `zed.entry.ts` file.

The Component Builder system maintains a registry of available components. When rendering a configuration like `component: CustomComponent`, it looks up the component in this registry and dynamically creates an instance.

For detailed information on component registration, overrides, and best practices, see [Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md).

For module-level registration setup, see [Module Registration Guide](./MODULE_REGISTRATION.md).

**Quick example:**

```typescript
// src/SprykerFeature/YourFeature/src/SprykerFeature/Zed/YourFeature/Application/zed.entry.ts
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';

export const providers = [
    registerDynamicComponents({
        CustomDashboardComponent: () =>
            import('./components/custom-dashboard.component').then((c) => c.CustomDashboardComponent),
    }),
];
```

**Result:** ComponentBuilderComponent can now dynamically render your component from YAML:

```yaml
component: CustomDashboardComponent
inputs:
    title: 'My Dashboard'
```

## Styling and Attributes

### CSS Classes

Add custom CSS classes to components:

```yaml
component: LayoutComponent
className: 'page-layout dark' # Single class or space-separated
# Or as array:
className: ['page-layout', 'dark']
```

### Inline Styles

Add inline CSS styles:

```yaml
component: LayoutComponent
style:
    background-color: '#f5f5f5'
    padding: '20px'
    border-radius: '8px'
```

### HTML Attributes

Add custom HTML attributes:

```yaml
component: LayoutComponent
attrs:
    'data-layout-type': 'main'
    'aria-label': 'Main page layout'
```

### QA/Testing Attributes

Add identifiers for automated testing:

```yaml
component: TableComponent
qa: 'customer-table' # Adds data-qa="customer-table"
id: 'main-table' # Adds data-id="main-table" and data-qa="main-table"
```
