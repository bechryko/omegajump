import { ControlObjects } from '@omegajump-core/entities/models';
import { Player } from '../../player';
import { Effect } from './effect';
import { EffectCreationConfig } from './effect-creation-config';

export type EffectConstructor<T extends Effect = Effect> = new (
  host: Player,
  controlObjects: ControlObjects,
  creationConfig: EffectCreationConfig
) => T;
