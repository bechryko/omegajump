import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideExperimentalCheckNoChangesForDebug,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // eslint-disable-next-line no-magic-numbers
    provideExperimentalCheckNoChangesForDebug({ interval: 10 }),
    provideRouter(routes),
    provideHttpClient(),
    provideTransloco({
        config: {
            availableLangs: ['en'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: !isDevMode()
        },
        loader: TranslocoHttpLoader
    }),
    provideStore(),
    provideEffects()
]
};
