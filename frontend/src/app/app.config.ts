import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

// Dates en français dans toute l'application (« 6 nov. 2026 »)
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Ancre #fonctionnalites de la page d'accueil, et retour en haut à chaque page
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
  ],
};
