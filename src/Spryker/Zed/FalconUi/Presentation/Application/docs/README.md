# Dynamic Layout & Forms Documentation

Complete guide for building dynamic, configuration-driven pages and forms in the Spryker application.

---

## Getting Started

### For End Users

If you want to create pages and forms using YAML configuration:

1. **[Component Builder Guide](./COMPONENT_BUILDER_USER_GUIDE.md)** - Create pages from YAML configuration
2. **[Dynamic Forms Guide](./DYNAMIC_FORMS_USER_GUIDE.md)** - Build forms with validation from YAML
3. **[Routing Guide](./ROUTING.md)** - Understand how URLs are generated from YAML

### For Developers

If you need to extend the system with custom components:

1. **[Module Registration Guide](./MODULE_REGISTRATION.md)** - Understand the module system and `zed.entry.ts`
2. **[Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md)** - Add custom components, controls, validators, and layouts
3. **[Form Controls Guide](./FORM_CONTROLS.md)** - Create reactive and dynamic form controls
4. **[Available Components](./AVAILABLE_COMPONENTS.md)** - Browse all available components

---

## Quick Reference

### Create a Page (YAML)

```yaml
entity: Customer

navigation:
    title: 'Customers'

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
                    - component: TableComponent
                      inputs:
                          config:
                              dataSource:
                                  type: 'http'
                                  url: '/api-platform/customers'
```

### Create a Form (YAML)

```yaml
config:
    - name: 'email'
      controlType: 'input'
      type: 'email'
      label: 'Email'
      validators:
          required: true
          email: true
```

### Register a Component (TypeScript)

```typescript
// src/SprykerFeature/YourFeature/src/SprykerFeature/Zed/YourFeature/Application/zed.entry.ts
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';

export const providers = [
    registerDynamicComponents({
        CustomWidgetComponent: () =>
            import('./components/custom-widget.component').then((c) => c.CustomWidgetComponent),
    }),
];
```

---

## Documentation Map

```
📚 Documentation
│
├── 📖 Dynamic Layout Guide
│   ├── YAML structure
│   ├── Component configuration
│   └── Styling & attributes
│
├── 📖 Dynamic Forms Guide
│   ├── Form configuration
│   ├── Control types
│   ├── Validation
│   └── Conditional fields
│
├── 📖 Routing Guide
│   ├── Route generation
│   ├── URL patterns
│   ├── Kebab-case conversion
│   └── Navigation integration
│
├── 🔧 Module Registration Guide
│   ├── zed.entry.ts system
│   ├── Prebuild script
│   └── Auto-discovery
│
├── 🔧 Extending and Overriding Guide
│   ├── Registering components
│   ├── Registering form controls
│   ├── Registering validators
│   ├── Global overrides
│   └── Best practices
│
├── 🔧 Form Controls Guide
│   ├── Reactive vs Dynamic controls
│   ├── ControlValueAccessor
│   ├── Creating new controls
│   └── Complete examples
│
└── 📋 Available Components
    ├── Button components
    ├── Form components
    ├── Table components
    ├── Layout components
    └── UI elements
```

---

## Key Concepts

### YAML Configuration

Pages and forms are defined in YAML files, loaded via API, and rendered automatically without writing code.

### Component Registry

Components are registered globally and referenced by name in YAML configurations.

### Module System

Each feature module can register its own components via `zed.entry.ts`, which are auto-discovered during build.

### Two-Layer Form Controls

Reactive controls (ControlValueAccessor) are wrapped by dynamic controls that read YAML configuration.

### Global Overrides

Registering a component with an existing name replaces it globally across the entire application.

---

## Common Tasks

| Task                            | Guide                                                     | Section                               |
| ------------------------------- | --------------------------------------------------------- | ------------------------------------- |
| Create a new page               | [Component Builder](./COMPONENT_BUILDER_USER_GUIDE.md)    | YAML file structure                   |
| Add a form to a page            | [Dynamic Forms](./DYNAMIC_FORMS_USER_GUIDE.md)            | Basic Example                         |
| Understand URL generation       | [Routing](./ROUTING.md)                                   | URL Pattern                           |
| Register a custom component     | [Extending and Overriding](./EXTENDING_AND_OVERRIDING.md) | Registering Dynamic Layout Components |
| Add a custom form control       | [Form Controls](./FORM_CONTROLS.md)                       | Creating a New Control                |
| Customize validation messages   | [Extending and Overriding](./EXTENDING_AND_OVERRIDING.md) | Registering Validation Error Messages |
| Set up a new feature module     | [Module Registration](./MODULE_REGISTRATION.md)           | Step-by-step Tutorial                 |
| Browse available components     | [Available Components](./AVAILABLE_COMPONENTS.md)         | Component Categories                  |
| Understand control architecture | [Form Controls](./FORM_CONTROLS.md)                       | Two Types of Controls                 |

---

## Need Help?

-   **Not working?** Check the Troubleshooting sections in each guide
-   **Want examples?** Each guide includes complete working examples
-   **Need to extend?** See the [Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md)
-   **Creating controls?** See the [Form Controls Guide](./FORM_CONTROLS.md)
