import { OnPlayerJump } from '../entity-hooks';
import { ControlObjects } from '../models';
import { InvisibleAttribute } from '../platform-attributes';
import { Player } from '../players';
import { Platform } from './platform';

export class CloakerPlatform extends Platform implements OnPlayerJump {
  private static readonly IMAGE_SRC = 'images/platforms/cloaker.png';

  private static readonly CLOAKING_RANGE = 15;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, CloakerPlatform.IMAGE_SRC);
  }

  public override onPlayerJump(player: Player): void {
    super.onPlayerJump(player);

    this.controlObjects.platformHandler
      .getCurrentPlatforms()
      .filter(platform => platform.distanceTo(this) < CloakerPlatform.CLOAKING_RANGE)
      .forEach(platform => {
        platform.addAttribute(InvisibleAttribute);
      });
  }
}
