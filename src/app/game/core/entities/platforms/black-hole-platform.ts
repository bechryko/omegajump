import { ZIndex } from '@omegajump-core/enums';
import { PresetAnimationUtils } from '../animations';
import { ControlObjects } from '../models';
import { BoosterAttribute } from '../platform-attributes';
import { Player } from '../players';
import { Platform } from './platform';

export class BlackHolePlatform extends Platform {
  private static readonly IMAGE_SRC = 'images/platforms/black_hole.png';

  private static readonly PULL_STRENGTH = 0.1;
  private static readonly BOOSTED_PULL_STRENGTH = 0.25;
  private static readonly PULLING_BEAM_COLOR = '#060020';
  private static readonly PULLING_BEAM_WIDTH = 1.1;
  private static readonly PULLING_BEAM_DURATION = 0.2;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, BlackHolePlatform.IMAGE_SRC);
  }

  public override onPlayerJump(player: Player): void {
    super.onPlayerJump(player);

    this.controlObjects.platformHandler.getCurrentPlatforms().forEach(platform => {
      if (platform === this) {
        return;
      }

      const distance = platform.distanceToVector(this);
      platform.position.x += distance.x * this.pullStrength;
      platform.position.y += distance.y * this.pullStrength;

      this.controlObjects.animator.addAnimation(
        PresetAnimationUtils.createBeam({
          object1: this,
          object2: platform,
          color: BlackHolePlatform.PULLING_BEAM_COLOR,
          startingWidth: BlackHolePlatform.PULLING_BEAM_WIDTH,
          startingOpacity: 1,
          finalOpacity: 0,
          duration: BlackHolePlatform.PULLING_BEAM_DURATION,
          zIndex: ZIndex.BLACK_HOLE_PLATFORM_PULLING_BEAM
        })
      );
    });
  }

  private get pullStrength(): number {
    return this.hasAttribute(BoosterAttribute) ? BlackHolePlatform.BOOSTED_PULL_STRENGTH : BlackHolePlatform.PULL_STRENGTH;
  }
}
