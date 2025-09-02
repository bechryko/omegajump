import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GameConfig } from '@omegajump-core/configuration';
import { GameObject } from '@omegajump-core/control';
import { DrawingController } from '@omegajump-core/drawing';
import { PowerCell } from '@omegajump-core/entities/power-cells';
import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';
import { LocationDescription } from '@omegajump-menu/location-selection-menu/location-descriptions';
import { GetTemplateStylesPipe } from './pipes';
import { GameControllerService } from './services';
import { UiDataUtils } from './utils';

@Component({
  selector: 'oj-game',
  imports: [TranslocoPipe, NgStyle, GetTemplateStylesPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private readonly gameControllerService = inject(GameControllerService);

  public readonly imagesPreloadSuccess = input.required<boolean>();
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('gameCanvas');
  public readonly score = computed(() => Math.floor(CameraUtils.ySignal()));
  private readonly starts = signal(0);
  public readonly players = UiDataUtils.exportedPlayers;
  private gameObject?: GameObject;
  private fixGameSeed?: string;
  private readonly gameConfig: GameConfig;
  public readonly locationDescription: LocationDescription;

  constructor() {
    this.gameConfig = this.gameControllerService.useGameConfig();
    this.locationDescription = this.gameControllerService.useLocationDescription();

    effect(() => {
      if (this.gameObject) {
        return;
      }

      this.starts();
      const canvas = this.canvasRef().nativeElement;
      const drawingController = new DrawingController(canvas, this.locationDescription.style.backgroundColor);
      const gameConfig = this.setGameSeed({ ...this.gameConfig });
      this.gameObject = new GameObject(drawingController, gameConfig);

      const subscription = this.gameObject!.restart.subscribe(restartWithSameSeed => {
        subscription.unsubscribe();
        this.restart(restartWithSameSeed ? gameConfig.seed : undefined);
      });
    });
  }

  public get aspectRatio(): string {
    return `${MetricsUtils.GAME_WIDTH_IN_OJ_UNITS} / ${MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS}`;
  }

  public getPowerCellComboDurationWidth(expires: number): string {
    return `${(80 / PowerCell.POWER_CELL_COMBO_DURATION) * expires}%`;
  }

  private setGameSeed(gameConfig: GameConfig): GameConfig {
    if (!gameConfig.seed) {
      gameConfig.seed = this.fixGameSeed ?? String(Math.random());
    }
    return gameConfig;
  }

  private restart(seed?: string): void {
    this.gameObject = undefined;
    this.fixGameSeed = seed;
    this.starts.update(starts => starts + 1);
  }
}
