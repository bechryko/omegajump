import { Animator } from '@omegajump-core/control';
import { Drawable } from '@omegajump-core/drawing';
import { GravityType, GravityUtils } from '@omegajump-core/physics';
import { EntityCollider } from '../colliders';
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
    animator: Animator,
    public readonly position: Position,
    public readonly collider: EntityCollider,
    public readonly zIndex: number,
    public readonly deletionYThreshold: number
  ) {
    super(animator);
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

  public destroy(): void {
    this.onDestroy();
    this.disabled = true;
  }

  public distanceTo({ position }: { position: Position }): number {
    return Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2));
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
