import { PlatformSpawningConfig } from '@omegajump-core/configuration';
import { ControlObjects, PlatformCreationConfig } from '../models';
import { Player } from '../players';
import { BlackHolePlatform } from './black-hole-platform';
import { CloakerPlatform } from './cloaker-platform';
import { ConfusePlatform } from './confuse-platform';
import { EnergyPlatform, EnergyState } from './energy-platform';
import { Platform } from './platform';

export class TransformerPlatform extends Platform {
  private static readonly IMAGE_SRC = 'images/platforms/transformer.png';

  private static readonly SPAWNING_CONFIG: PlatformSpawningConfig[] = [
    {
      constructor: EnergyPlatform,
      additionalCreationConfig: {
        energyState: EnergyState.BLUE
      },
      spawningWeight: 2
    },
    {
      constructor: EnergyPlatform,
      spawningWeight: 1
    },
    {
      constructor: ConfusePlatform,
      spawningWeight: 4
    },
    {
      constructor: BlackHolePlatform,
      spawningWeight: 4
    },
    {
      constructor: CloakerPlatform,
      spawningWeight: 4
    },
    {
      constructor: TransformerPlatform,
      spawningWeight: 4
    }
  ];

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, TransformerPlatform.IMAGE_SRC);
  }

  public override onPlayerJump(player: Player): Platform {
    super.onPlayerJump(player);

    const platformConfigs: PlatformCreationConfig[] = [];
    this.controlObjects.platformHandler.getCurrentPlatforms().forEach(platform => {
      if (platform === this) {
        return;
      }

      platformConfigs.push(platform.extractCreationConfig());
      platform.destroy();
    });

    platformConfigs.forEach(platformConfig =>
      this.controlObjects.platformHandler.spawnPlatform(TransformerPlatform.SPAWNING_CONFIG, [], platformConfig)
    );

    const ownConfig = this.extractCreationConfig();
    this.destroy();
    return this.controlObjects.platformHandler.spawnPlatform(TransformerPlatform.SPAWNING_CONFIG, [], ownConfig);
  }
}
