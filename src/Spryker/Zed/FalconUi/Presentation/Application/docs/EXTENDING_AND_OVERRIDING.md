# Extending and Overriding Components

This guide explains how to extend the Dynamic Layout and Dynamic Forms systems with custom components, controls, validators, and layouts. It also covers how component overrides work globally across the application.

## Prerequisites

-   Angular 18+ application
-   Dynamic Layout/Forms system configured
-   Understanding of [Module Registration](./MODULE_REGISTRATION.md)

---

## Registration Functions

The system provides several registration functions for extending functionality:

| Function                          | Purpose                              | Used In        |
| --------------------------------- | ------------------------------------ | -------------- |
| `registerDynamicComponents`       | Register layout components           | Dynamic Layout |
| `registerDynamicFormControls`     | Register form control types          | Dynamic Forms  |
| `registerValidationErrorMessages` | Register validation error messages   | Dynamic Forms  |
| `registerControlLayoutComponents` | Register form field layout templates | Dynamic Forms  |

---

## Registering Dynamic Layout Components

### Component Types

The Dynamic Layout system supports two types of components:

-   **Standalone Components** (Recommended): Modern Angular 18+ components without NgModule
-   **Module-based Components**: Traditional components that depend on NgModule

> **Recommendation**: Use standalone components for all new development. Standalone components are simpler to manage, have better tree-shaking, and align with Angular's modern architecture. Only use module-based components when working with legacy code or third-party libraries that require NgModule.

### Registration for Standalone Components

Register standalone components directly using `registerDynamicComponents`.

**File:** `src/SprykerFeature/YourFeature/src/SprykerFeature/Zed/YourFeature/Application/zed.entry.ts`

```typescript
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';

export const providers = [
    registerDynamicComponents({
        // Lazy loading (recommended)
        CustomWidgetComponent: () =>
            import('./components/custom-widget.component').then((c) => c.CustomWidgetComponent),
        CustomChartComponent: () => import('./components/custom-chart.component').then((c) => c.CustomChartComponent),

        // Eager loading (for small, frequently used components)
        CustomIconComponent: import('./components/custom-icon.component').then((c) => c.CustomIconComponent),
    }),
];
```

### Registration for Module-based Components

If your component uses NgModule and has module dependencies, you must also register the module using `createMultiModuleBundle`.

```typescript
import { importProvidersFrom } from '@angular/core';
import { registerDynamicComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/component-builder/component-builder';
import { createMultiModuleBundle } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/utils/module-resolver';
import { CustomChartModule } from './modules/custom-chart.module';
import { CustomWidgetModule } from './modules/custom-widget.module';

export const providers = [
    // Register modules for dependency resolution
    importProvidersFrom(
        createMultiModuleBundle(
            [CustomChartModule, CustomWidgetModule],
            'CustomComponentsBundle', // Optional bundle name
        ),
    ),

    // Register components for YAML usage
    registerDynamicComponents({
        CustomChartComponent: () => import('./modules/custom-chart.module').then((m) => m.CustomChartComponent),
        CustomWidgetComponent: () => import('./modules/custom-widget.module').then((m) => m.CustomWidgetComponent),
    }),
];
```

**When not to use `createMultiModuleBundle`:**

-   Component is standalone (has `standalone: true`)
-   Component has no module dependencies

**Result:** Components are now available in YAML:

```yaml
component: CustomWidgetComponent
inputs:
    title: 'Sales Dashboard'
    data: { ... }
```

### Loading Strategies

-   **Lazy:** `() => import(...)` - Component loaded when first used (recommended for large components)
-   **Eager:** `import(...)` - Component loaded immediately at startup (use for small, frequent components)

---

## Registering Dynamic Form Controls

### Basic Control Registration

Register custom form control types for use in Dynamic Forms YAML configurations.

For detailed information on creating form controls (reactive and dynamic), see [Form Controls Guide](./FORM_CONTROLS.md).

**1. Create control component:**

```typescript
import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';
import { DatePickerComponent } from '../reactive-controls/date-picker/date-picker.component';

@Component({
    selector: 'fl-dynamic-date-picker',
    standalone: true,
    imports: [...sharedDynamicControlDeps, DatePickerComponent],
    viewProviders: [dynamicControlProvider],
    template: `
        <spy-form-item [for]="control.controlKey" [error]="errorText">
            {{ control.config.label }}
            <fl-date-picker [id]="control.controlKey" [formControlName]="control.controlKey" control></fl-date-picker>
        </spy-form-item>
    `,
})
export class DynamicDatePickerComponent extends BaseDynamicControl {}
```

**2. Register in your module's `zed.entry.ts`:**

```typescript
import { registerDynamicFormControls } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms';

export const providers = [
    registerDynamicFormControls({
        'date-picker': () =>
            import('./dynamic-controls/dynamic-date-picker.component').then((c) => c.DynamicDatePickerComponent),
        'phone-input': () =>
            import('./dynamic-controls/dynamic-phone-input.component').then((c) => c.DynamicPhoneInputComponent),
    }),
];
```

**3. Use in YAML:**

```yaml
config:
    - name: 'birthDate'
      controlType: 'date-picker'
      label: 'Birth Date'
      value: null
      validators:
          required: true
```

---

## Registering Validation Error Messages

Customize validation error messages displayed when form validation fails.

```typescript
import { registerValidationErrorMessages } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms';

export const providers = [
    registerValidationErrorMessages({
        required: () => 'This field is required',
        email: () => 'Please enter a valid email address',
        minlength: (error) => `Minimum length is ${error.requiredLength} characters`,
        maxlength: (error) => `Maximum length is ${error.requiredLength} characters`,
        pattern: () => 'Please enter a valid format',
        min: (error) => `Minimum value is ${error.min}`,
        max: (error) => `Maximum value is ${error.max}`,
        // Custom validators
        phoneNumber: () => 'Please enter a valid phone number',
    }),
];
```

**How it works:**

-   Function receives error object as parameter
-   Return string to display
-   Can access error details like `requiredLength`, `min`, `max`, etc.

---

## Registering Layout Templates

Layout templates wrap form controls (e.g., in cards or collapsible sections).

**1. Create layout component:**

```typescript
import { Component, input } from '@angular/core';
import { CardComponent } from '@spryker/card';

@Component({
    selector: 'fl-card-control-layout',
    standalone: true,
    imports: [CardComponent],
    template: `
        <spy-card [spyTitle]="title()">
            <ng-content></ng-content>
        </spy-card>
    `,
})
export class CardControlLayoutComponent {
    title = input<string>('');
}
```

**2. Register in your module's `zed.entry.ts`:**

```typescript
import { registerControlLayoutComponents } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms';

export const providers = [
    registerControlLayoutComponents({
        card: () => import('./layouts/card-control-layout.component').then((c) => c.CardControlLayoutComponent),
        collapsible: () =>
            import('./layouts/collapsible-control-layout.component').then((c) => c.CollapsibleControlLayoutComponent),
    }),
];
```

**3. Use in YAML:**

```yaml
config:
    - name: 'email'
      controlType: 'input'
      type: 'email'
      label: 'Email Address'
      layout:
          template: 'card'
          title: 'Login Credentials'
```

---

## ⚠️ Global Overrides: How They Work

### Critical Concept

**When you register a component, control, or layout with a name that already exists, it overrides that registration globally for the entire application.**

This is not scoped to your module—it affects **every YAML configuration** in the system.

### Layout Component Override Example

```typescript
// In your module's zed.entry.ts
export const providers = [
    registerDynamicComponents({
        // This OVERRIDES TableComponent EVERYWHERE
        TableComponent: () => import('./custom-table.component').then((c) => c.CustomTableComponent),
    }),
];
```

**Result:**

-   Customer Management module uses `TableComponent` → gets your custom version
-   Product Management module uses `TableComponent` → gets your custom version
-   Order Management module uses `TableComponent` → gets your custom version
-   **ALL modules** using `TableComponent` now use your custom implementation

### Form Control Override Example

```typescript
// In your module's zed.entry.ts
export const providers = [
    registerDynamicFormControls({
        // This OVERRIDES the 'input' control EVERYWHERE
        input: () => import('./custom-input.component').then((c) => c.CustomInputComponent),
    }),
];
```

**Result:** ALL forms using `controlType: 'input'` will now use your custom implementation.

### Validator Message Override Example

```typescript
export const providers = [
    registerValidationErrorMessages({
        // This OVERRIDES the 'required' message EVERYWHERE
        required: () => 'You must fill this field',
    }),
];
```

**Result:** ALL required field errors will show your custom message.

---

## When to Use Overrides

### Good Use Cases

**Global theming or branding:**

```typescript
registerDynamicComponents({
    ButtonComponent: () => import('./branded-button.component').then((c) => c.BrandedButtonComponent),
});
```

**Application-wide behavior changes:**

```typescript
registerDynamicFormControls({
    input: () => import('./input-with-autocomplete.component').then((c) => c.InputWithAutocompleteComponent),
});
```

**Consistent validation messages:**

```typescript
registerValidationErrorMessages({
    required: () => 'This field cannot be empty',
});
```

### When to Avoid Overrides

**Module-specific customization:**

```typescript
// DON'T: This affects all modules
registerDynamicComponents({
    TableComponent: () => import('./customer-table.component').then((c) => c.CustomerTableComponent),
});

// DO: Use unique name
registerDynamicComponents({
    CustomerTableComponent: () => import('./customer-table.component').then((c) => c.CustomerTableComponent),
});
```

**Testing different implementations:**

```typescript
// DON'T: This breaks other modules
registerDynamicFormControls({
    select: () => import('./experimental-select.component').then((c) => c.ExperimentalSelectComponent),
});

// DO: Use unique name for testing
registerDynamicFormControls({
    'experimental-select': () => import('./experimental-select.component').then((c) => c.ExperimentalSelectComponent),
});
```

---

## Best Practices

### 1. Use Unique Names for New Components

```typescript
// Good: Unique name
registerDynamicComponents({
    SalesDashboardComponent: () => import('./sales-dashboard.component').then((c) => c.SalesDashboardComponent),
});

// Bad: Generic name that might conflict
registerDynamicComponents({
    DashboardComponent: () => import('./sales-dashboard.component').then((c) => c.SalesDashboardComponent),
});
```

### 2. Prefix Module-Specific Components

```typescript
registerDynamicComponents({
    CustomerWidgetComponent: () => import('./widget.component').then((c) => c.WidgetComponent),
    CustomerFormComponent: () => import('./form.component').then((c) => c.FormComponent),
    CustomerTableComponent: () => import('./table.component').then((c) => c.TableComponent),
});
```

### 3. Use Lazy Loading

```typescript
// Recommended: Lazy loading
registerDynamicComponents({
    HeavyChartComponent: () => import('./heavy-chart.component').then((c) => c.HeavyChartComponent),
});

// Only for small, frequently used components
registerDynamicComponents({
    SimpleIconComponent: import('./simple-icon.component').then((c) => c.SimpleIconComponent),
});
```

### 4. Group Related Registrations

```typescript
export const providers = [
    // Layout components
    registerDynamicComponents({
        CustomerDashboardComponent: () => import('./dashboard.component').then((c) => c.DashboardComponent),
        CustomerWidgetComponent: () => import('./widget.component').then((c) => c.WidgetComponent),
    }),

    // Form controls
    registerDynamicFormControls({
        'customer-type-select': () =>
            import('./customer-type-select.component').then((c) => c.CustomerTypeSelectComponent),
    }),

    // Validation messages
    registerValidationErrorMessages({
        customerIdInvalid: () => 'Please enter a valid customer ID',
    }),
];
```

---

## Troubleshooting

### Component not found in YAML

**Problem:** Error: "Component 'MyComponent' not found"

**Solutions:**

1. Check component name matches exactly (case-sensitive)
2. Verify `zed.entry.ts` is in correct location: `/src/SprykerFeature/Zed/*/Application/zed.entry.ts`
3. Check prebuild script discovered your module (check `auto.zed.entries.ts`)
4. Restart dev server to regenerate `auto.zed.entries.ts`

### Override not working

**Problem:** Override doesn't take effect

**Solutions:**

1. Check provider order in `main.ts` - module providers should come after app providers
2. Verify your module's providers are in `allZedModules`
3. Clear browser cache and rebuild
4. Check console for registration errors

### Wrong component used

**Problem:** Expected override but original component still renders

**Solutions:**

1. Verify exact name match (case-sensitive)
2. Check if another module also overrides the same component (last wins)
3. Review `main.ts` provider order - last registration wins
