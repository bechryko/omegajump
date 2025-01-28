import { GameRandomUtils } from '@omegajump-core/control';
import { PresetAnimationUtils } from '../animations';
import { OnPlayerJump } from '../entity-hooks';
import { EnergyPlatform, SolidPlatform } from '../platforms';
import { Player } from '../players';
import { PlatformAttribute } from './platform-attribute';

export class ActivatorAttribute extends PlatformAttribute implements OnPlayerJump {
  private static readonly ACTIVATOR_LINE_ANIMATION_DURATION = 0.5;
  private static readonly ACTIVATOR_LINE_STARTING_WIDTH = 0.5;
  private static readonly ACTIVATOR_LINE_COLOR = '#bd9c38';

  public onPlayerJump(player: Player): void {
    const availablePlatforms = this.controlObjects.platformHandler
      .getCurrentPlatforms()
      .filter(platform => platform !== this.hostPlatform && !(platform instanceof SolidPlatform));
    if (!availablePlatforms.length) {
      return;
    }

    const platform = GameRandomUtils.choose(availablePlatforms);
    platform.onPlayerJump(player);

    if (platform instanceof EnergyPlatform) {
      this.activateEnergyPlatform(platform);
    }

    this.controlObjects.animator.addAnimation(
      PresetAnimationUtils.createBlinkLine({
        object1: this.hostPlatform,
        object2: platform,
        width: ActivatorAttribute.ACTIVATOR_LINE_STARTING_WIDTH,
        color: ActivatorAttribute.ACTIVATOR_LINE_COLOR,
        duration: ActivatorAttribute.ACTIVATOR_LINE_ANIMATION_DURATION
      })
    );
  }

  private activateEnergyPlatform(platform: EnergyPlatform): void {
    platform.refresh();
  }
}
