import { AnimationLinkFactory, CircleAnimation, OjAnimation } from '@omegajump-core/entities/animations';
import { AnimationRepeat } from '@omegajump-core/entities/animations/enums';
import { ControlObjects } from '@omegajump-core/entities/models';
import { ZIndex } from '@omegajump-core/enums';
import { CameraUtils } from '@omegajump-core/physics';
import { Player } from '../player';
import { Effect, EffectCreationConfig } from './models';

export class ShieldEffect extends Effect {
  private static readonly FINAL_PROTECTION_JUMP_HEIGHT = 15;
  private static readonly MAX_DURATION_AFTER_FINAL_PROTECTION = 3;
  private static readonly SHIELD_ANIMATION_RADIUS = 2;
  private static readonly SHIELD_ANIMATION_LINE_WIDTH = 0.5;
  private static readonly SHIELD_ANIMATION_COLOR = '#00b7a8';
  private static readonly SHIELD_ANIMATION_LOWEST_OPACITY = 0.1;
  private static readonly SHIELD_ANIMATION_DURATION = 0.75;

  public readonly animation: OjAnimation;

  constructor(host: Player, controlObjects: ControlObjects, creationConfig: EffectCreationConfig) {
    super(host, controlObjects, creationConfig);

    this.animation = this.addAnimation();
  }

  public override onTick(deltaTime: number): void {
    if (this.host.position.y < CameraUtils.y + Player.SIZE / 2) {
      this.host.position.y = CameraUtils.y + Player.SIZE / 2;
      this.host.jump(ShieldEffect.FINAL_PROTECTION_JUMP_HEIGHT);
      this.duration = Math.min(this.duration, ShieldEffect.MAX_DURATION_AFTER_FINAL_PROTECTION);
    }

    super.onTick(deltaTime);
  }

  public override destroy(): void {
    if (!this.host.hasEffect(ShieldEffect)) {
      this.animation.finish();
    }
    super.destroy();
  }

  private addAnimation(): OjAnimation {
    const otherShieldEffect = this.host.getAppliedEffect(ShieldEffect);

    if (otherShieldEffect) {
      return otherShieldEffect.animation;
    }

    const animation = new CircleAnimation(
      {
        x: 0,
        y: 0,
        radius: ShieldEffect.SHIELD_ANIMATION_RADIUS,
        color: ShieldEffect.SHIELD_ANIMATION_COLOR,
        isStroke: true,
        lineWidth: ShieldEffect.SHIELD_ANIMATION_LINE_WIDTH,
        opacity: 1
      },
      {
        opacity: ShieldEffect.SHIELD_ANIMATION_LOWEST_OPACITY
      },
      {
        duration: ShieldEffect.SHIELD_ANIMATION_DURATION,
        zIndex: ZIndex.PLAYER_EFFECTS,
        link: AnimationLinkFactory.createPositionLink(this.host),
        repeat: AnimationRepeat.REVERSE
      }
    );
    this.host.addAnimation(animation);
    return animation;
  }
}
