import { ControlObjects } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';

export type PlatformConstructor = new (controlObjects: ControlObjects) => Platform;
