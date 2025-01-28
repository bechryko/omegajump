import { PlayerConfig } from './player-config';

export interface GameConfigGeneralPart {
  seed?: string;
  playerConfigs: PlayerConfig[];
}
