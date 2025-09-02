import { Effect } from './effect';

export interface EffectCreationConfig {
  duration: number;
  existenceLinkedEffect?: Effect;
  gravitonShocks?: boolean;
  tripleJump?: boolean;
}
