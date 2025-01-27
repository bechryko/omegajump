import { ControlKeys } from '@omegajump-core/entities/players';
import { PlayerConfig } from '../models';

export const defaultPlayerConfigs: PlayerConfig[] = [
  {
    color: '#800080',
    controls: {
      [ControlKeys.LEFT]: 'KeyA',
      [ControlKeys.RIGHT]: 'KeyD'
    }
  }
];
