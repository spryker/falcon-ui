# Module Registration

The application uses a modular architecture where each feature module can register its own components, form controls, layouts, and other providers. This allows features to be self-contained and independently developed.

## Prerequisites

-   Feature module structure in `src/SprykerFeature/[FeatureName]/src/SprykerFeature/Zed/[FeatureName]/Application/`
-   Understanding of Angular providers
-   Prebuild script configured in `package.json`

---

## What is module registration?

Module registration is a mechanism that allows feature modules to:

-   Register custom components for Dynamic Layout
-   Register form controls for Dynamic Forms
-   Register layout templates
-   Override existing components from other modules
-   Provide module-specific services

Each module registers its providers in a `zed.entry.ts` file, which is automatically discovered and included in the application at build time.

---

## How it works

1. Create `zed.entry.ts` file in your module's Application directory
2. Export `providers` array with your registrations
3. Build application - prebuild script automatically runs and generates `auto.zed.entries.ts`
4. Application includes all registered providers at startup

**Build process:**

```
npm run build (or dev server start)
  ↓
prebuild hook runs generate-zed-entries.mjs
  ↓
Script scans for zed.entry.ts files
  ↓
auto.zed.entries.ts is generated with all module imports
  ↓
main.ts bootstraps app with ...allZedModules
```

**Note:** The prebuild script runs automatically as part of the build process. You don't need to run it manually.

---

## 1. Create module entry file

Create a file named `zed.entry.ts` in your module's Application directory.

**File structure:**

```
src/SprykerFeature/
  └── [YourFeature]/
      └── src/SprykerFeature/Zed/[YourFeature]/
          └── Application/
              └── zed.entry.ts  ← Create this file
```

**Example:** `src/SprykerFeature/CustomerRelationManagement/src/SprykerFeature/Zed/CustomerRelationManagement/Application/zed.entry.ts`

---

## 2. Register components

Components registered in `zed.entry.ts` become available for use in Dynamic Layout YAML configurations.

**Basic registration:**

```typescript
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';
import { MyCustomComponent } from './components/my-custom.component';

export const providers = [
    registerDynamicComponents({
        MyCustomComponent,
    }),
];
```

**Lazy loading registration:**

```typescript
export const providers = [
    registerDynamicComponents({
        MyCustomComponent: () => import('./components/my-custom.component').then((m) => m.MyCustomComponent),
        AnotherComponent: () => import('./components/another.component').then((m) => m.AnotherComponent),
    }),
];
```

---

## 3. Override existing components

You can override components from other modules by registering a component with the same name.

```typescript
import { Component } from '@angular/core';
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';

@Component({
    standalone: true,
    template: '<div class="custom-header">{{ title }}</div>',
    styles: [
        `
            .custom-header {
                background: #1976d2;
                color: white;
                padding: 1rem;
            }
        `,
    ],
})
export class CustomHeaderComponent {
    @Input() title = '';
}

export const providers = [
    registerDynamicComponents({
        // This overrides the default HeaderComponent globally for the entire application
        HeaderComponent: CustomHeaderComponent,
    }),
];
```

**Result:** Anywhere `HeaderComponent` is used in YAML configurations (in any module or feature), your `CustomHeaderComponent` will be rendered instead.

**Important:** Component overrides are **global** - they affect the entire application, not just the module where they are registered. Use this carefully to avoid unintended side effects in other features.

---

## 4. Register form controls

Feature modules can register custom form control types.

```typescript
import {
    registerDynamicFormControls,
    registerValidationErrorMessages,
} from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms.model';

export const providers = [
    registerDynamicFormControls({
        'custom-input': () => import('./form-controls/custom-input.component').then((m) => m.CustomInputComponent),
        'date-picker': () => import('./form-controls/date-picker.component').then((m) => m.DatePickerComponent),
    }),
    registerValidationErrorMessages({
        customValidator: () => `Custom validation error message`,
    }),
];
```

---

## 5. Register layout templates

Register custom layout templates for wrapping form controls or components.

```typescript
import { registerControlLayoutComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/layouts/layout.model';

export const providers = [
    registerControlLayoutComponents({
        'custom-card': () => import('./layouts/custom-card.component').then((m) => m.CustomCardComponent),
        'sidebar-layout': () => import('./layouts/sidebar-layout.component').then((m) => m.SidebarLayoutComponent),
    }),
];
```

---

## 6. Combine multiple registrations

A single `zed.entry.ts` can export multiple provider arrays.

```typescript
import { Component, Input } from '@angular/core';
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';
import { registerDynamicFormControls } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms.model';
import { registerControlLayoutComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/layouts/layout.model';

@Component({
    standalone: true,
    template: '<div>{{ title }}</div>',
})
export class CustomerHeaderComponent {
    @Input() title = '';
}

export const providers = [
    // Register components
    registerDynamicComponents({
        CustomerHeaderComponent,
        CustomerTableComponent: () => import('./components/table.component').then((m) => m.CustomerTableComponent),
    }),

    // Register form controls
    registerDynamicFormControls({
        'customer-select': () =>
            import('./form-controls/customer-select.component').then((m) => m.CustomerSelectComponent),
    }),

    // Register form control layouts
    registerControlLayoutComponents({
        'customer-card': () => import('./layouts/customer-card.component').then((m) => m.CustomerCardComponent),
    }),
];
```

---

## 7. Use registered components

Once registered, components are automatically available in YAML configurations after application rebuild.

```yaml
entity: Customer

view:
    root:
        component: CustomerHeaderComponent # Your custom component
        inputs:
            title: 'Customer Management'
        slots:
            - component: CustomerTableComponent # Your custom table
              inputs:
                  config: { ... }
```

---

## Prebuild script details

The `generate-zed-entries.mjs` script automates module discovery and runs automatically during the build process.

**Location:** `src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/generate-zed-entries.mjs`

**When it runs:**

-   Automatically before each build (`npm run build`)
-   Automatically when starting dev server
-   Part of the prebuild hook in package.json

**How it works:**

1. Scans from `src/SprykerFeature/` directory
2. Recursively searches for `zed.entry.ts` files
3. Filters only files matching path: `/src/SprykerFeature/Zed/*/Application/zed.entry.ts`
4. Generates relative imports for each found file
5. Exports `allZedModules` array with all providers
6. Writes to `auto.zed.entries.ts`

**Generated file example:** `auto.zed.entries.ts`

```typescript
// AUTO-GENERATED FILE. DO NOT EDIT.
import { providers as mod0 } from './../../../../../../../CustomerRelationManagement/src/SprykerFeature/Zed/CustomerRelationManagement/Application/zed.entry';
import { providers as mod1 } from './../../../../../../../ProductManagement/src/SprykerFeature/Zed/ProductManagement/Application/zed.entry';

export const allZedModules = [mod0, mod1];
```

**Console output:**

```
Found 2 entries:
  • /path/to/CustomerRelationManagement/Application/zed.entry.ts
  • /path/to/ProductManagement/Application/zed.entry.ts
Generated 2 entries → /path/to/auto.zed.entries.ts
```

---

## Application bootstrap

The application bootstrap process in `main.ts` includes all module providers:

```typescript
import { allZedModules } from './auto.zed.entries';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor, tableInterceptor])),
        provideAnimations(),

        importProvidersFrom(MerchantPortalModule),

        appInitProvider,

        uiComponentsProviders, // Spryker UI library components
        appComponentsProviders, // Application-level components

        ...allZedModules, // All feature module providers (auto-discovered)
    ],
});
```

**Provider order matters:**

Providers are processed in order, so later registrations can override earlier ones. Module providers (`...allZedModules`) are added last, allowing feature modules to override application-level components.

**Important:** When a module overrides a component, the override is **global** and affects the entire application. The last registered provider for a component name wins.

---

## Best practices

### 1. Use lazy loading for large components

```typescript
export const providers = [
    registerDynamicComponents({
        // ✅ Good: Lazy loaded
        LargeTableComponent: () => import('./components/large-table.component').then((m) => m.LargeTableComponent),

        // ❌ Avoid: Eager loading large components
        // LargeTableComponent,
    }),
];
```

### 2. Keep modules self-contained

Each module should be independent and not rely on components from other feature modules.

```typescript
// ✅ Good: Import from framework
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/...';

// ❌ Avoid: Import from other features
// import { SomeComponent } from 'src/SprykerFeature/OtherFeature/...';
```

### 3. Use consistent naming

Follow naming conventions for components:

```typescript
export const providers = [
    registerDynamicComponents({
        CustomerHeaderComponent, // ✅ Clear, descriptive
        CustomerListTableComponent, // ✅ Shows purpose
        MyComponent, // ❌ Too generic
    }),
];
```

### 4. Document overrides

When overriding components, add comments explaining why and be aware of global impact:

```typescript
export const providers = [
    registerDynamicComponents({
        // Override HeaderComponent globally for customer-specific branding
        // WARNING: This affects ALL features in the application
        HeaderComponent: CustomerBrandedHeaderComponent,
    }),
];
```

---

## Troubleshooting

### Components not appearing in YAML

**Problem:** Registered component shows "component not found" error.

**Solutions:**

1. Rebuild application to trigger automatic prebuild script
2. Check `auto.zed.entries.ts` includes your module
3. Verify component name matches exactly (case-sensitive)
4. Restart dev server

### Prebuild script doesn't find module

**Problem:** `zed.entry.ts` file not discovered by script.

**Solutions:**

1. Verify file path matches pattern: `/src/SprykerFeature/Zed/*/Application/zed.entry.ts`
2. Check file is named exactly `zed.entry.ts` (case-sensitive)
3. Ensure file is in correct directory structure
4. Rebuild application to re-run prebuild script

### Component override not working

**Problem:** Override registered but original component still renders.

**Solutions:**

1. Verify provider order - module providers should come after app providers
2. Check `main.ts` has `...allZedModules` after `appComponentsProviders`
3. Ensure component name matches exactly
