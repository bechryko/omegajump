import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { OJButtonComponent } from '@omegajump-shared/components';
import { Path } from '@omegajump-shared/enums';

@Component({
  selector: 'oj-main-menu',
  imports: [TranslocoPipe, OJButtonComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent {
  private readonly router = inject(Router);

  public navigateToPlay(): void {
    this.router.navigateByUrl(Path.PLAY_MENU);
  }

  public navigateToSettings(): void {
    this.router.navigateByUrl(Path.SETTINGS);
  }

  public navigateToOmegapedia(): void {
    this.router.navigateByUrl(Path.OMEGAPEDIA);
  }
}
