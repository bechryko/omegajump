import { Drawable } from '@omegajump-core/drawing';
import { ControlObjects } from '@omegajump-core/entities/models';
import { ZIndex } from '@omegajump-core/enums';

export abstract class LocationController implements Drawable {
  constructor(
    protected readonly controlObjects: ControlObjects,
    public readonly zIndex = ZIndex.UNUSED
  ) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  public draw(ctx: CanvasRenderingContext2D): void {}
  /* eslint-enable @typescript-eslint/no-empty-function */
  /* eslint-enable @typescript-eslint/no-unused-vars */

  public abstract tick(deltaTime: number): void;
}
