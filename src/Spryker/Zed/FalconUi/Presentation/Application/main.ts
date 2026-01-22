import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { acceptHeaderInterceptor } from './app/core/interceptors/accept-header.interceptor';
import { apiUrlInterceptor } from './app/core/interceptors/api-url.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { allZedModules } from './auto.zed.entries';
import { appInitProvider } from './app/core/services/app-init/app-init.model';
import { appComponentsProviders } from './app/modules/app-components.provider';
import { uiComponentsProviders } from './app/modules/ui-components.provider';
import { MerchantPortalModule } from './app/modules/mp.module';
import { tableInterceptor } from './app/ui-lib-internal-extends/table.interceptor';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                apiUrlInterceptor,
                acceptHeaderInterceptor,
                authInterceptor,
                errorInterceptor,
                tableInterceptor,
            ]),
        ),
        provideAnimations(),

        importProvidersFrom(MerchantPortalModule),

        appInitProvider,

        uiComponentsProviders,
        appComponentsProviders,

        ...allZedModules,
    ],
}).catch((err) => console.error('Falcon UI bootstrap error:', err));
