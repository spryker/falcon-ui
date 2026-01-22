import { NgModule } from '@angular/core';
import { LocaleModule } from '@spryker/locale';
import { DeLocaleModule } from '@spryker/locale/locales/de';
import { EnLocaleModule, EN_LOCALE } from '@spryker/locale/locales/en';
import { ModalModule } from '@spryker/modal';
import { NotificationModule } from '@spryker/notification';
import { PersistenceModule } from '@spryker/persistence';
import { DefaultContextSerializationModule } from '@spryker/utils';
import { DateFnsDateAdapterModule } from '@spryker/utils.date.adapter.date-fns';
import { AjaxActionModule } from '@spryker/ajax-action';
import { DefaultTableModule } from './table.module';
import { DefaultDatasourcesModule } from './datasource.module';
import { DefaultActionsModule } from './actions.module';

@NgModule({
    imports: [
        LocaleModule.forRoot({ defaultLocale: EN_LOCALE }),
        EnLocaleModule,
        DeLocaleModule,
        NotificationModule.forRoot(),
        AjaxActionModule,
        DefaultContextSerializationModule,
        DefaultActionsModule,
        ModalModule.forRoot(),
        DateFnsDateAdapterModule,
        DefaultDatasourcesModule,
        PersistenceModule,
        DefaultTableModule,
    ],
})
export class MerchantPortalModule {}
