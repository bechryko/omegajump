import { Drawable } from '@omegajump-core/drawing';
import { ControlObjects, ObjectWithAnimations } from '../models';
import { Platform } from '../platforms';

export abstract class PlatformAttribute extends ObjectWithAnimations {
  constructor(
    protected hostPlatform: Platform,
    protected controlObjects: ControlObjects
  ) {
    super();
  }

  public bindNewHost(newHost: Platform): void {
    this.hostPlatform = newHost;
  }

  public getAllDrawables(): Drawable[] {
    return this.animations;
  }
}
