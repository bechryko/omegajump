import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { GameControllerService } from '@omegajump-game';
import { OJButtonComponent } from '@omegajump-shared/components';
import { Path } from '@omegajump-shared/enums';

@Component({
  selector: 'oj-location-selection-menu',
  imports: [TranslocoPipe, OJButtonComponent],
  templateUrl: './location-selection-menu.component.html',
  styleUrl: './location-selection-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSelectionMenuComponent {
  private readonly router = inject(Router);
  private readonly gameControllerService = inject(GameControllerService);

  public startGame(): void {
    this.gameControllerService.startGame();
  }

  public navigateToPlayMenu(): void {
    this.router.navigateByUrl(Path.PLAY_MENU);
  }
}
