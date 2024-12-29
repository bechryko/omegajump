import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Path } from '@omegajump-shared/enums';
import { GameConfig } from './control';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService {
  private readonly router = inject(Router);

  private readonly _isStarted = signal(false);
  private gameConfig?: GameConfig;

  public setGameConfig(config: GameConfig): void {
    this.gameConfig = config;
  }

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

  public startGame(): void {
    this.setGameConfig({});
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
