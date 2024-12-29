import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { OJButtonComponent } from '@omegajump-shared/components';
import { Path } from '@omegajump-shared/enums';

@Component({
  selector: 'oj-play-menu',
  imports: [TranslocoPipe, OJButtonComponent],
  templateUrl: './play-menu.component.html',
  styleUrl: './play-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayMenuComponent {
  public readonly router = inject(Router);

  public navigateToMainMenu(): void {
    this.router.navigateByUrl(Path.MAIN_MENU);
  }

  public selectLocation(): void {
    this.router.navigateByUrl(Path.LOCATION_SELECTION_MENU);
  }
}
