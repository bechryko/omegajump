import { Animator } from '@omegajump-core/control';
import { GravityType } from '@omegajump-core/physics';
import { EntityCollider } from '../colliders';
import { Entity } from './entity';
import { TemporaryEntityConfig } from './temporary-entity-config';

export class TemporaryEntity extends Entity {
  constructor(
    private readonly config: TemporaryEntityConfig,
    animator: Animator
  ) {
    super(animator, { ...config.position }, config.collider ?? new EntityCollider([]), config.zIndex, config.deletionYThreshold);
    this.disabled = false;
  }

  public override onTick(deltaTime: number): void {
    this.resetVelocityIfLocked();
    super.onTick(deltaTime);
    this.resetVelocityIfLocked();
    this.config.onTickFn?.(deltaTime, this);
    this.resetVelocityIfLocked();
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    this.config.drawFn(ctx, this);
  }

  protected override getGravityType(): GravityType {
    return this.config.getGravityTypeFn?.(this) ?? GravityType.FLOATING;
  }

  private resetVelocityIfLocked(): void {
    if (!this.config.lockedInPlace) {
      return;
    }

    this.velocity.horizontal = 0;
    this.velocity.vertical = 0;
  }
}
