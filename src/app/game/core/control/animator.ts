import { DrawingController } from '@omegajump-core/drawing';
import { OjAnimation } from '@omegajump-core/entities/animations';

export class Animator {
  private readonly animations: OjAnimation[] = [];

  public addAnimation(animation: OjAnimation): void {
    this.animations.push(animation);
  }

  public tick(deltaTime: number): void {
    this.animations.forEach(animation => animation.tick(deltaTime));
    this.animations.forEach(animation => {
      if (animation.isFinished()) {
        this.removeAnimation(animation);
      }
    });
  }

  public registerAnimationsForDrawing(drawingController: DrawingController): void {
    this.animations.forEach(animation => drawingController.registerDrawable(animation));
  }

  private removeAnimation(animation: OjAnimation): void {
    const index = this.animations.indexOf(animation);
    this.animations.splice(index, 1);
  }
}
