import { ApplicationConfig, provideExperimentalCheckNoChangesForDebug, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // eslint-disable-next-line no-magic-numbers
    provideExperimentalCheckNoChangesForDebug({ interval: 10 }),
    provideRouter(routes)
  ]
};
