import { ControlObjects } from '@omegajump-core/entities/models';
import { ChaosWildcard } from './chaos-wildcard';
import { GlobalWildcardData } from './global-wildcard-data';

export type ChaosWildcardConstructor = new (controlObjects: ControlObjects, globalData: GlobalWildcardData) => ChaosWildcard;
