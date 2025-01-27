import { PlatformAttributeConstructor } from './platform-attribute-constructor';

export interface PlatformAttributeSpawningConfig {
  constructor: PlatformAttributeConstructor;
  spawnChance: number;
}
