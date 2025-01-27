import { PlatformAttributeConstructor } from '@omegajump-core/configuration';
import { GravityType } from '@omegajump-core/physics';
import { PlatformAttribute } from '../platform-attributes';
import { EnergyState } from '../platforms';
import { Position } from './position';
import { Velocity } from './velocity';

export interface PlatformCreationConfig {
  position: Position;
  velocity?: Velocity;
  attributes?: Array<PlatformAttribute | PlatformAttributeConstructor>;
  customGravityType?: GravityType;
  energyState?: EnergyState;
}
