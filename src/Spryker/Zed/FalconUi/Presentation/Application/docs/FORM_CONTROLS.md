# Form Controls: Reactive and Dynamic

This guide explains the two types of form controls in the application and how to create new ones.

## Prerequisites

-   Angular 18+ application
-   Understanding of Angular Forms (Reactive Forms)
-   Understanding of [Dynamic Forms](./DYNAMIC_FORMS_USER_GUIDE.md)

---

## Two Types of Controls

The application uses a two-layer architecture for form controls:

### 1. Reactive Controls

**Purpose:** Low-level, reusable form inputs that work with Angular Reactive Forms.

**Characteristics:**

-   Implement `ControlValueAccessor` interface
-   Work directly with `formControlName` directive
-   Can be used anywhere in the application (not just dynamic forms)
-   Handle value changes, validation state, disabled state
-   Wrap Spryker UI components

**Location:** `app/core/dynamic-forms/reactive-controls/`

**Examples:**

-   `InputComponent` - Text input wrapper
-   `SelectComponent` - Dropdown select wrapper
-   `CheckboxComponent` - Checkbox wrapper
-   `DatePickerComponent` - Date picker wrapper
-   `ToggleComponent` - Toggle switch wrapper
-   `RadioComponent` - Radio group wrapper

**Usage:**

```html
<fl-input [formControlName]="'email'" [type]="'email'" [placeholder]="'Enter email'"> </fl-input>
```

### 2. Dynamic Controls

**Purpose:** High-level wrappers for reactive controls that work with YAML configuration.

**Characteristics:**

-   Extend `BaseDynamicControl` class
-   Use reactive controls internally
-   Read configuration from YAML
-   Handle labels, validation errors, layout
-   Automatic registration in forms
-   Conditional visibility support

**Location:** `app/core/dynamic-forms/dynamic-controls/`

**Examples:**

-   `DynamicInputComponent` - Uses `InputComponent`
-   `DynamicSelectComponent` - Uses `SelectComponent`
-   `DynamicCheckboxComponent` - Uses `CheckboxComponent`
-   `DynamicDatePickerComponent` - Uses `DatePickerComponent`
-   `DynamicToggleComponent` - Uses `ToggleComponent`
-   `DynamicRadioComponent` - Uses `RadioComponent`

**Usage in YAML:**

```yaml
config:
    - name: 'email'
      controlType: 'input'
      type: 'email'
      label: 'Email Address'
      validators:
          required: true
          email: true
```

---

## Architecture Diagram

```
YAML Configuration
       ↓
Dynamic Control (wrapper with label, errors, validation)
       ↓
Reactive Control (ControlValueAccessor)
       ↓
Spryker UI Component (spy-input, spy-select, etc.)
```

---

## Creating a New Control

Follow these steps to add a new form control type.

### Step 1: Create Reactive Control

Create a component that implements `ControlValueAccessor`.

**File:** `app/core/dynamic-forms/reactive-controls/date-picker/date-picker.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DatePickerModule } from '@spryker/date-picker';
import { provideValueAccessor } from '../accessor';

@Component({
    selector: 'fl-date-picker',
    standalone: true,
    imports: [DatePickerModule],
    template: `
        <spy-date-picker
            [value]="value"
            (valueChange)="valueChange($event)"
            [name]="name"
            [spyId]="id"
            [placeholder]="placeholder"
            [format]="format"
            [disabled]="disabled"
        ></spy-date-picker>
    `, // or separate html file
    providers: [provideValueAccessor(DatePickerComponent)],
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input() id?: string;
    @Input() name?: string;
    @Input() placeholder: string = 'Select date';
    @Input() format: string = 'dd/MM/yyyy';

    value?: Date;
    disabled = false;

    private onChange = (value: Date) => {};
    private onTouched = () => {};

    writeValue(obj: Date): void {
        this.value = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    valueChange(value: Date): void {
        this.onChange(value);
    }

    blur(): void {
        this.onTouched();
    }
}
```

**Key points:**

-   Use `provideValueAccessor()` helper for `NG_VALUE_ACCESSOR` provider
-   Implement all 4 `ControlValueAccessor` methods
-   Add `@Input()` properties for configuration
-   Use `onChange` and `onTouched` callbacks
-   Handle `disabled` state

### Step 2: Create Dynamic Control

Create a wrapper component that extends `BaseDynamicControl`.

**File:** `app/core/dynamic-forms/dynamic-controls/dynamic-date-picker.component.ts`

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
            <fl-date-picker
                [id]="control.controlKey"
                [formControlName]="control.controlKey"
                [placeholder]="control.config.placeholder"
                [format]="control.config.format || 'dd/MM/yyyy'"
                control
            ></fl-date-picker>
        </spy-form-item>
    `, // or separate html file
})
export class DynamicDatePickerComponent extends BaseDynamicControl {}
```

**Key points:**

-   Extend `BaseDynamicControl` for automatic form integration
-   Import `sharedDynamicControlDeps` for common dependencies
-   Use `dynamicControlProvider` for proper form hierarchy
-   Wrap reactive control in `spy-form-item` for label and errors
-   Use `control.config` to access YAML configuration
-   Use `errorText` from base class for validation errors

### Step 3: Register Control

Register the dynamic control so it can be used in YAML.

**File:** `src/SprykerFeature/YourFeature/Application/zed.entry.ts`

```typescript
import { registerDynamicFormControls } from 'src/SprykerFeature/FalconUi/.../dynamic-forms';

export const providers = [
    registerDynamicFormControls({
        'date-picker': () =>
            import('./dynamic-controls/dynamic-date-picker.component').then((m) => m.DynamicDatePickerComponent),
    }),
];
```

For detailed information on registration, see [Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md).

### Step 4: Use in YAML

Now you can use the control in your YAML configuration:

```yaml
config:
    - name: 'birthDate'
      controlType: 'date-picker'
      label: 'Date of Birth'
      placeholder: 'Select your birth date'
      format: 'dd/MM/yyyy'
      value: null
      validators:
          required: true
```

---

## Troubleshooting

### Control not working in forms

**Problem:** Reactive control doesn't update form value

**Solution:** Ensure you're calling `onChange(value)` callback when value changes

```typescript
valueChange(value: string): void {
    this.onChange(value); // ← Don't forget this!
}
```

### Validation not showing

**Problem:** Errors don't display

**Solution:** Use `spy-form-item` with `[error]="errorText"` in dynamic control template

### Control not found

**Problem:** `controlType: 'my-control'` doesn't work in YAML

**Solution:** Check registration in `zed.entry.ts` - name must match exactly
