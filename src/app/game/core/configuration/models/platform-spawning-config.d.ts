import { PlatformCreationConfig } from '@omegajump-core/entities/models';
import { PlatformAttributeSpawningConfig } from './platform-attribute-spawning-config';
import { PlatformConstructor } from './platform-constructor';

export interface PlatformSpawningConfig {
  constructor: PlatformConstructor;
  additionalCreationConfig?: Partial<PlatformCreationConfig>;
  spawningWeight: number;
  attributes?: PlatformAttributeSpawningConfig[];
}
