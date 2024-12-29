import { createActionGroup, props } from '@ngrx/store';
import { Settings } from '@omegajump-shared/models';

export const settingsActions = createActionGroup({
  source: 'Settings',
  events: {
    saveSettings: props<{ settings: Settings }>()
  }
});
