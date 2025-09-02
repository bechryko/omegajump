import { OjAnimation } from '../animations';
import { OnDestroy, OnTick } from '../entity-hooks';

export abstract class ObjectWithAnimations implements OnTick, OnDestroy {
  protected readonly animations: OjAnimation[] = [];

  public addAnimation(animation: OjAnimation): void {
    this.animations.push(animation);
  }

  public onTick(deltaTime: number): void {
    this.animations.forEach(animation => {
      animation.tick(deltaTime);
    });
    this.deleteFinishedAnimations();
  }

  public onDestroy(): void {
    this.animations.forEach(animation => animation.finish());
    this.animations.splice(0, this.animations.length);
  }

  private deleteFinishedAnimations(): void {
    this.animations.forEach(animation => {
      if (animation.isFinished()) {
        this.animations.splice(this.animations.indexOf(animation), 1);
      }
    });
  }
}
