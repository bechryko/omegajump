import { EffectCreationConfig } from './effect-creation-config';

export interface EffectApplicationConfig {
  creationConfig: EffectCreationConfig;
  unique?: boolean;
  shouldAddToExisting?: boolean;
}
