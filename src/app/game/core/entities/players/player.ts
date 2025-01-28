import { Animator } from '@omegajump-core/control';
import { BaseDrawingUtils, CircleDrawingConfig } from '@omegajump-core/drawing';
import { ZIndex } from '@omegajump-core/enums';
import { GravityType, GravityUtils, MetricsUtils } from '@omegajump-core/physics';
import { CircleCollisionBox, EntityCollider } from '../colliders';
import { callOnTick } from '../entity-hooks';
import { Entity, Position } from '../models';
import { ConfusionEffect, Effect, EffectConstructor } from './effects';
import { PlayerController } from './player-controllers';

export class Player extends Entity {
  public static readonly SIZE = 3;
  private static readonly DELETION_Y_THRESHOLD = -Player.SIZE / 2;
  private static readonly HORIZONTAL_SPEED = 15;
  private static readonly STARTING_Y_POSITION = 0;
  private static readonly INITIAL_VERTICAL_JUMP_HEIGHT = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS * 0.4;
  private static readonly ENERGY_HORIZONTAL_SPEED_BONUS = 0.01;
  private static readonly ENERGY_JUMP_HEIGHT_BONUS = 0.01;

  private energy = 0;
  private readonly effects: Effect[] = [];

  constructor(
    animator: Animator,
    x: number,
    public readonly color: string,
    private readonly controller: PlayerController
  ) {
    const position: Position = { x, y: Player.STARTING_Y_POSITION };
    const collider = new EntityCollider([new CircleCollisionBox(0, 0, Player.SIZE / 2, position)]);
    super(animator, position, collider, ZIndex.PLAYER, Player.DELETION_Y_THRESHOLD);

    this.controller.register();

    this.jump(Player.INITIAL_VERTICAL_JUMP_HEIGHT);
    this.disabled = false;
  }

  public override onTick(deltaTime: number): void {
    super.onTick(deltaTime);
    this.effects.forEach(effect => callOnTick(effect, deltaTime));

    const direction = this.hasEffect(ConfusionEffect) ? -this.controller.direction : this.controller.direction;
    this.position.x += direction * this.getCurrentHorizontalSpeed() * deltaTime;
    this.position.x = Math.max(Player.SIZE / 2, Math.min(MetricsUtils.GAME_WIDTH_IN_OJ_UNITS - Player.SIZE / 2, this.position.x));
  }

  public override onDestroy(): void {
    this.removeEffect();
    this.controller.unregister();
  }

  public jump(height: number): void {
    const modifiedHeight = height * (1 + this.energy * Player.ENERGY_JUMP_HEIGHT_BONUS);
    this.velocity.vertical = GravityUtils.getVerticalVelocityBasedOnDistance(modifiedHeight);
  }

  public collectEnergy(energy = 1): void {
    this.energy += energy;
  }

  public applyEffect(constructor: EffectConstructor, duration: number): void {
    const newEffect = new constructor(this, duration);
    this.effects.push(newEffect);
  }

  public removeEffect(effect?: Effect | EffectConstructor): void {
    if (effect instanceof Effect) {
      this.deleteEffect(effect);
      return;
    }

    this.effects.filter(e => (effect ? e.constructor === effect : true)).forEach(e => this.deleteEffect(e));
  }

  public isFalling(): boolean {
    return this.velocity.vertical < 0;
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    const drawingConfig: CircleDrawingConfig = {
      ...this.position,
      radius: Player.SIZE / 2,
      color: this.color
    };
    BaseDrawingUtils.drawCircle(ctx, drawingConfig);
  }

  public getCurrentHorizontalSpeed(): number {
    return Player.HORIZONTAL_SPEED * (1 + this.energy * Player.ENERGY_HORIZONTAL_SPEED_BONUS);
  }

  public get direction(): number {
    return this.controller.direction;
  }

  protected override getGravityType(): GravityType {
    return GravityType.NORMAL;
  }

  private hasEffect(effectConstructor: EffectConstructor): boolean {
    return this.effects.some(effect => effect instanceof effectConstructor);
  }

  private deleteEffect(effect: Effect): void {
    effect.destroy();
    const index = this.effects.indexOf(effect);
    this.effects.splice(index, 1);
  }
}
