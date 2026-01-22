# Dynamic Forms

_Last updated: November 12, 2025_

With the Dynamic Forms system, you can create forms from configuration instead of writing Angular components. This enables rapid development of data entry interfaces with built-in validation and error handling.

## Prerequisites

-   Angular 18+ application
-   Dynamic Forms system configured
-   Registered form control types in `app-components.provider.ts`

---

## What is Dynamic Forms?

Dynamic Forms is a configuration-driven form builder that:

-   Renders form fields automatically from configuration
-   Applies validation rules from config
-   Supports nested field groups
-   Handles conditional field display
-   Provides server-side error integration

## How it works

1. Define form configuration in YAML or pass via component inputs
2. System renders form fields using registered control types
3. Validation rules are applied automatically
4. Form data is submitted via `formSubmit` event
5. Server errors can be set programmatically via `setErrors()` method

---

## Form configuration interface

The configuration for dynamic forms follows this TypeScript interface:

```typescript
interface DynamicControl {
    name: string; // Required: field identifier (used as form control name)
    controlType: 'input' | 'select' | 'checkbox' | 'datepicker' | 'toggle' | 'radio'; // Required: field type
    type?: string; // Optional: input type for 'input' controls
    label: string; // Required: field label
    value: any; // Optional: default value
    order?: number; // Optional: display order (lower first)
    options?:
        | Array<{
              // Optional: for select/radio controls
              label: string;
              value: string;
          }>
        | string[]; // Can be array of objects or simple strings
    controls?: DynamicControl[]; // Optional: nested controls (for 'group')
    validators?: {
        // Optional: validation rules
        required?: true;
        email?: true;
        requiredTrue?: true;
        minLength?: number;
        maxLength?: number;
    };
    layout?: {
        // Optional: layout wrapper
        template: 'card';
        title?: string;
    };
    activationConfig?: {
        // Optional: conditional rendering
        controlPath: string;
        hasValue: any;
    };
}
```

---

## Available control types

Currently registered control types:

| Control Type | Description            | Supports                                        |
| ------------ | ---------------------- | ----------------------------------------------- |
| `input`      | Single-line text input | text, email, password, number, tel, url, hidden |
| `select`     | Dropdown selection     | Requires `options` array                        |
| `checkbox`   | Checkbox input         | Boolean values                                  |
| `datepicker` | Date picker            | Date selection with custom format               |
| `toggle`     | Toggle switch          | Boolean values (on/off)                         |
| `radio`      | Radio button group     | Requires `options` array (string[])             |

---

## Validation rules

### Available validators

The following validators are available out of the box:

```yaml
validators:
    required: true # Field is required
    email: true # Must be valid email
    requiredTrue: true # Must be checked (for checkboxes)
    minLength: 5 # Minimum character length
    maxLength: 100 # Maximum character length
```

### Error messages

Error messages are configured globally in `app-components.provider.ts`:

```typescript
registerValidationErrorMessages({
    required: () => `This field is required`,
    requiredTrue: () => `This field is required`,
    email: () => `It should be a valid email`,
    minlength: ({ requiredLength }) => `The length should be at least ${requiredLength} characters.`,
    maxlength: ({ requiredLength }) => `The length should be at most ${requiredLength} characters.`,
});
```

---

## 1. Create a simple form

The simplest way to use Dynamic Forms is with basic input fields.

**File:** `src/SprykerFeature/MyFeature/resources/entity/contact.yml`

```yaml
view:
    components:
        form.customer.edit:
            component: DynamicFormComponent
            inputs:
                config:
                    - name: 'firstName'
                      controlType: 'input'
                      type: 'text'
                      label: 'First Name'
                      value: ''
                      validators:
                          required: true

                    - name: 'lastName'
                      controlType: 'input'
                      type: 'text'
                      label: 'Last Name'
                      value: ''
                      validators:
                          required: true

                    - name: 'email'
                      controlType: 'input'
                      type: 'email'
                      label: 'Email'
                      value: ''
                      validators:
                          required: true
                          email: true
```

---

## 2. Add select and checkbox fields

To add dropdowns and checkboxes, use `select` and `checkbox` control types.

```yaml
config:
    - name: 'country'
      controlType: 'select'
      label: 'Country'
      value: ''
      validators:
          required: true
      options:
          - value: 'us'
            label: 'United States'
          - value: 'uk'
            label: 'United Kingdom'
          - value: 'de'
            label: 'Germany'

    - name: 'subscribe'
      controlType: 'checkbox'
      label: 'Subscribe to newsletter'
      value: false
```

---

## 5. Wrap fields in card layout

Use the `layout` property to wrap fields in a card component.

```yaml
config:
    - name: 'email'
      controlType: 'input'
      type: 'email'
      label: 'Email Address'
      value: ''
      layout:
          template: 'card'
          title: 'Login Credentials'
      validators:
          required: true
          email: true
```

---

## 6. Add conditional fields

Fields can appear conditionally based on other field values using `activationConfig`.

```yaml
config:
    - name: 'hasCompany'
      controlType: 'checkbox'
      label: 'I represent a company'
      value: false

    - name: 'companyName'
      controlType: 'input'
      type: 'text'
      label: 'Company Name'
      value: ''
      activationConfig:
          controlPath: 'hasCompany'
          hasValue: true
      validators:
          required: true
```

**Result:** The `companyName` field only appears when `hasCompany` is checked.

---

## 7. Control field order

Use the `order` property to specify the display order of fields.

```yaml
config:
    - name: 'lastName'
      controlType: 'input'
      label: 'Last Name'
      value: ''
      order: 2

    - name: 'firstName'
      controlType: 'input'
      label: 'First Name'
      value: ''
      order: 1
```

**Result:** Fields are sorted by `order` value (lower numbers appear first).

---

## For Developers: Registering Custom Controls

To extend Dynamic Forms with new control types, layouts, or validators, register them in your module's `zed.entry.ts` file.

For detailed information on creating custom form controls (reactive and dynamic architecture), see [Form Controls Guide](./FORM_CONTROLS.md).

For registration process and best practices, see [Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md).

For module-level registration setup, see [Module Registration Guide](./MODULE_REGISTRATION.md).

**Quick example:**

```typescript
// src/SprykerFeature/YourFeature/src/SprykerFeature/Zed/YourFeature/Application/zed.entry.ts
import { registerDynamicFormControls } from 'src/SprykerFeature/FalconUi/src/SprykerFeature/Zed/FalconUi/Presentation/Application/app/core/dynamic-forms/dynamic-forms';

export const providers = [
    registerDynamicFormControls({
        'phone-input': () => import('./controls/phone-input.component').then((c) => c.PhoneInputComponent),
    }),
];
```

**Result:** Use control in YAML:

```yaml
config:
    - name: 'phone'
      controlType: 'phone-input'
      label: 'Phone Number'
```
