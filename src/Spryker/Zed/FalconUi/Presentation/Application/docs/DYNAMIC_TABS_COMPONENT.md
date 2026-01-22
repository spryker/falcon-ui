# DynamicTabsComponent

`DynamicTabsComponent` enables tab-based layouts in Component Builder configurations. It solves Angular's `@ContentChildren` limitation by rendering tabs from configuration in a static template.

---

## Inputs

-   **`tab`** (number, default: `0`) - Active tab index (0-based)
-   **`mode`** (`'line' | 'card'`, default: `'line'`) - Visual style of tabs
-   **`animateSlides`** (boolean, default: `false`) - Enable slide animation
-   **`tabs`** (array, required) - Array of tab configurations

### Tab Configuration

Each tab in the `tabs` array has:

-   **`spyTitle`** (string, required) - Tab display title
-   **`disabled`** (boolean, optional) - Disable the tab
-   **`hasWarning`** (boolean, optional) - Show warning indicator
-   **`iconName`** (string, optional) - Icon to display in tab header
-   **`slots`** (array, required) - Components or content to render inside tab

---

## Example

```yaml
component: DynamicTabsComponent
inputs:
    tab: 0
    mode: 'line'
    tabs:
        - spyTitle: 'General'
          iconName: 'user'
          slots:
              - component: DynamicFormComponent
                inputs:
                    fields:
                        - name: 'firstName'
                          type: 'text'
                        - name: 'lastName'
                          type: 'text'

        - spyTitle: 'Orders'
          iconName: 'shopping-cart'
          slots:
              - component: TableComponent
                inputs:
                    dataSource:
                        url: '/api/orders'

        - spyTitle: 'Notes'
          hasWarning: true
          slots:
              - content: 'Customer notes and comments'
              - component: TextareaComponent
                inputs:
                    placeholder: 'Add notes...'
```

This creates a tabbed interface with:

-   Three tabs: General, Orders, and Notes
-   General tab with a form
-   Orders tab with a table
-   Notes tab with plain text and textarea (with warning indicator)
