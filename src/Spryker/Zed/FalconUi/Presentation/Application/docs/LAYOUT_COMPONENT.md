# LayoutComponent

`LayoutComponent` is a page layout wrapper that provides consistent structure for admin pages with title, breadcrumbs, actions, and content areas.

---

## Inputs

LayoutComponent doesn't have `@Input()` properties. It receives data automatically from Angular route:

-   **`data.title`** - Page title (displayed as h1)
-   **`data.breadcrumbs`** - Navigation breadcrumbs array

---

## Slots (Projected Content)

LayoutComponent uses Angular `<ng-content>` for content projection:

### Named Slots

-   **`actions`** - Action buttons area in the header (top-right corner)

### Default Slot

-   **Default** (unnamed) - Main page content area

---

## Example

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
                actions:
                    - component: ButtonActionComponent
                      inputs:
                          text: 'Export'
                          variant: 'outline'
                    - component: ButtonActionComponent
                      inputs:
                          text: 'Create Customer'
                          type: 'primary'
                content:
                    - component: TableComponent
                      inputs:
                          config:
                              dataSource:
                                  type: 'http'
                                  url: '/api/customers'
                              columns:
                                  - { id: 'email', title: 'Email' }
                                  - { id: 'firstName', title: 'First Name' }
                                  - { id: 'lastName', title: 'Last Name' }
```

This creates a page with:

-   Title "Customers" from route data
-   Two action buttons in the header (Export and Create Customer) in the `actions` slot
-   Table component as main content in the `content` slot
