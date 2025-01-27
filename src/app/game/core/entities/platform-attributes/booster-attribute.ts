import { ZIndex } from '@omegajump-core/enums';
import { ImageAnimation, OjAnimation } from '../animations';
import { OnPlayerJump } from '../entity-hooks';
import { ControlObjects } from '../models';
import { Platform } from '../platforms';
import { Player } from '../players';
import { InvisibleAttribute } from './invisible-attribute';
import { PlatformAttribute } from './platform-attribute';

export class BoosterAttribute extends PlatformAttribute implements OnPlayerJump {
  private static readonly ANIMATION_SRC = 'animations/attributes/booster.png';
  private static readonly ANIMATION_HEIGHT_RATIO = 1.5;
  private static readonly ANIMATION_WIDTH_RATIO = 1.2;
  private static readonly ANIMATION_FRAME_NUMBER = 16;
  private static readonly ANIMATION_DURATION = 1.6;

  private static readonly JUMP_HEIGHT_MODIFIER_PER_STACK = 1.2;

  private jumpStacks = 1;

  constructor(hostPlatform: Platform, controlObjects: ControlObjects) {
    super(hostPlatform, controlObjects);

    this.addAnimation(this.createAnimation());
  }

  public onPlayerJump(player: Player): void {
    player.jump(this.hostPlatform.jumpHeight * BoosterAttribute.JUMP_HEIGHT_MODIFIER_PER_STACK ** this.jumpStacks);
    this.jumpStacks++;
  }

  private createAnimation(): OjAnimation {
    return new ImageAnimation(
      {
        src: BoosterAttribute.ANIMATION_SRC,
        x: 0,
        y: 0,
        width: Platform.WIDTH * BoosterAttribute.ANIMATION_WIDTH_RATIO,
        height: Platform.HEIGHT * BoosterAttribute.ANIMATION_HEIGHT_RATIO,
        frames: BoosterAttribute.ANIMATION_FRAME_NUMBER,
        totalDuration: BoosterAttribute.ANIMATION_DURATION,
        zIndex: ZIndex.BOOSTER_ATTRIBUTE_ANIMATION,
        invisible: false
      },
      {
        getLinkObject: () => ({
          ...this.hostPlatform.position,
          invisible: this.hostPlatform.hasAttribute(InvisibleAttribute)
        }),
        map: {
          x: 'x',
          y: 'y',
          invisible: 'invisible'
        }
      }
    );
  }
}
