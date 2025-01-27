import { DrawingController } from '@omegajump-core/drawing';
import { OjAnimation } from '@omegajump-core/entities/animations';

export class Animator {
  private readonly animations: OjAnimation[] = [];
  private readonly entityAnimations: OjAnimation[] = [];

  public addAnimation(animation: OjAnimation): void {
    this.animations.push(animation);
  }

  public addEntityAnimation(animation: OjAnimation): void {
    this.entityAnimations.push(animation);
  }

  public tick(deltaTime: number): void {
    this.animations.forEach(animation => animation.tick(deltaTime));
    [this.animations, this.entityAnimations].forEach(animationArray => {
      animationArray.forEach(animation => {
        if (animation.isFinished()) {
          this.removeAnimation(animationArray, animation);
        }
      });
    });
  }

  public registerAnimationsForDrawing(drawingController: DrawingController): void {
    [...this.animations, ...this.entityAnimations].forEach(animation => drawingController.registerDrawable(animation));
  }

  private removeAnimation(array: OjAnimation[], animation: OjAnimation): void {
    const index = array.indexOf(animation);
    array.splice(index, 1);
  }
}
