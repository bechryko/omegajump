import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideExperimentalCheckNoChangesForDebug,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { Language } from '@omegajump-shared/enums';
import { appReducer, AppState } from '@omegajump-shared/store';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideExperimentalCheckNoChangesForDebug({ interval: 10 }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: Object.values(Language),
        defaultLang: Language.EN,
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    }),
    provideStore<AppState>(appReducer),
    provideEffects()
  ]
};
