import { LocationControllerConstructor } from '@omegajump-core/location-controllers';
import { PlatformAttributeSpawningConfig } from './platform-attribute-spawning-config';
import { PlatformSpawningConfig } from './platform-spawning-config';

export interface GameConfigLocationPart {
  locationController: LocationControllerConstructor;
  averagePlatformDensity: number;
  platformDistanceFluctuation: number;
  platformSpawning: PlatformSpawningConfig[];
  attributeSpawning: PlatformAttributeSpawningConfig[];
}
