# Slots and Slot Ordering in Dynamic Layout

## What are Slots?

Slots are named containers within a component where child components can be inserted. They allow you to nest components in a structured way within your YAML configuration.

## Basic Slot Usage

In YAML, you define slots as an array of child component configurations, each specifying which slot they belong to:

```yaml
component: ParentComponent
slots:
    - slot: 'header'
      component: TitleComponent
      inputs:
          text: 'Page Title'
    - slot: 'content'
      component: TableComponent
    - component: ButtonComponent # No slot name = unnamed/default slot
```

### Named vs Unnamed Slots

-   **Named slots**: Specify `slot: 'name'` in YAML, rendered in order defined by `@WithSlots`
-   **Unnamed slots**: Omit the `slot` property in YAML, rendered **last** after all named slots

**Important**: `<ng-content>` without a `select` attribute captures all unnamed slot content and is always rendered last, regardless of its position in the template or `@WithSlots` array.

## Why Slot Order Matters

**Critical:** The order in which slots are rendered depends on the order defined in the parent component, **not** the order in your YAML configuration.

### The Problem

Without proper slot ordering, the system cannot determine which slot should appear first. This can lead to:

-   **Unpredictable rendering**: Slots may appear in a random order
-   **Layout issues**: Components might appear in unexpected positions
-   **Inconsistent behavior**: Different browsers or environments might render slots differently

### Example of the Problem

Given this YAML configuration:

```yaml
component: DashboardLayout
slots:
    - slot: 'sidebar'
      component: NavigationMenu
    - slot: 'main'
      component: ContentPanel
    - slot: 'header'
      component: PageHeader
```

**Without slot ordering**, the system doesn't know whether to render `header`, `main`, or `sidebar` first. You might see:

-   Navigation appearing above the header
-   Content rendering before the sidebar
-   Inconsistent layouts across page loads

## Solution: The `@WithSlots` Decorator

To ensure predictable slot ordering, use the `@WithSlots` decorator in your component definition.

### How to Use `@WithSlots`

Add the decorator to your component class, specifying the exact order of slots:

```typescript
import { Component } from '@angular/core';
import { WithSlots } from '@core/component-builder/component-builder';

@Component({
    selector: 'app-dashboard-layout',
    template: `
        <div class="layout">
            <header>
                <ng-content select="[header]"></ng-content>
            </header>
            <div class="body">
                <aside>
                    <ng-content select="[sidebar]"></ng-content>
                </aside>
                <main>
                    <ng-content select="[main]"></ng-content>
                </main>
            </div>
            <footer>
                <!-- Unnamed slot - always renders last -->
                <ng-content></ng-content>
            </footer>
        </div>
    `,
})
@WithSlots(['header', 'sidebar', 'main'])
export class DashboardLayoutComponent {}
```

### What This Does

1. **Defines Order**: The array `['header', 'sidebar', 'main']` explicitly declares the rendering order for named slots
2. **Ensures Consistency**: Named slots will **always** render in this order, regardless of YAML configuration order
3. **Prevents Errors**: The system knows exactly how to process and render your slots
4. **Unnamed Slot Last**: Any component without a `slot` property in YAML will be rendered in the unnamed slot (`<ng-content></ng-content>`) after all named slots

### How It Works

The `@WithSlots` decorator:

-   Adds a provider to your component with the `SLOT_ORDER` injection token
-   The Dynamic Layout Service reads this order when building the component
-   Child components are grouped by slot name and rendered in the specified order

## Best Practices

### 1. Always Use `@WithSlots` for Slotted Components

If your component accepts slots, **always** define their order with `@WithSlots`:

```typescript
// Good - Order is explicit
@WithSlots(['icon', 'label', 'badge'])
@Component({ ... })
export class ButtonComponent {}

// Bad - Order is undefined
@Component({ ... })
export class ButtonComponent {}
```

### 2. Match Template Structure

The slot order should match your template's visual/logical structure:

```typescript
@Component({
    template: `
        <ng-content select="[top]"></ng-content>
        <ng-content select="[middle]"></ng-content>
        <ng-content select="[bottom]"></ng-content>
    `,
})
@WithSlots(['top', 'middle', 'bottom'])
export class StackComponent {}
```

### 3. Use Semantic Slot Names

Choose descriptive names that indicate the slot's purpose:

```typescript
// Good - Clear purpose
@WithSlots(['title', 'description', 'actions'])

// Bad - Generic/unclear
@WithSlots(['slot1', 'slot2', 'slot3'])
```

### 4. Unnamed Slot for Default Content

Use `<ng-content></ng-content>` (without `select`) for optional/default content that should appear last:

```typescript
@Component({
    template: `
        <div class="card">
            <div class="card__header">
                <ng-content select="[title]"></ng-content>
            </div>
            <div class="card__body">
                <!-- Default/unnamed content goes here, always rendered last -->
                <ng-content></ng-content>
            </div>
        </div>
    `,
})
@WithSlots(['title']) // Only named slots in the array
export class CardComponent {}
```

**YAML usage:**

```yaml
component: CardComponent
slots:
    - slot: 'title'
      component: HeadlineComponent
    - component: ParagraphComponent # No slot property = unnamed slot
      inputs:
          text: 'This will render in the unnamed slot'
```

## Troubleshooting

### Problem: Slots Rendering in Wrong Order

**Cause**: Component missing `@WithSlots` decorator or decorator has incorrect order.

**Solution**: Add or fix the `@WithSlots` decorator on your component class.

### Problem: Slot Content Not Appearing

**Cause**: Slot name in YAML doesn't match slot name in component template.

**Solution**: Verify that `slot: 'name'` in YAML matches `select="[name]"` in template.

### Problem: Content Appearing in Wrong Position

**Cause**: Component doesn't have `slot` property in YAML, so it's being rendered in the unnamed slot (last position).

**Solution**: Add `slot: 'slotName'` to the component configuration in YAML to place it in a specific named slot.

### Problem: TypeScript Error When Using `@WithSlots`

**Cause**: Decorator not imported.

**Solution**:

```typescript
import { WithSlots } from '@core/component-builder/component-builder';
```
