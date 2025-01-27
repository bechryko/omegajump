import { Settings } from '@omegajump-shared/models';
import { AppState } from '../app.state';

export const selectSettings = (state: AppState): Settings => state.settings;
