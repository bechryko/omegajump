import { PlatformAttributeConstructor, PlatformAttributeSpawningConfig, PlatformSpawningConfig } from '@omegajump-core/configuration';
import { ControlObjects, PlatformCreationConfig } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { GameRandomUtils } from './game-random.utils';

export class PlatformHandler {
  private platformPoolMap: Record<string, Platform[]> = {};

  constructor(private readonly controlObjects: Omit<ControlObjects, 'platformHandler'>) {}

  public spawnPlatform(
    spawningConfigs: readonly PlatformSpawningConfig[],
    attributeConfig: readonly PlatformAttributeSpawningConfig[],
    creationConfig: Readonly<PlatformCreationConfig>
  ): Platform {
    const spawningPlatformConfig = GameRandomUtils.weightedElement(spawningConfigs, 'spawningWeight');
    const additionalCreationConfig = spawningPlatformConfig.additionalCreationConfig ?? {};
    const modifiedAttributeConfig = [...attributeConfig];
    spawningPlatformConfig.attributes?.forEach(attributeConfig => {
      const existingAttributeIndex = modifiedAttributeConfig.findIndex(config => config.constructor === attributeConfig.constructor);
      if (existingAttributeIndex !== -1) {
        modifiedAttributeConfig.splice(existingAttributeIndex, 1, attributeConfig);
      } else {
        modifiedAttributeConfig.push(attributeConfig);
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
      const newPlatform = new spawningPlatformConfig.constructor(this.completeControlObjects);
      newPlatform.create(modifiedCreationConfig);
      pool.push(newPlatform);
      return newPlatform;
    }
    pool[availablePoolItemIndex].create(modifiedCreationConfig);
    return pool[availablePoolItemIndex];
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

  private get completeControlObjects(): ControlObjects {
    return {
      ...this.controlObjects,
      platformHandler: this
    };
  }
}
