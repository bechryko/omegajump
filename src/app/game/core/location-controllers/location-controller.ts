import { Drawable } from '@omegajump-core/drawing';
import { ControlObjects } from '@omegajump-core/entities/models';
import { ZIndex } from '@omegajump-core/enums';

export abstract class LocationController implements Drawable {
  constructor(
    protected readonly controlObjects: ControlObjects,
    public readonly zIndex = ZIndex.UNUSED
  ) {}

  public abstract tick(deltaTime: number): void;

  public draw(ctx: CanvasRenderingContext2D): void {}
}
