import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameControllerService } from '@omegajump-game';
import { Path } from '@omegajump-shared/enums';

export const gameSetupGuard: CanActivateFn = () => {
  const gameControllerService = inject(GameControllerService);
  const router = inject(Router);

  if (!gameControllerService.isGameStarted() || !gameControllerService.isGameConfigSet()) {
    router.navigateByUrl(Path.PLAY_MENU);
    return false;
  }
  return true;
};
