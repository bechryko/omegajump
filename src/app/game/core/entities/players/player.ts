import { BaseDrawingUtils, CircleDrawingConfig } from '@omegajump-core/drawing';
import { ZIndex } from '@omegajump-core/enums';
import { GravityType, GravityUtils, MetricsUtils } from '@omegajump-core/physics';
import { UiDataUtils } from '@omegajump-game';
import { CircleCollisionBox, EntityCollider } from '../colliders';
import { BeforeJump, callBeforeJump, callOnJump, callOnTick } from '../entity-hooks';
import { ControlObjects, Entity, Position, PowerCellCombo } from '../models';
import { Platform } from '../platforms';
import { ConfusionEffect, Effect, EffectApplicationConfig, EffectConstructor, EnergySpeedEffect } from './effects';
import { PlayerController } from './player-controllers';

export class Player extends Entity implements BeforeJump {
  public static readonly SIZE = 3;
  private static readonly DELETION_Y_THRESHOLD = -Player.SIZE / 2;
  private static readonly HORIZONTAL_SPEED = 15;
  private static readonly STARTING_Y_POSITION = 0;
  private static readonly INITIAL_VERTICAL_JUMP_HEIGHT = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS * 0.4;
  private static readonly ENERGY_HORIZONTAL_SPEED_BONUS = 0.01;
  private static readonly ENERGY_JUMP_HEIGHT_BONUS = 0.01;

  public energy = 0;
  private readonly effects: Effect[] = [];
  public readonly powerCellCombo: PowerCellCombo;

  constructor(
    controlObjects: ControlObjects,
    x: number,
    public readonly color: string,
    protected readonly controller: PlayerController
  ) {
    const position: Position = { x, y: Player.STARTING_Y_POSITION };
    const collider = new EntityCollider([new CircleCollisionBox(0, 0, Player.SIZE / 2, position)]);
    super(controlObjects, position, collider, ZIndex.PLAYER, Player.DELETION_Y_THRESHOLD);

    this.powerCellCombo = {
      combo: 0,
      expiration: 0
    };
    this.controller.register();

    this.jump(Player.INITIAL_VERTICAL_JUMP_HEIGHT);
    this.disabled = false;
  }

  public override onTick(deltaTime: number): void {
    super.onTick(deltaTime);
    this.effects.forEach(effect => callOnTick(effect, deltaTime));

    const direction = this.hasEffect(ConfusionEffect) ? -this.controller.direction : this.controller.direction;
    this.position.x += direction * this.getCurrentHorizontalSpeed() * deltaTime;
    this.checkSideCollision();

    if (this.powerCellCombo.combo > 0) {
      this.powerCellCombo.expiration -= deltaTime;

      if (this.powerCellCombo.expiration <= 0) {
        this.powerCellCombo.combo = 0;
        this.powerCellCombo.expiration = 0;
      }
    }

    UiDataUtils.exportPlayer(this);
  }

  public override onDestroy(): void {
    this.removeEffect();
    this.controller.unregister();
  }

  public beforeJump(platform: Platform): void {
    this.effects.forEach(effect => callBeforeJump(effect, platform));
  }

  public jump(height: number, platform?: Platform): void {
    const modifiedHeight = height * (1 + this.energy * Player.ENERGY_JUMP_HEIGHT_BONUS);
    this.velocity.vertical = GravityUtils.getVerticalVelocityBasedOnDistance(modifiedHeight);

    if (platform) {
      this.effects.forEach(effect => callOnJump(effect, platform));
    }
  }

  public collectEnergy(energy = 1): void {
    this.energy += energy;
  }

  public applyEffect<T extends Effect>(constructor: EffectConstructor<T>, applicationConfig: EffectApplicationConfig): T {
    const existingEffect = this.getAppliedEffect(constructor);
    if (existingEffect) {
      const duration = applicationConfig.creationConfig.duration;
      if (applicationConfig.shouldAddToExisting) {
        existingEffect.extendDuration(duration);
        return existingEffect;
      }

      if (applicationConfig.unique) {
        existingEffect.extendDurationTo(duration);
        return existingEffect;
      }
    }

    const newEffect = new constructor(this, this.controlObjects, applicationConfig.creationConfig);
    this.effects.push(newEffect);
    return newEffect;
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

    this.effects.forEach(effect => effect.draw(ctx));
  }

  public getCurrentHorizontalSpeed(): number {
    let speedMultiplier = 1;
    speedMultiplier += this.energy * Player.ENERGY_HORIZONTAL_SPEED_BONUS;
    if (this.hasEffect(EnergySpeedEffect)) {
      speedMultiplier *= 1 + EnergySpeedEffect.SPEED_BONUS;
    }
    return Player.HORIZONTAL_SPEED * speedMultiplier;
  }

  public get direction(): number {
    return this.controller.direction;
  }

  public hasEffect(effectConstructor: EffectConstructor): boolean {
    return Boolean(this.getAppliedEffect(effectConstructor));
  }

  public getAppliedEffect<T extends Effect>(effectConstructor: EffectConstructor<T>): T | undefined {
    return this.effects.sort((a, b) => a.compareTo(b)).find((effect): effect is T => effect instanceof effectConstructor);
  }

  public extractCopyConfig(): [string, PlayerController] {
    return [this.color, this.controller];
  }

  protected override getGravityType(): GravityType {
    return GravityType.NORMAL;
  }

  protected checkSideCollision(playerSize = Player.SIZE): void {
    this.position.x = Math.max(playerSize / 2, Math.min(MetricsUtils.GAME_WIDTH_IN_OJ_UNITS - playerSize / 2, this.position.x));
  }

  private deleteEffect(effect: Effect): void {
    const index = this.effects.indexOf(effect);
    this.effects.splice(index, 1);
    effect.destroy();
  }
}
