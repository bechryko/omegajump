import { GameConfigGeneralPart } from './game-config-general-part';
import { GameConfigLocationPart } from './game-config-location-part';

export type GameConfig = GameConfigGeneralPart & GameConfigLocationPart;
