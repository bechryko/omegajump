import { Routes } from '@angular/router';
import { Path } from '@omegajump-shared/enums';
import { gameSetupGuard } from './game';

export const routes: Routes = [
  {
    path: Path.MAIN_MENU,
    loadComponent: () => import('./menu/main-menu').then(m => m.MainMenuComponent)
  },
  {
    path: Path.PLAY_MENU,
    loadComponent: () => import('./menu/play-menu').then(m => m.PlayMenuComponent)
  },
  {
    path: Path.LOCATION_SELECTION_MENU,
    loadComponent: () => import('./menu/location-selection-menu').then(m => m.LocationSelectionMenuComponent)
  },
  {
    path: Path.SETTINGS,
    loadComponent: () => import('./menu/settings-menu').then(m => m.SettingsMenuComponent)
  },
  {
    path: Path.OMEGAPEDIA,
    loadComponent: () => import('./omegapedia/omegapedia.component').then(m => m.OmegapediaComponent)
  },
  {
    path: Path.GAME,
    loadComponent: () => import('./game').then(m => m.GameComponent),
    canActivate: [gameSetupGuard]
  },
  {
    path: '**',
    redirectTo: Path.MAIN_MENU
  }
];
