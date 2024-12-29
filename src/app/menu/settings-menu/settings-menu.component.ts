import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { OJButtonComponent, OJOptionComponent, OJSelectComponent } from '@omegajump-shared/components';
import { Path } from '@omegajump-shared/enums';
import { Settings } from '@omegajump-shared/models';
import { SettingsService } from '@omegajump-shared/services';
import { deepLink, deepValue } from '@omegajump-utilities/signals';
import { initialSettings } from './initial-settings';

@Component({
  selector: 'oj-settings-menu',
  imports: [TranslocoPipe, OJButtonComponent, OJSelectComponent, OJOptionComponent],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsMenuComponent {
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);

  public readonly settings = deepLink(toSignal(this.settingsService.settings$, { initialValue: initialSettings }));

  public saveSettings(): void {
    const settings = deepValue<Settings>(this.settings);
    this.settingsService.saveSettings(settings);
  }

  public navigateToMainMenu(): void {
    this.router.navigateByUrl(Path.MAIN_MENU);
  }
}
