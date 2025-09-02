import { Drawable } from '@omegajump-core/drawing';
import { GravityType, GravityUtils } from '@omegajump-core/physics';
import { EntityCollider } from '../colliders';
import { ControlObjects } from './control-objects';
import { ObjectWithAnimations } from './object-with-animations';
import { Position } from './position';
import { Vector } from './vector';
import { Velocity } from './velocity';

export abstract class Entity extends ObjectWithAnimations implements Drawable {
  public readonly velocity: Velocity = {
    vertical: 0,
    horizontal: 0
  };
  public disabled = true;

  constructor(
    protected readonly controlObjects: ControlObjects,
    public readonly position: Position,
    public readonly collider: EntityCollider,
    public readonly zIndex: number,
    public readonly deletionYThreshold: number
  ) {
    super();
  }

  public override onTick(deltaTime: number): void {
    this.position.x += this.velocity.horizontal * deltaTime;
    this.position.y += this.velocity.vertical * deltaTime;

    this.velocity.vertical -= this.getGravityType() * deltaTime;
    if (this.getGravityType() === GravityType.FLOATING) {
      this.decreaseSpeedByGravity(deltaTime, 'vertical');
    }
    this.decreaseSpeedByGravity(deltaTime, 'horizontal');

    super.onTick(deltaTime);
  }

  public getAllDrawables(): Drawable[] {
    return [this, ...this.animations];
  }

  public destroy(): void {
    this.onDestroy();
    this.disabled = true;
  }

  public distanceTo({ position }: { position: Position }): number {
    return Math.sqrt((this.position.x - position.x) ** 2 + (this.position.y - position.y) ** 2);
  }

  public distanceToVector({ position }: { position: Position }): Vector {
    return {
      x: position.x - this.position.x,
      y: position.y - this.position.y
    };
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;

  protected abstract getGravityType(): GravityType;

  private decreaseSpeedByGravity(deltaTime: number, speedType: keyof typeof this.velocity): void {
    const velocitySign = Math.sign(this.velocity[speedType]);
    this.velocity[speedType] -= GravityUtils.PASSIVE_GRAVITY * velocitySign * deltaTime;
    if (velocitySign !== Math.sign(this.velocity[speedType])) {
      this.velocity[speedType] = 0;
    }
  }
}
