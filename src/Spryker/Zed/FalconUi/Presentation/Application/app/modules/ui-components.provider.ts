import { importProvidersFrom } from '@angular/core';
import { registerDynamicComponents } from '../core/component-builder/component-builder';
import { createMultiModuleBundle } from '../core/utils/module-resolver';
import { ButtonModule } from '@spryker/button';
import { ButtonActionModule } from '@spryker/button.action';
import { ButtonIconModule } from '@spryker/button.icon';
import { CardModule } from '@spryker/card';
import { CollapsibleModule } from '@spryker/collapsible';
import { InputModule } from '@spryker/input';
import { InputPasswordModule } from '@spryker/input.password';
import { TextareaModule } from '@spryker/textarea';
import { CheckboxModule } from '@spryker/checkbox';
import { RadioModule } from '@spryker/radio';
import { SelectModule } from '@spryker/select';
import { AutocompleteModule } from '@spryker/autocomplete';
import { DatePickerModule } from '@spryker/date-picker';
import { TreeSelectModule } from '@spryker/tree-select';
import { ToggleModule } from '@spryker/toggle';
import { FormItemModule } from '@spryker/form-item';
import { AjaxFormModule } from '@spryker/ajax-form';
import { TableModule } from '@spryker/table';
import { ModalModule } from '@spryker/modal';
import { DrawerModule } from '@spryker/drawer';
import { HeaderModule } from '@spryker/header';
import { NavigationModule } from '@spryker/navigation';
import { SidebarModule } from '@spryker/sidebar';
import { UserMenuModule } from '@spryker/user-menu';
import { IconModule } from '@spryker/icon';
import { LabelModule } from '@spryker/label';
import { ChipsModule } from '@spryker/chips';
import { TagModule } from '@spryker/tag';
import { HeadlineModule } from '@spryker/headline';
import { SpinnerModule } from '@spryker/spinner';
import { LogoModule } from '@spryker/logo';
import { PaginationModule } from '@spryker/pagination';
import { NotificationModule } from '@spryker/notification';
import { PopoverModule } from '@spryker/popover';
import { DropdownModule } from '@spryker/dropdown';

export const uiComponentsProviders = [
    importProvidersFrom(
        createMultiModuleBundle(
            [
                ButtonModule,
                ButtonActionModule,
                ButtonIconModule,
                CardModule,
                CollapsibleModule,
                InputModule,
                InputPasswordModule,
                TextareaModule,
                CheckboxModule,
                RadioModule,
                SelectModule,
                AutocompleteModule,
                DatePickerModule,
                TreeSelectModule,
                ToggleModule,
                FormItemModule,
                AjaxFormModule,
                TableModule,
                ModalModule,
                DrawerModule,
                HeaderModule,
                NavigationModule,
                SidebarModule,
                UserMenuModule,
                IconModule,
                LabelModule,
                ChipsModule,
                TagModule,
                HeadlineModule,
                SpinnerModule,
                LogoModule,
                PaginationModule,
                NotificationModule,
                PopoverModule,
                DropdownModule,
                TableModule,
            ],
            'UiComponentsBundle',
        ),
    ),
    registerDynamicComponents({
        // Button Components
        ButtonComponent: () => import('@spryker/button').then((m) => m.ButtonComponent),
        ButtonLinkComponent: () => import('@spryker/button').then((m) => m.ButtonLinkComponent),
        ButtonToggleComponent: () => import('@spryker/button').then((m) => m.ButtonToggleComponent),
        ButtonAjaxComponent: () => import('@spryker/button').then((m) => m.ButtonAjaxComponent),
        ButtonActionComponent: () => import('@spryker/button.action').then((m) => m.ButtonActionComponent),
        ButtonIconComponent: () => import('@spryker/button.icon').then((m) => m.ButtonIconComponent),

        // Card & Layout
        CardComponent: () => import('@spryker/card').then((m) => m.CardComponent),
        CollapsibleComponent: () => import('@spryker/collapsible').then((m) => m.CollapsibleComponent),

        // Form Components
        InputComponent: () => import('@spryker/input').then((m) => m.InputComponent),
        InputPasswordComponent: () => import('@spryker/input.password').then((m) => m.InputPasswordComponent),
        TextareaComponent: () => import('@spryker/textarea').then((m) => m.TextareaComponent),
        CheckboxComponent: () => import('@spryker/checkbox').then((m) => m.CheckboxComponent),
        RadioComponent: () => import('@spryker/radio').then((m) => m.RadioComponent),
        RadioGroupComponent: () => import('@spryker/radio').then((m) => m.RadioGroupComponent),
        SelectComponent: () => import('@spryker/select').then((m) => m.SelectComponent),
        AutocompleteComponent: () => import('@spryker/autocomplete').then((m) => m.AutocompleteComponent),
        DatePickerComponent: () => import('@spryker/date-picker').then((m) => m.DatePickerComponent),
        DateRangePickerComponent: () => import('@spryker/date-picker').then((m) => m.DateRangePickerComponent),
        TreeSelectComponent: () => import('@spryker/tree-select').then((m) => m.TreeSelectComponent),
        ToggleComponent: () => import('@spryker/toggle').then((m) => m.ToggleComponent),
        FormItemComponent: () => import('@spryker/form-item').then((m) => m.FormItemComponent),
        AjaxFormComponent: () => import('@spryker/ajax-form').then((m) => m.AjaxFormComponent),

        // Modal & Drawer
        ModalComponent: () => import('@spryker/modal').then((m) => m.ModalComponent),
        DrawerComponent: () => import('@spryker/drawer').then((m) => m.DrawerComponent),

        // Table
        TableComponent: () => import('@spryker/table').then((m) => m.CoreTableComponent),

        // Navigation & Header
        HeaderComponent: () => import('@spryker/header').then((m) => m.HeaderComponent),
        NavigationComponent: () => import('@spryker/navigation').then((m) => m.NavigationComponent),
        SidebarComponent: () => import('@spryker/sidebar').then((m) => m.SidebarComponent),
        UserMenuComponent: () => import('@spryker/user-menu').then((m) => m.UserMenuComponent),

        // UI Elements
        IconComponent: () => import('@spryker/icon').then((m) => m.IconComponent),
        LabelComponent: () => import('@spryker/label').then((m) => m.LabelComponent),
        ChipsComponent: () => import('@spryker/chips').then((m) => m.ChipsComponent),
        TagComponent: () => import('@spryker/tag').then((m) => m.TagComponent),
        HeadlineComponent: () => import('@spryker/headline').then((m) => m.HeadlineComponent),
        SpinnerComponent: () => import('@spryker/spinner').then((m) => m.SpinnerComponent),
        LogoComponent: () => import('@spryker/logo').then((m) => m.LogoComponent),

        // Pagination
        PaginationComponent: () => import('@spryker/pagination').then((m) => m.PaginationComponent),

        // Notification & Popover
        NotificationComponent: () => import('@spryker/notification').then((m) => m.NotificationComponent),
        PopoverComponent: () => import('@spryker/popover').then((m) => m.PopoverComponent),
        DropdownComponent: () => import('@spryker/dropdown').then((m) => m.DropdownComponent),
    }),
];
