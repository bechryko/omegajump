import { Player } from '../player';
import { Effect } from './effect';

export type EffectConstructor = new (host: Player, duration: number) => Effect;
