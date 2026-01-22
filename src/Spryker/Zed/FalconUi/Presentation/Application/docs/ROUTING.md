# Dynamic Routing

This guide explains how URLs are automatically generated from YAML configurations.

## Prerequisites

-   Understanding of [Component Builder](./COMPONENT_BUILDER_USER_GUIDE.md)

---

## How It Works

When you create a YAML configuration file, the system automatically generates URLs for your pages:

1. YAML file defines entity and views
2. System creates URLs based on naming pattern
3. Pages become accessible via generated URLs
4. Navigation menu shows links automatically

---

## URL Pattern

URLs follow a consistent pattern:

```
/{feature-name}/{entity-name}/{view-name}
```

### Name Conversion

All names are automatically converted to **kebab-case**:

| Your Name                    | URL Segment                    |
| ---------------------------- | ------------------------------ |
| `CustomerRelationManagement` | `customer-relation-management` |
| `Customer`                   | `customer`                     |
| `EditForm`                   | `edit-form`                    |

---

## View Types

Each **virtual route** in your YAML (after transformation) creates a specific URL. In the new DSL you define layouts and assign them to virtual routes via components.

### Root View

**YAML (new DSL):**

```yaml
entity: Customer

view:
    layout:
        use:
            - layout.customer.page

    components:
        layout.customer.page:
            id: 'page-layout'
            virtualRoute: 'root'
            component: LayoutComponent
```

**URL:**

```
/customer-relation-management/customer
```

### Edit View

**YAML (new DSL):**

```yaml
view:
    layout:
        use:
            - layout.customer.page
            - layout.customer.edit.page

    components:
        layout.customer.page:
            virtualRoute: 'root'
            component: LayoutComponent

        layout.customer.edit.page:
            virtualRoute: 'edit'
            component: DynamicFormComponent
```

**URLs (after transformation):**

```
/customer-relation-management/customer
/customer-relation-management/customer/edit
```

### Create View

**YAML (new DSL):**

```yaml
view:
    layout:
        use:
            - layout.customer.page
            - layout.customer.create.page

    components:
        layout.customer.page:
            virtualRoute: 'root'
            component: TableComponent

        layout.customer.create.page:
            virtualRoute: 'create'
            component: DynamicFormComponent
```

**URLs (after transformation):**

```
/customer-relation-management/customer
/customer-relation-management/customer/create
```
