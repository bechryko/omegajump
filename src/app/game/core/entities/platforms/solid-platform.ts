import { ControlObjects } from '../models';
import { Platform } from './platform';

export class SolidPlatform extends Platform {
  private static readonly IMAGE_SRC = 'images/platforms/solid.png';

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, SolidPlatform.IMAGE_SRC);
  }
}
