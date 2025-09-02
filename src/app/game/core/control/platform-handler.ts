import {
  PlatformAttributeConstructor,
  PlatformAttributeSpawningConfig,
  PlatformConstructor,
  PlatformSpawningConfig
} from '@omegajump-core/configuration';
import { ControlObjects, PlatformCreationConfig } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { GameRandomUtils } from './game-random.utils';

export class PlatformHandler {
  private readonly platformPoolMap: Record<string, Platform[]> = {};

  constructor(private readonly controlObjects: ControlObjects) {
    // Do not use the controlObjects property in the constructor due to it can be incomplete.
  }

  public spawnPlatform(
    spawningConfigs: readonly PlatformSpawningConfig[],
    attributeConfig: readonly PlatformAttributeSpawningConfig[],
    creationConfig: Readonly<PlatformCreationConfig>
  ): Platform {
    const spawningPlatformConfig = GameRandomUtils.weightedElement(spawningConfigs, 'spawningWeight');
    const additionalCreationConfig = spawningPlatformConfig.additionalCreationConfig ?? {};

    const modifiedAttributeConfig = [...attributeConfig];
    spawningPlatformConfig.attributes?.forEach(platformSpawningAttributeConfig => {
      const existingAttributeIndex = modifiedAttributeConfig.findIndex(
        config => config.constructor === platformSpawningAttributeConfig.constructor
      );
      if (existingAttributeIndex !== -1) {
        modifiedAttributeConfig.splice(existingAttributeIndex, 1, platformSpawningAttributeConfig);
      } else {
        modifiedAttributeConfig.push(platformSpawningAttributeConfig);
      }
    });

    const modifiedCreationConfig: Readonly<PlatformCreationConfig> = {
      attributes: this.generateAttributeList(modifiedAttributeConfig),
      ...additionalCreationConfig,
      ...creationConfig
    };

    const pool = this.platformPoolMap[spawningPlatformConfig.constructor.name] ?? [];
    if (pool.length === 0) {
      this.platformPoolMap[spawningPlatformConfig.constructor.name] = pool;
    }
    const availablePoolItemIndex = pool.findIndex(platform => platform.disabled);
    if (availablePoolItemIndex === -1) {
      const newPlatform = new spawningPlatformConfig.constructor(this.controlObjects);
      newPlatform.create(modifiedCreationConfig);
      pool.push(newPlatform);
      return newPlatform;
    }
    pool[availablePoolItemIndex].create(modifiedCreationConfig);
    return pool[availablePoolItemIndex];
  }

  public copyPlatform<T extends Platform>(platform: T): T {
    const creationConfig = platform.extractCreationConfig();
    const newPlatform = this.spawnPlatform(
      [
        {
          constructor: platform.constructor as PlatformConstructor,
          spawningWeight: 1
        }
      ],
      [],
      creationConfig
    );
    newPlatform.disabled = true;
    return newPlatform as T;
  }

  public getCurrentPlatforms(excludeDisabled = true): Platform[] {
    let platforms = Object.values(this.platformPoolMap).flat();
    if (excludeDisabled) {
      platforms = platforms.filter(platform => !platform.disabled);
    }
    return platforms;
  }

  private generateAttributeList(attributeConfigs: readonly PlatformAttributeSpawningConfig[]): PlatformAttributeConstructor[] {
    const list: PlatformAttributeConstructor[] = [];
    attributeConfigs.forEach(attributeConfig => {
      if (GameRandomUtils.chance(attributeConfig.spawnChance)) {
        list.push(attributeConfig.constructor);
      }
    });
    return list;
  }
}
