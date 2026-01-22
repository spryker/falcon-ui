/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgModule } from '@angular/core';
import { AjaxFormComponent, AjaxFormModule } from '@spryker/ajax-form';
import { ActionsModule } from '@spryker/actions';
import { CloseDrawerActionHandlerModule, CloseDrawerActionHandlerService } from '@spryker/actions.close-drawer';
import { ConfirmationActionHandlerModule, ConfirmationActionHandlerService } from '@spryker/actions.confirmation';
import { DrawerActionHandlerService, DrawerActionModule } from '@spryker/actions.drawer';
import { HttpActionHandlerModule, HttpActionHandlerService } from '@spryker/actions.http';
import { NotificationActionHandlerModule, NotificationActionHandlerService } from '@spryker/actions.notification';
import { RedirectActionHandlerModule, RedirectActionHandlerService } from '@spryker/actions.redirect';
import { RefreshDrawerActionHandlerModule, RefreshDrawerActionHandlerService } from '@spryker/actions.refresh-drawer';
import {
    RefreshParentTableActionHandlerModule,
    RefreshParentTableActionHandlerService,
} from '@spryker/actions.refresh-parent-table';
import { RefreshTableActionHandlerModule, RefreshTableActionHandlerService } from '@spryker/actions.refresh-table';
import { ContextReplacerDrawerActionHandlerService } from '../ui-lib-internal-extends/drawer-service';
import { ComponentBuilderComponent } from '../core/component-builder/component-builder.component';

declare module '@spryker/actions' {
    interface ActionsRegistry {
        'close-drawer': CloseDrawerActionHandlerService;
        confirmation: ConfirmationActionHandlerService;
        drawer: DrawerActionHandlerService;
        http: HttpActionHandlerService;
        notification: NotificationActionHandlerService;
        redirect: RedirectActionHandlerService;
        'refresh-drawer': RefreshDrawerActionHandlerService;
        'refresh-parent-table': RefreshParentTableActionHandlerService;
        'refresh-table': RefreshTableActionHandlerService;
    }
}

declare module '@spryker/actions.drawer' {
    interface DrawerActionComponentsRegistry {
        'ajax-form': AjaxFormComponent;
        'component-builder': ComponentBuilderComponent;
    }
}

@NgModule({
    imports: [
        ActionsModule.withActions({
            'close-drawer': CloseDrawerActionHandlerService,
            confirmation: ConfirmationActionHandlerService,
            drawer: ContextReplacerDrawerActionHandlerService,
            http: HttpActionHandlerService,
            notification: NotificationActionHandlerService,
            redirect: RedirectActionHandlerService,
            'refresh-drawer': RefreshDrawerActionHandlerService,
            'refresh-parent-table': RefreshParentTableActionHandlerService,
            'refresh-table': RefreshTableActionHandlerService,
        } as any),
        DrawerActionModule.withComponents({
            'ajax-form': AjaxFormComponent,
            'component-builder': ComponentBuilderComponent,
        } as any),
        CloseDrawerActionHandlerModule,
        ConfirmationActionHandlerModule,
        HttpActionHandlerModule,
        NotificationActionHandlerModule,
        RedirectActionHandlerModule,
        RefreshDrawerActionHandlerModule,
        RefreshParentTableActionHandlerModule,
        RefreshTableActionHandlerModule,
        AjaxFormModule,
    ],
})
export class DefaultActionsModule {}
