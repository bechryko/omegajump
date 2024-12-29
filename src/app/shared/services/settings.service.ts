import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Settings } from '@omegajump-shared/models';
import { selectSettings, settingsActions } from '@omegajump-shared/store';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly store = inject(Store);

  public readonly settings$ = this.store.select(selectSettings);

  public saveSettings(settings: Settings): void {
    this.store.dispatch(settingsActions.saveSettings({ settings }));
  }
}
