import { ControlObjects } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';

export interface PlatformConstructor {
  new (controlObjects: ControlObjects): Platform;
}
