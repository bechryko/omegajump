import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GameObject } from '@omegajump-core/control';
import { DrawingController } from '@omegajump-core/drawing';
import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';
import { LocationDescription } from '@omegajump-menu/location-selection-menu/location-descriptions';
import { GetTemplateStylesPipe } from './pipes';
import { GameControllerService } from './services';

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
  public readonly locationDescription = signal<LocationDescription | null>(null);
  public gameObject?: GameObject;

  constructor() {
    effect(() => {
      if (this.gameObject) {
        return;
      }

      const canvas = this.canvasRef().nativeElement;
      const locationDescription = this.gameControllerService.useLocationDescription();
      const drawingController = new DrawingController(canvas, locationDescription.style.backgroundColor);
      this.gameObject = new GameObject(drawingController, this.gameControllerService.useGameConfig());
      this.locationDescription.set(locationDescription);
    });
  }

  public get aspectRatio(): string {
    return `${MetricsUtils.GAME_WIDTH_IN_OJ_UNITS} / ${MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS}`;
  }
}
