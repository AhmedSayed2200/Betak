import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorsInterceptor } from './core/interceptors/errors-interceptor';
import { NgxSpinnerModule } from"ngx-spinner";
import { loadingInterceptor } from './loading-interceptor';
import { headersInterceptor } from './core/interceptors/headers-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top",anchorScrolling:"enabled"})
    ,withViewTransitions())   , provideClientHydration(withEventReplay())
    ,provideHttpClient(withFetch(),withInterceptors([loadingInterceptor,errorsInterceptor,headersInterceptor])),provideToastr(),
    importProvidersFrom(NgxSpinnerModule)
  ]
};
