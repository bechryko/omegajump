import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { defaultSingleplayerConfig, GameConfig } from '@omegajump-core/configuration';
import { LocationDescription } from '@omegajump-menu/location-selection-menu/location-descriptions';
import { Path } from '@omegajump-shared/enums';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService {
  private readonly router = inject(Router);

  private readonly _isStarted = signal(false);
  private gameConfig?: GameConfig;
  private locationDescription?: LocationDescription;

  public isGameConfigSet(): boolean {
    return this.gameConfig !== undefined;
  }

  public useGameConfig(): GameConfig {
    if (!this.isGameConfigSet()) {
      throw new Error('Game config is not set');
    }

    const config = this.gameConfig!;
    delete this.gameConfig;
    return config;
  }

  public useLocationDescription(): LocationDescription {
    if (!this.locationDescription) {
      throw new Error('Location description is not set');
    }

    const locationDescription = this.locationDescription;
    delete this.locationDescription;
    return locationDescription;
  }

  public startGame(locationDescription: LocationDescription): void {
    this.gameConfig = {
      ...defaultSingleplayerConfig,
      ...locationDescription.config
    };
    this.locationDescription = locationDescription;
    this.router.navigateByUrl(Path.GAME);
    this._isStarted.set(true);
  }

  public finishGame(): void {
    this._isStarted.set(false);
  }

  public get isGameStarted(): Signal<boolean> {
    return this._isStarted.asReadonly();
  }
}
