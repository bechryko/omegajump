import { ControlObjects } from '@omegajump-core/entities/models';
import { LocationController } from './location-controller';

export interface LocationControllerConstructor {
  new (controlObjects: ControlObjects): LocationController;
}
