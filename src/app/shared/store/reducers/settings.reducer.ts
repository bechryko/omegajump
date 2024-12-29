import { createReducer, on } from '@ngrx/store';
import { initialSettings } from '@omegajump-menu/settings-menu/initial-settings';
import { settingsActions } from '../actions';

export const settingsReducer = createReducer(
  { ...initialSettings },
  on(settingsActions.saveSettings, (_, { settings }) => settings)
);
