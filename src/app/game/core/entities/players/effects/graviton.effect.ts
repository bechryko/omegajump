import { PresetAnimationFactory } from '@omegajump-core/entities/animations';
import { OnJump } from '@omegajump-core/entities/entity-hooks';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { GravityType } from '@omegajump-core/physics';
import { Player } from '../player';
import { Effect, EffectCreationConfig } from './models';

export class GravitonEffect extends Effect implements OnJump {
  private static readonly GRAVITON_SHOCK_RANGE = 6;
  private static readonly GRAVITON_SHOCK_COLOR = '#30506e';
  private static readonly GRAVITON_SHOCK_OPACITY = 0.5;
  private static readonly GRAVITON_SHOCK_ANIMATION_SPEED = 75;
  private static readonly APPLIED_GRAVITY_TYPE = GravityType.NORMAL;

  private readonly gravitonShocks: boolean;

  constructor(host: Player, controlObjects: ControlObjects, creationConfig: EffectCreationConfig) {
    super(host, controlObjects, creationConfig);

    this.gravitonShocks = Boolean(creationConfig.gravitonShocks);
  }

  public onJump(platform: Platform): void {
    if (!this.gravitonShocks) {
      platform.overrideGravity(GravitonEffect.APPLIED_GRAVITY_TYPE);
    } else {
      this.controlObjects.platformHandler
        .getCurrentPlatforms()
        .filter(p => p.distanceTo(platform) < GravitonEffect.GRAVITON_SHOCK_RANGE)
        .forEach(p => p.overrideGravity(GravitonEffect.APPLIED_GRAVITY_TYPE));
      this.controlObjects.animator.addAnimation(
        PresetAnimationFactory.createExplosion({
          position: this.host.position,
          radius: GravitonEffect.GRAVITON_SHOCK_RANGE,
          color: GravitonEffect.GRAVITON_SHOCK_COLOR,
          opacity: GravitonEffect.GRAVITON_SHOCK_OPACITY,
          animationSpeed: GravitonEffect.GRAVITON_SHOCK_ANIMATION_SPEED
        })
      );
    }
  }
}
