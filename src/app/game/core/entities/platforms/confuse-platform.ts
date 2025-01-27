import { ControlObjects } from '../models';
import { ConfusionEffect, Player } from '../players';
import { Platform } from './platform';

export class ConfusePlatform extends Platform {
  private static readonly IMAGE_SRC = 'images/platforms/confuse.png';

  private static readonly CONFUSION_DURATION = 5;
  private static readonly JUMP_HEIGHT = 12;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, ConfusePlatform.IMAGE_SRC, ConfusePlatform.JUMP_HEIGHT);
  }

  public override onPlayerJump(player: Player): void {
    super.onPlayerJump(player);

    player.applyEffect(ConfusionEffect, ConfusePlatform.CONFUSION_DURATION);
  }
}
