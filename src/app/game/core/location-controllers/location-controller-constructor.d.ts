import { ControlObjects } from '@omegajump-core/entities/models';
import { LocationController } from './location-controller';

export type LocationControllerConstructor = new (controlObjects: ControlObjects) => LocationController;
