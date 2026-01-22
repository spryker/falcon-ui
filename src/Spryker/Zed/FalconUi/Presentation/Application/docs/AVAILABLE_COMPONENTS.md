# Available Components

This document lists all components available for use in Dynamic Layout and Dynamic Forms YAML configurations.

## Prerequisites

-   Dynamic Layout system configured
-   Components registered in provider files

---

## Component Categories

### Button Components

-   `ButtonComponent` - Standard button
-   `ButtonLinkComponent` - Button styled as link
-   `ButtonToggleComponent` - Toggle button
-   `ButtonAjaxComponent` - Button with AJAX action
-   `ButtonActionComponent` - Button with configurable action
-   `ButtonIconComponent` - Icon button

### Layout & Container

-   `CardComponent` - Content card container
-   `CollapsibleComponent` - Collapsible content section

### Form Components

-   `InputComponent` - Text input field
-   `InputPasswordComponent` - Password input field
-   `TextareaComponent` - Multi-line text input
-   `CheckboxComponent` - Checkbox input
-   `RadioComponent` - Radio button input
-   `RadioGroupComponent` - Radio button group
-   `SelectComponent` - Dropdown select
-   `AutocompleteComponent` - Autocomplete input
-   `DatePickerComponent` - Date picker
-   `DateRangePickerComponent` - Date range picker
-   `TreeSelectComponent` - Tree-structured select
-   `ToggleComponent` - Toggle switch
-   `FormItemComponent` - Form field wrapper with label
-   `AjaxFormComponent` - Form with AJAX submission

### Table Components

-   `TableComponent` - Data table with features (sorting, filtering, pagination)

### Modal & Drawer

-   `ModalComponent` - Modal dialog
-   `DrawerComponent` - Side drawer panel

### Navigation & Header

-   `HeaderComponent` - Page header
-   `NavigationComponent` - Navigation menu
-   `SidebarComponent` - Sidebar navigation
-   `UserMenuComponent` - User menu dropdown

### UI Elements

-   `IconComponent` - Icon display
-   `LabelComponent` - Text label
-   `ChipsComponent` - Chip/tag collection
-   `TagComponent` - Single tag element
-   `HeadlineComponent` - Heading text
-   `SpinnerComponent` - Loading spinner
-   `LogoComponent` - Logo display

### Table & Pagination

-   `TableComponent` - Table component
-   `PaginationComponent` - Pagination controls

### Notifications & Overlays

-   `NotificationComponent` - Notification/toast message
-   `PopoverComponent` - Popover tooltip
-   `DropdownComponent` - Dropdown menu

### Application Components

-   `LayoutComponent` - Page layout wrapper with title, breadcrumbs, and action slots
-   `ComponentBuilderComponent` - Dynamically builds component trees from configuration
-   `DynamicFormComponent` - Dynamic form builder with validation and field types
-   `DynamicTabsComponent` - Tab container that renders tabs from configuration

---

## Component Registration

Components are registered in three locations:

1. **`ui-components.provider.ts`** - Spryker UI library components from npm packages
2. **`app-components.provider.ts`** - Application-level components
3. **`zed.entry.ts`** - Module-specific components

For detailed information on how to register custom components, overrides, and best practices, see [Extending and Overriding Guide](./EXTENDING_AND_OVERRIDING.md).

---

## Usage in YAML

Use any registered component by its exact class name:

```yaml
component: ButtonComponent
slots:
    -   content: 'Click Me'
type: 'primary'
```

```yaml
component: CardComponent
className: 'my-card'
slots:
    -   component: HeadlineComponent
        slots:
            -   content: 'Card Title'
    -   component: ButtonComponent
        slots:
            -   content: 'Action'
```
