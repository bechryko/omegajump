import { ControlObjects } from '@omegajump-core/entities/models';
import { PlatformAttribute } from '@omegajump-core/entities/platform-attributes';
import { Platform } from '@omegajump-core/entities/platforms';

export interface PlatformAttributeConstructor {
  new (hostPlatform: Platform, controlObjects: ControlObjects): PlatformAttribute;
}
