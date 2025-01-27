import { Player } from '../player';
import { Effect } from './effect';

export interface EffectConstructor {
  new (host: Player, duration: number): Effect;
}
