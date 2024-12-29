import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { GameObject } from './control';
import { DrawingController } from './drawing';
import { GameControllerService } from './game-controller.service';

@Component({
  selector: 'oj-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private readonly gameControllerService = inject(GameControllerService);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('gameCanvas');
  public gameObject?: GameObject;

  constructor() {
    effect(() => {
      if (this.gameObject) {
        return;
      }
      const canvas = this.canvasRef().nativeElement;
      const drawingController = new DrawingController(canvas);
      this.gameObject = new GameObject(drawingController, this.gameControllerService.useGameConfig());
    });
  }
}
